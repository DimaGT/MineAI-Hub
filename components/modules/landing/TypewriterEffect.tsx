'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface TypewriterEffectProps {
  className?: string;
  cursorClassName?: string;
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  className,
  cursorClassName
}) => {
  const words = [
    {
      text: 'A',
    },
    {
      text: 'demo',
    },
    {
      text: 'of',
    },
    {
      text: 'GeoSim.',
      className: 'text-primary'
    },
    {
      text: 'An'
    },
    {
      text: 'AI-driven'
    },
    {
      text: 'engine'
    },
    {
      text: 'for'
    },
    {
      text: 'mineral'
    },
    {
      text: 'extraction'
    },
    {
      text: 'simulation.',
      className: 'text-primary'
    }
  ];
  // split text inside of words into array of characters
  const wordsArray = words.map(word => {
    return {
      ...word,
      text: word.text.split('')
    };
  });
  const renderWords = () => {
    return (
      <span>
        {wordsArray.map((word, idx) => {
          return (
            <span key={`word-${idx}`} className='inline-block'>
              {word.text.map((char, index) => (
                <span key={`char-${index}`} className={cn(`z-[99999]`, word.className)}>
                  {char}
                </span>
              ))}
              &nbsp;
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div className={cn('flex justify-center w-full space-x-1', className)}>
      <motion.div
        className='overflow-hidden pb-2'
        initial={{
          width: '0%'
        }}
        whileInView={{
          width: 'fit-content'
        }}
        transition={{
          duration: 2,
          ease: 'linear',
          delay: 1
        }}
      >
        <div
          className='text-base text-center font-medium'
          style={{
            whiteSpace: 'nowrap'
          }}
        >
          {renderWords()}{' '}
        </div>{' '}
      </motion.div>
      <motion.span
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          duration: 0.8,

          repeat: Infinity,
          repeatType: 'reverse'
        }}
        className={cn('block rounded-sm w-[2.5px]  h-6 bg-primary', cursorClassName)}
      ></motion.span>
    </div>
  );
};
