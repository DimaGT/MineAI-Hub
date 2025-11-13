'use client';

import React from 'react';

import FeaturesCard from '@/components/modules/landing/FeaturesCard';
import MaxWidthWrapper from '@/components/ui/max-width-wrapper';

import { BackgroundBeams } from '@/components/modules/landing/BackgroundBeams';
import { DemoInfoBoxes } from '@/components/modules/landing/DemoInfoBoxes';
import { HeroContainerScroll } from '@/components/modules/landing/HeroContainerScroll';
import { InfiniteMovingCards } from '@/components/modules/landing/InfiniteMovingCard';
import { StickyScroll } from '@/components/modules/landing/StickyScrollReveal';
import { Navigation } from '@/components/navigation';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CheckCircle2, Cpu, Users } from 'lucide-react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className='h-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100'>
      <Navigation variant='home' />

      <section className='w-full relative '>
        <MaxWidthWrapper>
          <HeroContainerScroll />
        </MaxWidthWrapper>
        <BackgroundBeams />
      </section>
      <section className='w-full mt-10 md:mt-20'>
        <InfiniteMovingCards pauseOnHover={false} speed='slow' />
      </section>
      <section>
        <MaxWidthWrapper className='flex items-center flex-col gap-4 md:mt-20'>
          <h2 className='text-4xl text-center font-medium'>Powerful Simulation Capabilities</h2>
          <p className='text-muted-foreground text-center'>
            Discover the advanced features that make GeoSim the leading platform for mineral
            processing simulations.
          </p>
          <FeaturesCard />
        </MaxWidthWrapper>
      </section>
      {/* Who This Is For Section */}
      <section className='w-full py-12 md:py-20 bg-gradient-to-br from-slate-50 via-green-50/30 to-slate-50'>
        <MaxWidthWrapper>
          <motion.div
            className='w-full'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <div className='flex flex-col gap-6 md:gap-8 items-center mb-8'>
              <div className='flex items-center gap-3'>
                <Users className='h-8 w-8 text-primary' />
                <h2 className='text-3xl md:text-4xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
                  Who This Is For
                </h2>
              </div>
              <p className='text-muted-foreground text-center max-w-3xl text-lg'>
                Mining is a multi-stakeholder industry. GeoSim serves:
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[
                'Mining companies',
                'Metallurgists',
                'Geologists',
                'Technical consultants',
                'R&D teams',
                'Investors (for evaluating emerging mining-tech focused startups)'
              ].map((stakeholder, index) => (
                <motion.div
                  key={stakeholder}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card className='h-full border-2 border-primary/20 hover:border-primary/40 transition-colors duration-300 bg-gradient-to-br from-background to-muted/20'>
                    <CardContent className='pt-6'>
                      <div className='flex items-start gap-3'>
                        <CheckCircle2 className='h-5 w-5 text-primary mt-0.5 flex-shrink-0' />
                        <span className='text-muted-foreground leading-relaxed'>{stakeholder}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </MaxWidthWrapper>
      </section>

      <section className='w-full mt-10 md:mt-20'>
        <MaxWidthWrapper>
          <div className='flex flex-col gap-4 items-center'>
            <h2 className='text-4xl text-center font-medium'>Explore new features</h2>
            <div className='text-muted-foreground text-center'>
              <p>
                GeoSim does everything possible to provide you with a convenient tool for managing
                your mineral processing simulations.
              </p>
              <p>Here are just a few tools that may interest you.</p>
            </div>
          </div>
        </MaxWidthWrapper>
        <div className='py-10'>
          <StickyScroll />
        </div>
      </section>

      {/* The GeoSim Core Section */}
      <section className='w-full py-12 md:py-20 bg-gradient-to-br from-slate-50 via-green-50/30 to-slate-50'>
        <MaxWidthWrapper>
          <motion.div
            className='w-full'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <div className='flex flex-col gap-6 md:gap-8 items-center mb-8'>
              <div className='flex items-center gap-3'>
                <Cpu className='h-8 w-8 text-primary' />
                <h2 className='text-3xl md:text-4xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
                  The GeoSim Core
                </h2>
              </div>
              <p className='text-muted-foreground text-center max-w-3xl text-lg'>
                GeoSim&apos;s engine uses AI-augmented geochemical modeling to simulate mineral
                behavior across controlled variables including:
              </p>
            </div>
            <Card className='border-2 border-primary/20 hover:border-primary/40 transition-colors duration-300 bg-gradient-to-br from-background to-muted/20'>
              <CardHeader>
                <CardTitle className='text-xl font-semibold text-center'>
                  Controlled Variables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {[
                    'Temperature',
                    'pH',
                    'Eh (redox)',
                    'Fe³⁺ / Fe²⁺ ratios',
                    'Reagent concentration',
                    'Pulp density',
                    'Energy input (HVP)',
                    'Pressure + oxidative conditions'
                  ].map((variable, index) => (
                    <motion.div
                      key={variable}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className='flex items-start gap-3'
                    >
                      <CheckCircle2 className='h-5 w-5 text-primary mt-0.5 flex-shrink-0' />
                      <span className='text-muted-foreground leading-relaxed'>{variable}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </MaxWidthWrapper>
      </section>

      <section className='w-full py-12'>
        <DemoInfoBoxes />
      </section>

      <div className='h-[40rem] w-full rounded-md relative flex flex-col items-center justify-center antialiased'>
        <div className='max-w-2xl mx-auto p-4'>
          <h1 className='relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-primary via-primary/90 to-primary/70  text-center font-sans font-bold'>
            Join GeoSim
          </h1>
          <p></p>
          <p className='text-foreground max-w-lg mx-auto my-2 text-sm text-center relative z-10'>
            Discover the power of seamless mineral processing simulation with GeoSim. Experience the
            difference today and revolutionize the way you manage your research with scientific
            precision.
          </p>
          <div className='flex justify-center mt-8'>
            <Link href='/simulate' className={cn(buttonVariants({ variant: 'default' }), 'w-20')}>
              Start
            </Link>
          </div>
        </div>
        <BackgroundBeams />
      </div>
    </div>
  );
};

export default HomePage;
