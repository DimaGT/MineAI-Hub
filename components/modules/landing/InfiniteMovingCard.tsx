'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

// Research goals data based on system capabilities
const RESEARCH_GOALS_CARD = [
  {
    goal: 'Analyze the thermal treatment process for improving the mechanical properties of carbon steel through quenching and tempering. Optimize temperature profiles to achieve optimal hardness and toughness balance for structural applications.',
    category: 'Metals',
    application: 'Structural Engineering'
  },
  {
    goal: 'Investigate the corrosion resistance of stainless steel in marine environments. Evaluate the effect of chromium and nickel content on pitting corrosion resistance and passive film formation.',
    category: 'Metals',
    application: 'Marine Applications'
  },
  {
    goal: 'Optimize the mechanical properties of high-density polyethylene (HDPE) by analyzing the effects of molecular weight distribution and processing conditions on tensile strength and impact resistance.',
    category: 'Polymers',
    application: 'Automotive Industry'
  },
  {
    goal: 'Optimize the sintering process for alumina ceramics to achieve maximum density and mechanical strength. Analyze the effect of sintering temperature, time, and heating rate on microstructure and properties.',
    category: 'Ceramics',
    application: 'High-Temperature Applications'
  },
  {
    goal: 'Optimize the processing parameters for carbon fiber reinforced polymer (CFRP) composites to maximize interlaminar shear strength and reduce void content.',
    category: 'Composites',
    application: 'Aerospace Engineering'
  },
  {
    goal: 'Study the grain size refinement and mechanical properties of nanocrystalline titanium produced through severe plastic deformation. Analyze the relationship between grain size and yield strength.',
    category: 'Nanomaterials',
    application: 'Biomedical Devices'
  },
  {
    goal: 'Investigate the extraction efficiency of rare earth elements from monazite ore using acid leaching. Optimize pH, temperature, and reagent concentration to maximize recovery rates while minimizing environmental impact.',
    category: 'Minerals',
    application: 'Rare Earth Processing'
  },
  {
    goal: 'Model the phase transformation kinetics in titanium alloys during heat treatment. Predict microstructure evolution and optimize processing parameters for aerospace-grade components.',
    category: 'Metals',
    application: 'Aerospace Manufacturing'
  }
];

interface InfiniteMovingCardsProps {
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
  showTitle?: boolean;
}

export const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
  showTitle = true
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [start, setStart] = React.useState(false);

  React.useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach(item => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty('--animation-direction', 'forwards');
      } else {
        containerRef.current.style.setProperty('--animation-direction', 'reverse');
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '20s');
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '40s');
      } else {
        containerRef.current.style.setProperty('--animation-duration', '80s');
      }
    }
  };

  return (
    <div className={cn('w-full py-12 md:py-20 bg-gradient-to-br from-slate-50 via-green-50/30 to-slate-50', className)}>
      {showTitle && (
        <div className='mb-8 text-center px-4'>
          <h2 className='text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent'>
            Explore Research Possibilities
          </h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Discover the breadth of scientific inquiries our platform can handle. From metals and
            polymers to ceramics and nanomaterials—unlock insights across diverse material science
            domains.
          </p>
        </div>
      )}
      <div
        ref={containerRef}
        className={cn(
          'scroller relative z-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]'
        )}
      >
        <div
          ref={scrollerRef}
          className={cn(
            ' flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap',
            start && 'animate-scroll ',
            pauseOnHover && 'hover:[animation-play-state:paused]'
          )}
        >
          {RESEARCH_GOALS_CARD.map((item, idx) => (
            <Card
              className='w-[350px] max-w-full pt-6 relative rounded-2xl border border-b-0 flex-shrink-0 md:w-[450px]'
              key={`${item.category}-${idx}`}
            >
              <CardContent>
                <div
                  aria-hidden='true'
                  className='user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]'
                ></div>
                <div className='relative z-20 space-y-4'>
                  <div className='inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-2'>
                    {item.category}
                  </div>
                  <p className='text-sm font-medium leading-[1.6] text-foreground'>{item.goal}</p>
                  <div className='relative z-20 mt-4 pt-4 border-t'>
                    <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                      Application
                    </span>
                    <p className='text-sm leading-[1.6] font-normal text-muted-foreground mt-1'>
                      {item.application}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
