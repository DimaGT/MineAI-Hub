'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MaxWidthWrapper from '@/components/ui/max-width-wrapper';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import React from 'react';

const demoFeatures = [
  'user flow into a simulation',
  'structure of the platform',
  'upcoming modules',
  'design direction'
];

const fullProductFeatures = [
  'geochemical parameter controls',
  'visualizations',
  'kinetic modeling',
  'metallurgical dashboards'
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

const featureItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3
    }
  })
};

export const DemoInfoBoxes: React.FC = () => {
  return (
    <div
      className={cn(
        'w-full  ',
      )}
    >
      <MaxWidthWrapper>
      <motion.div
        className='w-full'
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
          {/* What this demo shows */}
          <motion.div variants={itemVariants}>
            <Card className='h-full border-2 border-primary/20 hover:border-primary/40 transition-colors duration-300 bg-gradient-to-br from-background to-muted/20'>
              <CardHeader>
                <CardTitle className='text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
                  What this demo shows:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3'>
                  {demoFeatures.map((feature, index) => (
                    <motion.li
                      key={feature}
                      custom={index}
                      variants={featureItemVariants}
                      className='flex items-start gap-3'
                    >
                      <CheckCircle2 className='h-5 w-5 text-primary mt-0.5 flex-shrink-0' />
                      <span className='text-muted-foreground leading-relaxed'>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* What the full product will include */}
          <motion.div variants={itemVariants}>
            <Card className='h-full border-2 border-primary/20 hover:border-primary/40 transition-colors duration-300 bg-gradient-to-br from-background to-muted/20'>
              <CardHeader>
                <CardTitle className='text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
                  What the full product will include:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3'>
                  {fullProductFeatures.map((feature, index) => (
                    <motion.li
                      key={feature}
                      custom={index}
                      variants={featureItemVariants}
                      className='flex items-start gap-3'
                    >
                      <CheckCircle2 className='h-5 w-5 text-primary mt-0.5 flex-shrink-0' />
                      <span className='text-muted-foreground leading-relaxed'>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
      </MaxWidthWrapper>
    </div>
  );
};
