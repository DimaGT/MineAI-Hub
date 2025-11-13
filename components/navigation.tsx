'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, LogOut, Menu, Mountain, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavigationProps {
  variant?: 'default' | 'home' | 'back-to-dashboard' | 'back-to-knowledge';
  backUrl?: string;
  backLabel?: string;
  className?: string;
}

export function Navigation({
  variant = 'default',
  backUrl,
  backLabel,
  className = ''
}: NavigationProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const navClassName =
    variant === 'home'
      ? 'border-b bg-white/95 backdrop-blur-sm'
      : variant === 'back-to-knowledge'
      ? 'border-b bg-white'
      : 'border-b bg-white';

  if (variant === 'home' && !loading && !isAuthenticated) {
    // Home page navigation for unauthenticated users
    return (
      <nav className={`${navClassName} ${className}`}>
        <div className='container mx-auto px-4 py-6 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <Mountain className='h-8 w-8 text-primary' />
            <div className='text-2xl font-bold text-slate-900'>GeoSim</div>
          </div>
          <div className='flex gap-4'>
            <Link href='/auth/signin'>
              <Button variant='ghost' className='text-slate-700 hover:text-primary'>
                Sign In
              </Button>
            </Link>
            <Link href='/auth/signup'>
              <Button className='bg-primary hover:opacity-90 text-black'>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  if (variant === 'home' && !loading && isAuthenticated) {
    // Home page navigation for authenticated users
    return (
      <>
        <nav className={`${navClassName} ${className}`}>
          <div className='container mx-auto px-4 py-6 flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <Mountain className='h-8 w-8 text-primary' />
              <div className='text-2xl font-bold text-slate-900'>GeoSim</div>
            </div>
            <div className='hidden md:flex items-center gap-4'>
              <div className='flex gap-2'>
                <Link href='/dashboard'>
                  <Button variant='ghost' className='text-slate-700 hover:text-primary'>
                    Dashboard
                  </Button>
                </Link>
                <Link href='/simulate'>
                  <Button variant='ghost' className='text-slate-700 hover:text-primary'>
                    Run Simulation
                  </Button>
                </Link>
                <Link href='/my-simulations'>
                  <Button variant='ghost' className='text-slate-700 hover:text-primary'>
                    My Simulations
                  </Button>
                </Link>
                <Link href='/knowledge'>
                  <Button variant='ghost' className='text-slate-700 hover:text-primary'>
                    Knowledge Hub
                  </Button>
                </Link>
              </div>
              <Button
                variant='ghost'
                onClick={handleSignOut}
                className='text-slate-700 hover:text-primary'
              >
                <LogOut className='mr-2 h-4 w-4' />
                Sign Out
              </Button>
            </div>
            <Button
              variant='ghost'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='md:hidden'
              aria-label='Toggle menu'
            >
              {mobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </Button>
          </div>
        </nav>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className='fixed inset-0 bg-black/50 z-40 md:hidden'
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Mobile Menu */}
            <nav className='fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 md:hidden overflow-y-auto'>
              <div className='p-4'>
                <div className='flex justify-between items-center mb-6'>
                  <div className='text-xl font-bold text-primary'>Menu</div>
                  <Button
                    variant='ghost'
                    onClick={() => setMobileMenuOpen(false)}
                    className='h-8 w-8 p-0'
                  >
                    <X className='h-5 w-5' />
                  </Button>
                </div>
                <div className='flex flex-col gap-2'>
                  <Link href='/dashboard' onClick={handleLinkClick}>
                    <Button variant='ghost' className='w-full justify-start'>
                      Dashboard
                    </Button>
                  </Link>
                  <Link href='/simulate' onClick={handleLinkClick}>
                    <Button variant='ghost' className='w-full justify-start'>
                      Run Simulation
                    </Button>
                  </Link>
                  <Link href='/my-simulations' onClick={handleLinkClick}>
                    <Button variant='ghost' className='w-full justify-start'>
                      My Simulations
                    </Button>
                  </Link>
                  <Link href='/knowledge' onClick={handleLinkClick}>
                    <Button variant='ghost' className='w-full justify-start'>
                      Knowledge Hub
                    </Button>
                  </Link>
                  <Button
                    variant='ghost'
                    onClick={handleSignOut}
                    className='w-full justify-start mt-2 border-t border-slate-200 pt-2'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    Sign Out
                  </Button>
                </div>
              </div>
            </nav>
          </>
        )}
      </>
    );
  }

  if (variant === 'back-to-dashboard') {
    // Navigation with back button to dashboard
    return (
      <nav className={`${navClassName} ${className}`}>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4 md:gap-8'>
              <Link href='/' className='text-xl md:text-2xl font-bold text-primary'>
                SimuHub AI
              </Link>
              <div className='hidden md:flex gap-4'>
                <Link href='/dashboard'>
                  <Button variant='ghost'>Dashboard</Button>
                </Link>
                <Link href='/simulate'>
                  <Button variant='ghost'>Run Simulation</Button>
                </Link>
                <Link href='/my-simulations'>
                  <Button variant='ghost'>My Simulations</Button>
                </Link>
                <Link href='/knowledge'>
                  <Button variant='ghost'>Knowledge Hub</Button>
                </Link>
                <Link href='/examples'>
                  <Button variant='ghost'>Examples</Button>
                </Link>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Link href={backUrl || '/dashboard'} className='hidden md:block'>
                <Button variant='outline'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  {backLabel || 'Back to Dashboard'}
                </Button>
              </Link>
              <Button
                variant='ghost'
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='md:hidden'
                aria-label='Toggle menu'
              >
                {mobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
              </Button>
            </div>
          </div>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className='fixed inset-0 bg-black/50 z-40 md:hidden'
                onClick={() => setMobileMenuOpen(false)}
              />
              {/* Mobile Menu */}
              <nav className='fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 md:hidden overflow-y-auto'>
                <div className='p-4'>
                  <div className='flex justify-between items-center mb-6'>
                    <div className='text-xl font-bold text-primary'>Menu</div>
                    <Button
                      variant='ghost'
                      onClick={() => setMobileMenuOpen(false)}
                      className='h-8 w-8 p-0'
                    >
                      <X className='h-5 w-5' />
                    </Button>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Link href='/dashboard' onClick={handleLinkClick}>
                      <Button variant='ghost' className='w-full justify-start'>
                        Dashboard
                      </Button>
                    </Link>
                    <Link href='/simulate' onClick={handleLinkClick}>
                      <Button variant='ghost' className='w-full justify-start'>
                        Run Simulation
                      </Button>
                    </Link>
                    <Link href='/my-simulations' onClick={handleLinkClick}>
                      <Button variant='ghost' className='w-full justify-start'>
                        My Simulations
                      </Button>
                    </Link>
                    <Link href='/knowledge' onClick={handleLinkClick}>
                      <Button variant='ghost' className='w-full justify-start'>
                        Knowledge Hub
                      </Button>
                    </Link>
                    <Link href='/examples' onClick={handleLinkClick}>
                      <Button variant='ghost' className='w-full justify-start'>
                        Examples
                      </Button>
                    </Link>
                    <Link
                      href={backUrl || '/dashboard'}
                      onClick={handleLinkClick}
                      className='mt-2 border-t border-slate-200 pt-2'
                    >
                      <Button variant='outline' className='w-full justify-start'>
                        <ArrowLeft className='mr-2 h-4 w-4' />
                        {backLabel || 'Back to Dashboard'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </nav>
            </>
          )}
        </div>
      </nav>
    );
  }

  if (variant === 'back-to-knowledge') {
    // Navigation with back button to knowledge hub
    return (
      <nav className={`${navClassName} ${className}`}>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4 md:gap-8'>
              <Link href='/' className='text-xl md:text-2xl font-bold text-primary'>
                SimuHub AI
              </Link>
              <Link href='/knowledge' className='hidden md:block'>
                <Button variant='ghost'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  {backLabel || 'Back to Knowledge Hub'}
                </Button>
              </Link>
            </div>
            <Button
              variant='ghost'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='md:hidden'
              aria-label='Toggle menu'
            >
              {mobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </Button>
          </div>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className='fixed inset-0 bg-black/50 z-40 md:hidden'
                onClick={() => setMobileMenuOpen(false)}
              />
              {/* Mobile Menu */}
              <nav className='fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 md:hidden overflow-y-auto'>
                <div className='p-4'>
                  <div className='flex justify-between items-center mb-6'>
                    <div className='text-xl font-bold text-primary'>Menu</div>
                    <Button
                      variant='ghost'
                      onClick={() => setMobileMenuOpen(false)}
                      className='h-8 w-8 p-0'
                    >
                      <X className='h-5 w-5' />
                    </Button>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Link href='/knowledge' onClick={handleLinkClick}>
                      <Button variant='ghost' className='w-full justify-start'>
                        <ArrowLeft className='mr-2 h-4 w-4' />
                        {backLabel || 'Back to Knowledge Hub'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </nav>
            </>
          )}
        </div>
      </nav>
    );
  }

  // Default navigation (full navigation for authenticated users)
  if (loading) {
    return (
      <nav className={`${navClassName} ${className}`}>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex justify-between items-center'>
            <Link href='/' className='text-xl md:text-2xl font-bold text-primary'>
              SimuHub AI
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`${navClassName} ${className}`}>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-4 md:gap-8'>
            <Link href='/' className='text-xl md:text-2xl font-bold text-primary'>
              SimuHub AI
            </Link>
            {/* Desktop Navigation */}
            <div className='hidden md:flex gap-4'>
              <Link href='/dashboard'>
                <Button variant='ghost'>Dashboard</Button>
              </Link>
              <Link href='/simulate'>
                <Button variant='ghost'>Run Simulation</Button>
              </Link>
              <Link href='/my-simulations'>
                <Button variant='ghost'>My Simulations</Button>
              </Link>
              <Link href='/knowledge'>
                <Button variant='ghost'>Knowledge Hub</Button>
              </Link>
              <Link href='/examples'>
                <Button variant='ghost'>Examples</Button>
              </Link>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            {/* Desktop Sign Out */}
            <Button variant='ghost' onClick={handleSignOut} className='hidden md:flex'>
              <LogOut className='mr-2 h-4 w-4' />
              Sign Out
            </Button>
            {/* Mobile Burger Menu */}
            <Button
              variant='ghost'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='md:hidden'
              aria-label='Toggle menu'
            >
              {mobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </Button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className='fixed inset-0 bg-black/50 z-40 md:hidden'
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Mobile Menu */}
            <nav className='fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 md:hidden overflow-y-auto'>
              <div className='p-4'>
                <div className='flex justify-between items-center mb-6'>
                  <div className='text-xl font-bold text-primary'>Menu</div>
                  <Button
                    variant='ghost'
                    onClick={() => setMobileMenuOpen(false)}
                    className='h-8 w-8 p-0'
                  >
                    <X className='h-5 w-5' />
                  </Button>
                </div>
                <div className='flex flex-col gap-2'>
                  <Link href='/dashboard' onClick={handleLinkClick}>
                    <Button variant='ghost' className='w-full justify-start'>
                      Dashboard
                    </Button>
                  </Link>
                  <Link href='/simulate' onClick={handleLinkClick}>
                    <Button variant='ghost' className='w-full justify-start'>
                      Run Simulation
                    </Button>
                  </Link>
                  <Link href='/my-simulations' onClick={handleLinkClick}>
                    <Button variant='ghost' className='w-full justify-start'>
                      My Simulations
                    </Button>
                  </Link>
                  <Link href='/knowledge' onClick={handleLinkClick}>
                    <Button variant='ghost' className='w-full justify-start'>
                      Knowledge Hub
                    </Button>
                  </Link>
                  <Link href='/examples' onClick={handleLinkClick}>
                    <Button variant='ghost' className='w-full justify-start'>
                      Examples
                    </Button>
                  </Link>
                  <Button
                    variant='ghost'
                    onClick={handleSignOut}
                    className='w-full justify-start mt-2 border-t border-slate-200 pt-2'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    Sign Out
                  </Button>
                </div>
              </div>
            </nav>
          </>
        )}
      </div>
    </nav>
  );
}
