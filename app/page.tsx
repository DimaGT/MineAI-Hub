'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, FlaskConical, Hammer, Mountain, Pickaxe } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative'>
      <Navigation variant='home' />

      {/* Hero Section */}
      <section className='container mx-auto px-4 py-20 text-center'>
        <div className='max-w-4xl mx-auto space-y-8'>
          <div className='flex justify-center mb-6'>
            <Pickaxe className='h-16 w-16 text-primary animate-swing' />
          </div>

          <h1 className='text-5xl md:text-6xl font-bold leading-tight text-slate-900'>
            Discover Minerals
            <br />
            <span className='text-slate-600'>with AI-Powered</span>
            <br />
            <span className='text-slate-800'>Mining Simulation</span>
          </h1>

          <p className='text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed'>
            Extract valuable insights from minerals and metals using advanced AI-driven simulation
            technology. Dig deep into data, refine your research, and uncover hidden patterns.
          </p>

          <div className='flex gap-4 justify-center pt-4'>
            <Link href='/dashboard'>
              <Button size='lg' className='text-lg px-8 bg-primary hover:opacity-90 text-black'>
                Start Excavation
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
            <Link href='/auth/signup'>
              <Button
                size='lg'
                variant='outline'
                className='text-lg px-8 border-primary/30 text-primary hover:bg-primary/10'
              >
                Explore Mine
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className='grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto'>
          <div className='p-6 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-primary/30 transition-colors'>
            <div className='mb-4'>
              <Hammer className='h-10 w-10 text-primary mx-auto' />
            </div>
            <h3 className='text-xl font-semibold mb-2 text-slate-900'>Extract & Process</h3>
            <p className='text-slate-600 leading-relaxed'>
              Simulate mineral extraction processes with precision AI-powered analysis
            </p>
          </div>

          <div className='p-6 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-primary/30 transition-colors'>
            <div className='mb-4'>
              <FlaskConical className='h-10 w-10 text-primary mx-auto' />
            </div>
            <h3 className='text-xl font-semibold mb-2 text-slate-900'>Refine & Analyze</h3>
            <p className='text-slate-600 leading-relaxed'>
              Get intelligent recommendations for metal refinement and mineral analysis
            </p>
          </div>

          <div className='p-6 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-primary/30 transition-colors'>
            <div className='mb-4'>
              <Mountain className='h-10 w-10 text-primary mx-auto' />
            </div>
            <h3 className='text-xl font-semibold mb-2 text-slate-900'>Visualize Deposits</h3>
            <p className='text-slate-600 leading-relaxed'>
              Explore results with interactive geological charts and detailed mining reports
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='container mx-auto px-4 py-8 text-center text-slate-500'>
        <p>
          &copy; {new Date().getFullYear()} GeoSim. Unearthing knowledge, one simulation at a time.
        </p>
      </footer>
    </div>
  );
}
