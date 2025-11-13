'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import {
  Eye,
  Filter,
  FolderKanban,
  Globe,
  Loader2,
  Lock,
  RefreshCw,
  Search,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Simulation {
  id: string;
  title: string | null;
  user_id: string;
  input_data: {
    goal: string;
    materialType: string;
    composition: string;
    conditions: string;
  };
  ai_result: {
    confidenceScore: number;
  };
  created_at: string;
  tags: string[] | null;
  is_public: boolean | null;
}

export function MySimulationsContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'public' | 'private'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchSimulations = useCallback(async () => {
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Auth error:', userError);
        router.push('/auth/signin');
        return;
      }

      // Fetch user's own simulations
      const { data, error } = await supabase
        .from('simulations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching simulations:', error);
      } else {
        setSimulations((data as Simulation[]) || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    fetchSimulations();
  }, [fetchSimulations]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleTogglePublic = async (simulationId: string, currentStatus: boolean | null) => {
    setUpdatingId(simulationId);
    try {
      const newPublicStatus = !currentStatus;
      const response = await fetch(`/api/simulations/${simulationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_public: newPublicStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update simulation');
      }

      // Update local state
      setSimulations(
        simulations.map(sim =>
          sim.id === simulationId ? { ...sim, is_public: newPublicStatus } : sim
        )
      );
      toast.success(newPublicStatus ? 'Simulation made public' : 'Simulation made private');
    } catch (error) {
      console.error('Error updating simulation:', error);
      toast.error('Failed to update simulation visibility');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (simulationId: string, simulationTitle: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${
          simulationTitle || 'Untitled Simulation'
        }"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(simulationId);
    try {
      const response = await fetch(`/api/simulations/${simulationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete simulation');
      }

      // Remove from local state
      setSimulations(simulations.filter(sim => sim.id !== simulationId));
      toast.success('Simulation deleted successfully');
    } catch (error: any) {
      console.error('Error deleting simulation:', error);
      toast.error(error.message || 'Failed to delete simulation');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSimulations = simulations.filter(sim => {
    const matchesSearch =
      !searchQuery ||
      sim.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.input_data.goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.input_data.materialType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'public' && sim.is_public === true) ||
      (statusFilter === 'private' && (sim.is_public === false || sim.is_public === null));

    return matchesSearch && matchesStatus;
  });

  const publicCount = simulations.filter(s => s.is_public === true).length;
  const privateCount = simulations.filter(
    s => s.is_public === false || s.is_public === null
  ).length;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50'>
      <Navigation className='bg-white/95 backdrop-blur-sm' />

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12 pt-24'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-8 flex justify-between items-start'>
            <div className='space-y-2'>
              <div className='flex items-center gap-3'>
                <div className='p-3 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg'>
                  <FolderKanban className='h-6 w-6' />
                </div>
                <div>
                  <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                    My Simulations
                  </h1>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Personal workspace • Manage your research
                  </p>
                  <p className='text-sm text-gray-600 mt-3 max-w-2xl leading-relaxed'>
                    Access and manage all your simulation results in one place. View detailed
                    reports, share your findings with the research community, or keep them private.
                    Track your research progress and organize your simulations for easy reference.
                  </p>
                </div>
              </div>
              <div className='flex gap-4 mt-4'>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg border shadow-sm transition-all cursor-pointer hover:shadow-md ${
                    statusFilter === 'all'
                      ? 'bg-primary/10 border-primary/50 shadow-md'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div
                    className={`text-xs ${
                      statusFilter === 'all' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Total
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      statusFilter === 'all' ? 'text-primary' : 'text-gray-900'
                    }`}
                  >
                    {simulations.length}
                  </div>
                </button>
                <button
                  onClick={() => setStatusFilter('public')}
                  className={`px-4 py-2 rounded-lg border shadow-sm transition-all cursor-pointer hover:shadow-md ${
                    statusFilter === 'public'
                      ? 'bg-green-100 border-green-400 shadow-md'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div
                    className={`text-xs ${
                      statusFilter === 'public' ? 'text-green-900 font-semibold' : 'text-green-700'
                    }`}
                  >
                    Public
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      statusFilter === 'public' ? 'text-green-900' : 'text-green-900'
                    }`}
                  >
                    {publicCount}
                  </div>
                </button>
                <button
                  onClick={() => setStatusFilter('private')}
                  className={`px-4 py-2 rounded-lg border shadow-sm transition-all cursor-pointer hover:shadow-md ${
                    statusFilter === 'private'
                      ? 'bg-gray-200 border-gray-400 shadow-md'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <div
                    className={`text-xs ${
                      statusFilter === 'private' ? 'text-gray-900 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    Private
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      statusFilter === 'private' ? 'text-gray-900' : 'text-gray-900'
                    }`}
                  >
                    {privateCount}
                  </div>
                </button>
              </div>
            </div>
            <Button
              variant='outline'
              onClick={fetchSimulations}
              disabled={loading}
              className='flex items-center gap-2'
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Search and Filter Bar */}
          <div className='mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm'>
            <div className='flex gap-4 items-center'>
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                <Input
                  placeholder='Search your simulations...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='pl-10 bg-gray-50 border-gray-200'
                />
              </div>
              <div className='flex gap-2 items-center text-sm text-muted-foreground'>
                <Filter className='h-4 w-4' />
                <span>{filteredSimulations.length} results</span>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className='py-12'>
              <LoadingSpinner title='Loading simulations...' />
            </div>
          ) : filteredSimulations.length === 0 ? (
            <Card>
              <CardContent className='py-12 text-center'>
                <p className='text-muted-foreground'>
                  {searchQuery
                    ? 'No simulations match your search.'
                    : "You haven't created any simulations yet."}
                </p>
                <Link href='/dashboard' className='mt-4 inline-block'>
                  <Button>Create Your First Simulation</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-4'>
              {filteredSimulations.map(sim => (
                <Card
                  key={sim.id}
                  className='hover:shadow-md transition-all border-l-4 border-l-primary/50 bg-white'
                >
                  <CardContent className='p-6'>
                    <div className='flex gap-6 items-start'>
                      {/* Left: Main Content */}
                      <div className='flex-1 space-y-3'>
                        <div className='flex items-start justify-between gap-4'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-2'>
                              <CardTitle className='text-lg font-semibold text-gray-900'>
                                {sim.title || 'Untitled Simulation'}
                              </CardTitle>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                  sim.is_public
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-gray-50 text-gray-700 border border-gray-200'
                                }`}
                              >
                                {sim.is_public ? (
                                  <>
                                    <Globe className='mr-1.5 h-3 w-3' />
                                    Public
                                  </>
                                ) : (
                                  <>
                                    <Lock className='mr-1.5 h-3 w-3' />
                                    Private
                                  </>
                                )}
                              </span>
                            </div>
                            <CardDescription className='text-xs text-gray-500'>
                              {format(new Date(sim.created_at), 'PPP')}
                            </CardDescription>
                          </div>
                        </div>
                        <p className='text-sm text-gray-700 line-clamp-2 leading-relaxed'>
                          {sim.input_data.goal}
                        </p>
                        <div className='flex items-center gap-4 flex-wrap'>
                          <span className='inline-flex items-center rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary border border-primary/20'>
                            {sim.input_data.materialType}
                          </span>
                          <div className='flex items-center gap-1.5 text-xs text-gray-600'>
                            <span className='font-medium'>Confidence:</span>
                            <span className='font-semibold text-primary'>
                              {(sim.ai_result.confidenceScore * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className='flex flex-col gap-2 items-end'>
                        <div className='flex gap-2'>
                          <Button
                            variant={sim.is_public ? 'outline' : 'default'}
                            size='sm'
                            onClick={() => handleTogglePublic(sim.id, sim.is_public)}
                            disabled={updatingId === sim.id || deletingId === sim.id}
                            className={sim.is_public ? 'border-gray-300' : ''}
                          >
                            {updatingId === sim.id ? (
                              <Loader2 className='mr-2 h-3.5 w-3.5 animate-spin' />
                            ) : sim.is_public ? (
                              <>
                                <Lock className='mr-2 h-3.5 w-3.5' />
                                Private
                              </>
                            ) : (
                              <>
                                <Globe className='mr-2 h-3.5 w-3.5' />
                                Public
                              </>
                            )}
                          </Button>
                          <Link href={`/results/${sim.id}`}>
                            <Button
                              variant='outline'
                              size='sm'
                              className='border-gray-300'
                              disabled={deletingId === sim.id}
                            >
                              <Eye className='mr-2 h-3.5 w-3.5' />
                              View
                            </Button>
                          </Link>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleDelete(sim.id, sim.title || 'Untitled Simulation')}
                            disabled={updatingId === sim.id || deletingId === sim.id}
                            className='border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700'
                          >
                            {deletingId === sim.id ? (
                              <Loader2 className='mr-2 h-3.5 w-3.5 animate-spin' />
                            ) : (
                              <>
                                <Trash2 className='mr-2 h-3.5 w-3.5' />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
