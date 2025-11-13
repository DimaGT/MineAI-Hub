'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { BookOpen, RefreshCw, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

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
  author?: {
    email: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
    };
  };
}

export function KnowledgeHubContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
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

      // Fetch only public simulations
      // Using explicit boolean true check
      const { data, error } = await supabase
        .from('simulations')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching simulations:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error hint:', error.hint);
        setSimulations([]);
      } else {
        console.log('Fetched public simulations:', data?.length || 0);
        console.log('Simulations data:', data);
        // Filter to ensure only public simulations
        const publicSims = (data || []).filter((sim: any) => sim.is_public === true);
        console.log('Filtered public simulations:', publicSims.length);

        // Fetch author information for each simulation
        const simulationsWithAuthors = await Promise.all(
          publicSims.map(async (sim: any) => {
            try {
              const response = await fetch(`/api/users/${sim.user_id}`);
              const authorData = await response.json();

              return {
                ...sim,
                author: {
                  email: authorData.email || 'Unknown',
                  user_metadata: authorData.user_metadata || {}
                }
              };
            } catch {
              return sim;
            }
          })
        );

        setSimulations(simulationsWithAuthors as Simulation[]);
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

  const filteredSimulations = simulations.filter(sim => {
    const matchesSearch =
      !searchQuery ||
      sim.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.input_data.goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.input_data.materialType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === 'all' || sim.input_data.materialType === filterType;

    return matchesSearch && matchesFilter;
  });

  const uniqueMaterialTypes = Array.from(new Set(simulations.map(s => s.input_data.materialType)));

  return (
    <div className='min-h-screen bg-slate-50'>
      <Navigation className='shadow-sm' />

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12 pt-24'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-10'>
            <div className='bg-white rounded-lg p-8 border border-slate-200'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='p-3 rounded-lg bg-primary/10 text-primary'>
                    <BookOpen className='h-7 w-7' />
                  </div>
                  <div>
                    <h1 className='text-3xl font-bold mb-2 text-slate-900'>Knowledge Hub</h1>
                    <p className='text-slate-600 mb-3'>
                      Discover and explore public research simulations
                    </p>
                    <p className='text-sm text-slate-600 mb-3 max-w-2xl leading-relaxed'>
                      Browse a curated collection of public simulations shared by researchers
                      worldwide. Learn from real-world case studies, explore different material
                      types and processing methods, and gain insights from the research community.
                      Each simulation includes detailed parameters, results, and analysis.
                    </p>
                    <div className='flex items-center gap-2 mt-2 text-sm text-slate-500'>
                      <span className='font-medium text-slate-900'>{simulations.length}</span>
                      <span>public simulations</span>
                    </div>
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
            </div>
          </div>

          {/* Search and Filters */}
          <div className='mb-8'>
            <div className='bg-white rounded-lg p-6 border border-slate-200'>
              <div className='flex gap-4 items-center'>
                <div className='flex-1 relative'>
                  <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5' />
                  <Input
                    placeholder='Search through knowledge library...'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className='pl-12 h-11 border-slate-300 focus:border-primary focus:ring-primary'
                  />
                </div>
                <select
                  className='flex h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-primary focus:ring-primary'
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                >
                  <option value='all'>All Materials</option>
                  {uniqueMaterialTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className='py-12'>
              <LoadingSpinner title='Loading public simulations...' />
            </div>
          ) : filteredSimulations.length === 0 ? (
            <Card>
              <CardContent className='py-12 text-center space-y-4'>
                <p className='text-muted-foreground'>
                  No public simulations found at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className='grid md:grid-cols-2 gap-6'>
              {filteredSimulations.map((sim, idx) => (
                <Link key={sim.id} href={`/simulations/${sim.id}`}>
                  <Card className='group hover:shadow-md transition-shadow cursor-pointer h-full border border-slate-200 hover:border-primary/40'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-primary transition-colors mb-2'>
                        {sim.title || 'Untitled Simulation'}
                      </CardTitle>
                      <CardDescription className='text-xs text-slate-500'>
                        {format(new Date(sim.created_at), 'PPP')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      <p className='text-sm text-slate-600 line-clamp-3 leading-relaxed'>
                        {sim.input_data.goal}
                      </p>
                      <div className='flex items-center justify-between gap-2 flex-wrap'>
                        <span className='inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary'>
                          {sim.input_data.materialType}
                        </span>
                        <span className='text-xs text-slate-500'>
                          {(sim.ai_result.confidenceScore * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                      {sim.tags && sim.tags.length > 0 && (
                        <div className='flex flex-wrap gap-2 pt-2 border-t border-slate-100'>
                          {sim.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className='inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs text-slate-600'
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
