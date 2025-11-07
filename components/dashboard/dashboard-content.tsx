'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { BarChart3, FlaskConical, Globe, Lock, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Statistics {
  total: number;
  public: number;
  private: number;
}

export function DashboardContent() {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [statistics, setStatistics] = useState<Statistics>({ total: 0, public: 0, private: 0 });
  const [profileData, setProfileData] = useState({
    email: '',
    full_name: '',
    name: ''
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchStatistics();
    fetchProfile();
  }, []);

  const fetchStatistics = async () => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('simulations')
        .select('is_public')
        .eq('user_id', user.id);

      if (!error && data) {
        const total = data.length;
        const publicCount = (data as any[]).filter((s: any) => s.is_public === true).length;
        const privateCount = total - publicCount;
        setStatistics({ total, public: publicCount, private: privateCount });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        setProfileData({
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          name: user.user_metadata?.name || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdatingProfile(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.full_name || profileData.name,
          name: profileData.name || profileData.full_name
        }
      });

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully!');
      setShowProfile(false);
      fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile: ' + (error.message || 'Unknown error'));
    } finally {
      setUpdatingProfile(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      <Navigation />

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-7xl mx-auto space-y-6'>
          {/* Statistics and Profile Section */}
          <div className='grid md:grid-cols-2 gap-6'>
            {/* Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5' />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-4 bg-blue-50 rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 bg-blue-500 rounded-lg text-white'>
                        <FlaskConical className='h-5 w-5' />
                      </div>
                      <div>
                        <div className='text-sm text-muted-foreground'>Total Simulations</div>
                        <div className='text-2xl font-bold'>{statistics.total}</div>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='p-4 bg-green-50 rounded-lg'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Globe className='h-4 w-4 text-green-600' />
                        <div className='text-sm text-muted-foreground'>Public</div>
                      </div>
                      <div className='text-xl font-bold text-green-700'>{statistics.public}</div>
                    </div>
                    <div className='p-4 bg-gray-50 rounded-lg'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Lock className='h-4 w-4 text-gray-600' />
                        <div className='text-sm text-muted-foreground'>Private</div>
                      </div>
                      <div className='text-xl font-bold text-gray-700'>{statistics.private}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showProfile ? (
                  <div className='space-y-4'>
                    <div>
                      <div className='text-sm text-muted-foreground mb-1'>Email</div>
                      <div className='font-medium'>{profileData.email || 'Not set'}</div>
                    </div>
                    <div>
                      <div className='text-sm text-muted-foreground mb-1'>Full Name</div>
                      <div className='font-medium'>
                        {profileData.full_name || profileData.name || 'Not set'}
                      </div>
                    </div>
                    <Button
                      variant='outline'
                      onClick={() => setShowProfile(true)}
                      className='w-full'
                    >
                      <Settings className='mr-2 h-4 w-4' />
                      Edit Profile
                    </Button>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='profile-email'>Email</Label>
                      <Input
                        id='profile-email'
                        value={profileData.email}
                        disabled
                        className='bg-gray-50'
                      />
                      <p className='text-xs text-muted-foreground'>Email cannot be changed</p>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='profile-full_name'>Full Name</Label>
                      <Input
                        id='profile-full_name'
                        value={profileData.full_name}
                        onChange={e =>
                          setProfileData({ ...profileData, full_name: e.target.value })
                        }
                        placeholder='Enter your full name'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='profile-name'>Display Name</Label>
                      <Input
                        id='profile-name'
                        value={profileData.name}
                        onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder='Enter your display name'
                      />
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        onClick={handleUpdateProfile}
                        disabled={updatingProfile}
                        className='flex-1'
                      >
                        {updatingProfile ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant='outline'
                        onClick={() => {
                          setShowProfile(false);
                          fetchProfile();
                        }}
                        disabled={updatingProfile}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Action */}
          <Card className='w-full mx-auto'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FlaskConical className='h-6 w-6' />
                Create New Simulation
              </CardTitle>
              <CardDescription>
                Start a new AI-powered simulation to analyze your research parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href='/simulate'>
                <Button className='w-full' size='lg'>
                  <FlaskConical className='mr-2 h-5 w-5' />
                  Run New Simulation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
