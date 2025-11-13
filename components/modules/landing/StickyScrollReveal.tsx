'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Clock } from 'lucide-react';
import Image from 'next/image';
import React, { useRef } from 'react';

const content = [
  {
    title: 'Simulation Platform',
    description: (
      <>
        <p>
          Our advanced simulation platform enables you to model and analyze material processing
          scenarios with AI-powered insights. Enter your research parameters, material composition,
          and experimental conditions to generate comprehensive simulation reports that help
          optimize your research and development processes.
        </p>
        <p>
          Whether you're working with metals, polymers, ceramics, or composites, our platform
          provides detailed analysis and recommendations to guide your material science research.
        </p>
        <p>
          The platform combines cutting-edge AI technology with scientific rigor to deliver
          actionable insights that accelerate your research workflow and improve decision-making.
        </p>
      </>
    ),
    content: (
      <div className='h-full w-full rounded-md flex items-center justify-center text-white'>
        <Image
          src='/assets/feature-1.png'
          fill
          className='h-full w-full object-fit rounded-md border'
          alt='Simulation Platform'
        />
      </div>
    )
  },
  {
    title: 'Simulation Results',
    description: (
      <>
        <p>
          View comprehensive simulation results with detailed AI-generated reports. Each result
          includes input parameters (goal, material type, composition, and experimental conditions),
          process summary, recommended methods, and confidence scores.
        </p>
        <p>
          Explore interactive visualizations including extraction efficiency vs temperature charts,
          material properties analysis (hardness, strength, conductivity), and confidence score
          indicators. All data is presented in clear, easy-to-understand graphs and charts.
        </p>
        <p>
          Export your results as PDF reports, share findings with the research community, or keep
          them private. Track your research progress with detailed analytics and visual
          representations of your simulation outcomes.
        </p>
      </>
    ),
    content: (
      <div className='h-full w-full  flex items-center justify-center text-white'>
        <Image
          src='/assets/feature-2.png'
          fill
          className='h-full w-full object-fit rounded-md border'
          alt='My Simulations'
        />
      </div>
    )
  },
  {
    title: 'Knowledge Hub',
    description: (
      <>
        <p>
          Browse a curated collection of public simulations shared by researchers worldwide. Learn
          from real-world case studies, explore different material types and processing methods, and
          gain insights from the research community.
        </p>
        <p>
          Each simulation includes detailed parameters, results, and analysis, providing you with
          valuable reference material for your own research projects.
        </p>
        <p>
          Discover innovative approaches, compare methodologies, and stay informed about the latest
          developments in material science research through our collaborative knowledge base.
        </p>
      </>
    ),
    content: (
      <div className='h-full w-full rounded-md flex items-center justify-center text-white'>
        <Image
          src='/assets/preview.png'
          fill
          className='h-full w-full object-fit rounded-md border'
          alt='Knowledge Hub'
        />
      </div>
    )
  },
  {
    title: 'HVP Reaction Modeling',
    description: (
      <>
        <div className='flex items-center gap-2 mb-4'>
          <Badge
            variant='outline'
            className='bg-primary/10 text-primary border-primary/30 px-3 py-1 text-xs font-semibold'
          >
            <Clock className='mr-2 h-3 w-3' />
            In Development
          </Badge>
          <Badge
            variant='secondary'
            className='bg-primary/20 text-primary border-primary/40 px-4 py-1 text-xs font-medium'
          >
            Coming Soon
          </Badge>
        </div>
        <p>
          Advanced high-velocity particle reaction modeling capabilities are currently under
          development. This feature will enable sophisticated analysis of particle interactions and
          reaction dynamics in material processing.
        </p>
        <p>
          The upcoming HVP reaction modeling module will provide researchers with powerful tools to
          simulate and analyze complex particle behavior under high-velocity conditions, opening new
          possibilities for material science research.
        </p>
        <p>
          Stay tuned for updates as we continue to develop this cutting-edge feature for the GeoSim
          platform.
        </p>
      </>
    ),
    content: (
      <div className='h-full w-full rounded-md flex items-center justify-center text-white relative overflow-hidden'>
        <Image
          src='/assets/preview.png'
          fill
          className='h-full w-full object-cover rounded-md border blur-md'
          alt='HVP Reaction Modeling'
          unoptimized
        />
        <div className='absolute inset-0 bg-primary/20 flex items-center justify-center'>
          <Badge
            variant='secondary'
            className='bg-primary/30 text-primary border-primary/50 px-6 py-2 text-base font-semibold backdrop-blur-sm'
          >
            Coming Soon
          </Badge>
        </div>
      </div>
    )
  }
];

export const StickyScroll = ({
  contentClassName
}: {
  contentClassName?: string | React.ReactNode;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce((acc, breakpoint, index) => {
      const distance = Math.abs(latest - breakpoint);
      if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
        return index;
      }
      return acc;
    }, 0);
    setActiveCard(closestBreakpointIndex);
  });

  return (
    <motion.div className='flex justify-center relative space-x-10 rounded-md p-10 pb-0' ref={ref}>
      <div className='relative flex items-start px-4'>
        <div className='max-w-5xl'>
          {content.map((item, index) => (
            <div key={item.title + index} className='mb-20'>
              <motion.h2
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3
                }}
                className='text-2xl font-bold'
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3
                }}
                className='max-w-md mt-4 space-y-2'
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className='h-40' />
        </div>
      </div>
      <motion.div
        className={cn(
          'hidden lg:block max-w-2xl h-[358px] rounded-md w-full sticky top-10',
          contentClassName
        )}
      >
        {content[activeCard].content ?? null}
      </motion.div>
    </motion.div>
  );
};
