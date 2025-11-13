'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Construction,
  FlaskConical,
  Hammer,
  Mountain,
  Pickaxe,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// Mock data for visualizations
const extractionData = [
  { time: '0h', extraction: 0 },
  { time: '2h', extraction: 15 },
  { time: '4h', extraction: 32 },
  { time: '6h', extraction: 48 },
  { time: '8h', extraction: 62 },
  { time: '10h', extraction: 75 },
  { time: '12h', extraction: 85 },
  { time: '14h', extraction: 92 },
  { time: '16h', extraction: 96 },
  { time: '18h', extraction: 98 },
  { time: '20h', extraction: 99 }
];

const temperatureData = [
  { time: '0h', temperature: 25, rate: 0.1 },
  { time: '2h', temperature: 35, rate: 0.3 },
  { time: '4h', temperature: 45, rate: 0.6 },
  { time: '6h', temperature: 55, rate: 0.9 },
  { time: '8h', temperature: 65, rate: 1.2 },
  { time: '10h', temperature: 70, rate: 1.4 },
  { time: '12h', temperature: 72, rate: 1.5 },
  { time: '14h', temperature: 73, rate: 1.5 },
  { time: '16h', temperature: 73, rate: 1.5 }
];

const phData = [
  { ph: 1.0, fe3: 0.1 },
  { ph: 1.5, fe3: 0.3 },
  { ph: 2.0, fe3: 0.6 },
  { ph: 2.5, fe3: 0.9 },
  { ph: 3.0, fe3: 1.2 },
  { ph: 3.5, fe3: 1.4 },
  { ph: 4.0, fe3: 1.5 },
  { ph: 4.5, fe3: 1.4 },
  { ph: 5.0, fe3: 1.2 }
];

// Mock data for new visualizations
const efficiencyTemperatureData = [
  { temperature: 25, efficiency: 45 },
  { temperature: 35, efficiency: 58 },
  { temperature: 45, efficiency: 72 },
  { temperature: 55, efficiency: 85 },
  { temperature: 65, efficiency: 92 },
  { temperature: 70, efficiency: 96 },
  { temperature: 75, efficiency: 98 },
  { temperature: 80, efficiency: 99 }
];

const materialPropertiesData = [
  { temperature: 25, hardness: 45, strength: 520, conductivity: 45 },
  { temperature: 35, hardness: 48, strength: 540, conductivity: 48 },
  { temperature: 45, hardness: 52, strength: 560, conductivity: 52 },
  { temperature: 55, hardness: 55, strength: 580, conductivity: 55 },
  { temperature: 65, hardness: 58, strength: 600, conductivity: 58 },
  { temperature: 70, hardness: 60, strength: 610, conductivity: 60 },
  { temperature: 75, hardness: 61, strength: 615, conductivity: 61 },
  { temperature: 80, hardness: 62, strength: 620, conductivity: 62 }
];

// Animation variants with proper types
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  // Only use scroll tracking when not loading
  const { scrollYProgress } = useScroll({
    target: isLoading ? undefined : ref,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress || 0, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress || 0, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100'>
        {/* Animated background elements */}
        <div className='absolute inset-0 overflow-hidden'>
          {[
            { symbol: 'Fe³⁺', color: 'text-orange-500', x: '10%', y: '20%', delay: 0 },
            { symbol: 'C', color: 'text-slate-600', x: '85%', y: '15%', delay: 0.3 },
            { symbol: 'Mn', color: 'text-purple-500', x: '15%', y: '80%', delay: 0.6 },
            { symbol: 'Si', color: 'text-blue-500', x: '90%', y: '75%', delay: 0.9 }
          ].map((element, i) => (
            <motion.div
              key={i}
              className={`absolute ${element.color} text-4xl font-bold opacity-20`}
              style={{ left: element.x, top: element.y }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: element.delay
              }}
            >
              {element.symbol}
            </motion.div>
          ))}
        </div>

        {/* Main loader content */}
        <div className='relative z-10 flex flex-col items-center gap-8'>
          {/* Animated Pickaxe */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: {
                duration: 2,
                repeat: Infinity,
                ease: 'linear'
              },
              scale: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
          >
            <Pickaxe className='h-20 w-20 md:h-24 md:w-24 text-primary drop-shadow-lg' />
          </motion.div>

          {/* GeoSim Logo/Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-center'
          >
            <h2 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-yellow-500 to-primary bg-clip-text text-transparent mb-2'>
              GeoSim
            </h2>
            <p className='text-slate-600 text-sm md:text-base'>
              Loading mineral extraction simulation...
            </p>
          </motion.div>

          {/* Animated loading dots */}
          <div className='flex gap-2'>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className='w-3 h-3 rounded-full bg-primary'
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <motion.div
            className='w-64 h-1 bg-slate-200 rounded-full overflow-hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className='h-full bg-gradient-to-r from-primary via-yellow-500 to-primary'
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut'
              }}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {/* Large pulsing orbs */}
        <motion.div
          className='absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl'
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className='absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl'
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, -50, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
        <motion.div
          className='absolute top-1/2 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl'
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.35, 0.2],
            x: [0, -60, 0],
            y: [0, 40, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
        />
        <motion.div
          className='absolute bottom-1/3 left-0 w-72 h-72 bg-yellow-500/15 rounded-full blur-3xl'
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.25, 0.4, 0.25],
            x: [0, 70, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
        />
        {/* Additional floating orbs */}
        <motion.div
          className='absolute top-1/3 left-1/2 w-64 h-64 bg-emerald-500/12 rounded-full blur-3xl'
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
            x: [0, 80, 0],
            y: [0, -40, 0]
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.5
          }}
        />
        <motion.div
          className='absolute top-2/3 left-1/4 w-56 h-56 bg-orange-500/15 rounded-full blur-3xl'
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.35, 0.2],
            x: [0, -50, 0],
            y: [0, 60, 0]
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.8
          }}
        />
        {/* Medium floating elements */}
        <motion.div
          className='absolute top-1/4 right-1/3 w-64 h-64 bg-primary/10 rounded-full blur-2xl'
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        <motion.div
          className='absolute bottom-1/4 left-1/3 w-56 h-56 bg-cyan-500/12 rounded-full blur-2xl'
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.35, 0.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        {/* Rotating geometric shapes */}
        <motion.div
          className='absolute top-1/5 left-1/5 w-48 h-48 bg-primary/8 rounded-lg blur-2xl'
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.25, 0.1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        <motion.div
          className='absolute bottom-1/5 right-1/5 w-40 h-40 bg-blue-500/10 rounded-lg blur-2xl'
          animate={{
            rotate: [360, 270, 180, 90, 0],
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'linear',
            delay: 1
          }}
        />
        {/* Small accent dots */}
        <motion.div
          className='absolute top-20 right-20 w-32 h-32 bg-primary/25 rounded-full blur-xl'
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className='absolute bottom-32 left-32 w-40 h-40 bg-blue-500/20 rounded-full blur-xl'
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.25, 0.45, 0.25]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
        <motion.div
          className='absolute top-40 left-40 w-24 h-24 bg-purple-500/20 rounded-full blur-lg'
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
        />
        <motion.div
          className='absolute bottom-40 right-40 w-28 h-28 bg-yellow-500/20 rounded-full blur-lg'
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.25, 0.45, 0.25],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.2
          }}
        />
        {/* Animated gradient lines */}
        <motion.div
          className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent'
          animate={{
            x: ['-100%', '200%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        <motion.div
          className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent'
          animate={{
            x: ['200%', '-100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
            delay: 2
          }}
        />
        {/* Grid pattern overlay */}
        <motion.div
          className='absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
          animate={{
            opacity: [0.02, 0.04, 0.02]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        {/* Floating particles effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-2 h-2 bg-primary/30 rounded-full'
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3
            }}
          />
        ))}
      </div>

      <Navigation variant='home' />

      {/* Hero Section */}
      <motion.section
        ref={ref}
        style={{ opacity, scale }}
        className='container mx-auto px-4 py-24 md:py-32 text-center relative z-10 overflow-hidden'
      >
        {/* Hero background gradient */}
        <div className='absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-3xl' />

        {/* Floating chemical elements */}
        <div className='absolute inset-0 -z-10 pointer-events-none'>
          {[
            {
              symbol: 'Fe³⁺',
              color: 'text-orange-500',
              size: 'text-2xl',
              x: '10%',
              y: '20%',
              delay: 0,
              anim: {
                y: [-8, -25, -12, -18, -8],
                x: [-5, 12, -7, 8, -5],
                rotate: [-8, 20, -10, 15, -8],
                scale: [1, 1.25, 1, 1.15, 1],
                opacity: [0.3, 0.6, 0.35, 0.55, 0.3]
              },
              duration: 9
            },
            {
              symbol: 'Fe',
              color: 'text-orange-400',
              size: 'text-xl',
              x: '85%',
              y: '15%',
              delay: 0.5,
              anim: {
                y: [-12, -30, -8, -22, -12],
                x: [6, -15, 8, -12, 6],
                rotate: [10, -20, 12, -18, 10],
                scale: [1, 1.3, 1, 1.2, 1],
                opacity: [0.35, 0.65, 0.3, 0.6, 0.35]
              },
              duration: 10
            },
            {
              symbol: 'C',
              color: 'text-slate-600',
              size: 'text-3xl',
              x: '15%',
              y: '60%',
              delay: 1,
              anim: {
                y: [-10, -35, -15, -28, -10],
                x: [-7, 18, -10, 15, -7],
                rotate: [-12, 25, -15, 20, -12],
                scale: [1, 1.2, 1, 1.18, 1],
                opacity: [0.3, 0.7, 0.4, 0.6, 0.3]
              },
              duration: 11
            },
            {
              symbol: 'Mn',
              color: 'text-purple-500',
              size: 'text-xl',
              x: '80%',
              y: '55%',
              delay: 1.5,
              anim: {
                y: [-15, -28, -10, -25, -15],
                x: [8, -20, 10, -15, 8],
                rotate: [-15, 22, -12, 18, -15],
                scale: [1, 1.28, 1, 1.22, 1],
                opacity: [0.4, 0.65, 0.35, 0.58, 0.4]
              },
              duration: 8.5
            },
            {
              symbol: 'Si',
              color: 'text-blue-500',
              size: 'text-2xl',
              x: '5%',
              y: '80%',
              delay: 2,
              anim: {
                y: [-8, -32, -12, -26, -8],
                x: [-6, 14, -8, 12, -6],
                rotate: [8, -24, 10, -20, 8],
                scale: [1, 1.22, 1, 1.16, 1],
                opacity: [0.3, 0.68, 0.38, 0.62, 0.3]
              },
              duration: 12
            },
            {
              symbol: 'P',
              color: 'text-red-500',
              size: 'text-xl',
              x: '90%',
              y: '75%',
              delay: 0.3,
              anim: {
                y: [-10, -26, -8, -24, -10],
                x: [7, -16, 9, -13, 7],
                rotate: [-10, 18, -8, 16, -10],
                scale: [1, 1.26, 1, 1.19, 1],
                opacity: [0.35, 0.63, 0.32, 0.59, 0.35]
              },
              duration: 9.5
            },
            {
              symbol: 'S',
              color: 'text-yellow-500',
              size: 'text-2xl',
              x: '50%',
              y: '10%',
              delay: 0.8,
              anim: {
                y: [-12, -30, -10, -28, -12],
                x: [-8, 20, -12, 18, -8],
                rotate: [12, -26, 14, -22, 12],
                scale: [1, 1.24, 1, 1.17, 1],
                opacity: [0.3, 0.66, 0.36, 0.61, 0.3]
              },
              duration: 10.5
            },
            {
              symbol: 'Cu',
              color: 'text-amber-600',
              size: 'text-xl',
              x: '25%',
              y: '40%',
              delay: 1.2,
              anim: {
                y: [-9, -27, -11, -23, -9],
                x: [-6, 15, -9, 13, -6],
                rotate: [-9, 21, -11, 19, -9],
                scale: [1, 1.27, 1, 1.21, 1],
                opacity: [0.4, 0.64, 0.33, 0.57, 0.4]
              },
              duration: 8.8
            },
            {
              symbol: 'Zn',
              color: 'text-gray-500',
              size: 'text-lg',
              x: '70%',
              y: '35%',
              delay: 0.7,
              anim: {
                y: [-7, -24, -9, -21, -7],
                x: [5, -14, 7, -11, 5],
                rotate: [7, -19, 9, -17, 7],
                scale: [1, 1.23, 1, 1.14, 1],
                opacity: [0.32, 0.62, 0.34, 0.56, 0.32]
              },
              duration: 9.2
            },
            {
              symbol: 'Al',
              color: 'text-slate-500',
              size: 'text-xl',
              x: '40%',
              y: '70%',
              delay: 1.8,
              anim: {
                y: [-11, -29, -13, -27, -11],
                x: [-7, 17, -10, 15, -7],
                rotate: [-11, 23, -13, 21, -11],
                scale: [1, 1.25, 1, 1.2, 1],
                opacity: [0.3, 0.67, 0.37, 0.6, 0.3]
              },
              duration: 11.5
            },
            {
              symbol: 'O₂',
              color: 'text-blue-400',
              size: 'text-lg',
              x: '60%',
              y: '25%',
              delay: 0.4,
              anim: {
                y: [-8, -22, -10, -20, -8],
                x: [6, -13, 8, -11, 6],
                rotate: [8, -17, 10, -15, 8],
                scale: [1, 1.21, 1, 1.13, 1],
                opacity: [0.35, 0.61, 0.31, 0.55, 0.35]
              },
              duration: 8.3
            },
            {
              symbol: 'H₂O',
              color: 'text-cyan-500',
              size: 'text-sm',
              x: '30%',
              y: '90%',
              delay: 1.1,
              anim: {
                y: [-6, -20, -8, -18, -6],
                x: [-5, 12, -7, 10, -5],
                rotate: [-6, 16, -8, 14, -6],
                scale: [1, 1.2, 1, 1.12, 1],
                opacity: [0.33, 0.59, 0.29, 0.53, 0.33]
              },
              duration: 9.8
            },
            {
              symbol: 'SO₄²⁻',
              color: 'text-yellow-400',
              size: 'text-xs',
              x: '75%',
              y: '85%',
              delay: 0.6,
              anim: {
                y: [-5, -18, -7, -16, -5],
                x: [4, -11, 6, -9, 4],
                rotate: [5, -15, 7, -13, 5],
                scale: [1, 1.19, 1, 1.11, 1],
                opacity: [0.3, 0.58, 0.28, 0.52, 0.3]
              },
              duration: 8.7
            },
            {
              symbol: 'CO₂',
              color: 'text-green-500',
              size: 'text-sm',
              x: '55%',
              y: '50%',
              delay: 1.4,
              anim: {
                y: [-9, -25, -11, -23, -9],
                x: [-6, 16, -9, 14, -6],
                rotate: [-9, 20, -11, 18, -9],
                scale: [1, 1.26, 1, 1.18, 1],
                opacity: [0.34, 0.63, 0.32, 0.57, 0.34]
              },
              duration: 10.2
            },
            {
              symbol: 'Ca',
              color: 'text-lime-500',
              size: 'text-lg',
              x: '20%',
              y: '30%',
              delay: 0.9,
              anim: {
                y: [-7, -23, -9, -21, -7],
                x: [5, -15, 7, -13, 5],
                rotate: [7, -21, 9, -19, 7],
                scale: [1, 1.24, 1, 1.15, 1],
                opacity: [0.32, 0.61, 0.3, 0.54, 0.32]
              },
              duration: 9.3
            }
          ].map((element, i) => (
            <motion.div
              key={`${element.symbol}-${i}`}
              className={`absolute ${element.color} ${element.size} font-bold opacity-40 select-none`}
              style={{
                left: element.x,
                top: element.y,
                opacity: '.4'
              }}
              animate={element.anim}
              transition={{
                duration: element.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: element.delay
              }}
            >
              {element.symbol}
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='max-w-5xl mx-auto space-y-10'
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='flex justify-center mb-8'
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut'
              }}
            >
              <div className='relative'>
                <Pickaxe className='h-20 w-20 md:h-24 md:w-24 text-primary drop-shadow-lg' />
                <motion.div
                  className='absolute inset-0 bg-primary/20 rounded-full blur-xl'
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className='text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-slate-900 max-w-4xl mx-auto'
          >
            <span className='bg-gradient-to-r from-primary via-yellow-500 to-primary bg-clip-text text-transparent'>
              A demo of GeoSim.
            </span>
            <br />
            <span className='text-slate-700'>
              An AI-driven engine for mineral extraction simulation.
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='flex flex-wrap gap-4 justify-center pt-6'
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href='/dashboard'>
                <Button
                  size='lg'
                  className='text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-black font-semibold shadow-lg shadow-primary/50 transition-all'
                >
                  Launch Demo Simulation
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href='/auth/signup'>
                <Button
                  size='lg'
                  variant='outline'
                  className='text-lg px-8 py-6 border-2 border-primary/50 text-primary hover:bg-primary/10 bg-white/80 backdrop-blur-sm font-semibold shadow-md'
                >
                  Preview Workflow
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href='/simulate'>
                <Button
                  size='lg'
                  variant='outline'
                  className='text-lg px-8 py-6 border-2 border-primary/50 text-primary hover:bg-primary/10 bg-white/80 backdrop-blur-sm font-semibold shadow-md'
                >
                  Explore Prototype
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* GeoSim Unique Differentiators */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className='max-w-6xl mx-auto px-4 mt-20 relative z-10'
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className='relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-0 shadow-2xl'>
            {/* Decorative elements */}
            <div className='absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />
            <div className='absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2' />
            <CardHeader>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className='flex items-center justify-center gap-3 mb-4'
              >
                <Sparkles className='h-8 w-8 text-primary' />
                <CardTitle className='text-3xl font-bold text-white text-center relative z-10'>
                  What Makes GeoSim Unique
                </CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className='grid md:grid-cols-2 gap-10'>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className='text-xl font-semibold text-primary mb-6 flex items-center gap-2'>
                    <Zap className='h-5 w-5' />
                    Mineral Processes We Model:
                  </h3>
                  <div className='flex flex-wrap gap-3'>
                    {[
                      'Chalcopyrite',
                      'HVP',
                      'Oxidation Kinetics',
                      'Redox Conditions',
                      'Heap Leaching',
                      'Pressure Oxidation',
                      'Bioleaching',
                      'Solvent Extraction'
                    ].map((item, i) => (
                      <motion.span
                        key={item}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.1,
                          duration: 0.3,
                          type: 'spring',
                          stiffness: 200
                        }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className='px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border-2 border-primary/50 text-white font-medium shadow-lg hover:bg-primary/30 hover:border-primary transition-all cursor-default relative z-10'
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className='text-xl font-semibold text-primary mb-6 flex items-center gap-2 relative z-10'>
                    <TrendingUp className='h-5 w-5' />
                    Scientific Parameters Our Engine Models:
                  </h3>
                  <div className='space-y-3 text-slate-200 relative z-10'>
                    {[
                      'Temperature & reaction rates',
                      'pH & Fe³⁺ regeneration dynamics',
                      'Extraction efficiency over time',
                      'Geochemical equilibrium states',
                      'Kinetic reaction pathways',
                      'Concentration profiles & mass transfer',
                      'Redox potential & ionic strength',
                      'Particle size & solid-liquid ratios',
                      'Oxygen transfer & aeration rates'
                    ].map((param, i) => (
                      <motion.div
                        key={param}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className='flex items-center gap-3 group'
                      >
                        <motion.span className='text-primary font-bold text-lg group-hover:scale-125 transition-transform'>
                          •
                        </motion.span>
                        <span className='group-hover:text-primary transition-colors'>{param}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Demo Info Box */}

      {/* Placeholders Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className='grid md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto px-4 relative z-10'
      >
        {[
          {
            title: 'Parameter sliders',
            status: 'Coming soon',
            style: 'accent',
            accentColor: 'blue'
          },
          {
            title: 'HVP reaction modeling',
            status: 'In Development',

            style: 'gradient',
            gradient: 'from-primary/20 via-yellow-500/20 to-primary/20'
          },
          {
            title: 'Geochemistry engine',
            status: 'Powering Final Version',
            style: 'accent',
            accentColor: 'blue'
          }
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Card
              className={`relative overflow-hidden h-full transition-all ${
                item.style === 'gradient'
                  ? `bg-gradient-to-br ${item.gradient} border-2 border-primary/30 shadow-xl hover:shadow-2xl`
                  : item.style === 'accent'
                  ? `bg-white border-l-4 border-blue-500 border-t-2 border-r-2 border-b-2 border-blue-500/30 shadow-xl hover:shadow-2xl`
                  : `bg-white/95 backdrop-blur-xl border-2 border-dashed border-slate-300 shadow-xl hover:border-primary/50`
              }`}
            >
              <CardHeader>
                <div className='flex items-center gap-3 mb-2'>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  >
                    <Construction className='h-6 w-6 text-slate-400' />
                  </motion.div>
                  <CardTitle className='text-lg font-semibold text-slate-700'>
                    {item.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-slate-500 italic'>{item.status}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* Visualization Mockups */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className='mt-24 max-w-6xl mx-auto px-4 relative z-10'
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='text-4xl font-bold text-center text-slate-900 mb-16'
        >
          Preview Visualizations
        </motion.h2>
        <div className='space-y-6'>
          {/* Efficiency vs Temperature */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5' />
                  Extraction Efficiency vs Temperature
                </CardTitle>
                <CardDescription className='text-base leading-relaxed pt-2'>
                  This chart demonstrates the relationship between extraction temperature and
                  process efficiency. As temperature increases, the extraction efficiency improves
                  significantly, reaching optimal levels around 70-80°C. This visualization helps
                  identify the most effective temperature range for maximizing material recovery
                  during the hydrometallurgical process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {efficiencyTemperatureData?.length > 0 ? (
                  <ResponsiveContainer width='100%' height={400}>
                    <LineChart data={efficiencyTemperatureData} margin={{ bottom: 50, left: 20 }}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis
                        dataKey='temperature'
                        label={{ value: 'Temperature (°C)', position: 'bottom', offset: 10 }}
                        tick={{ dy: 10 }}
                      />
                      <YAxis label={{ value: 'Efficiency', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ paddingTop: '35px' }} />
                      <Line
                        type='monotone'
                        dataKey='efficiency'
                        stroke='#8884d8'
                        strokeWidth={2}
                        name='Efficiency'
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className='text-muted-foreground text-center py-8'>
                    No temperature data available
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Material Properties vs Temperature */}
          {materialPropertiesData && materialPropertiesData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='h-5 w-5' />
                    Material Properties vs Temperature
                  </CardTitle>
                  <CardDescription className='text-base leading-relaxed pt-2'>
                    This area chart shows how material properties (hardness, strength, and thermal
                    conductivity) change with temperature variations. The stacked areas allow you to
                    compare the cumulative effects of temperature on different material
                    characteristics, providing insights into optimal processing conditions for
                    achieving desired material properties.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={400}>
                    <AreaChart data={materialPropertiesData} margin={{ bottom: 50 }}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis
                        dataKey='temperature'
                        label={{
                          value: 'Temperature (°C)',
                          position: 'bottom',
                          offset: 10
                        }}
                        tick={{ dy: 10 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend wrapperStyle={{ paddingTop: '35px' }} />
                      {materialPropertiesData[0]?.hardness !== undefined && (
                        <Area
                          type='monotone'
                          dataKey='hardness'
                          stackId='1'
                          stroke='#8884d8'
                          fill='#8884d8'
                          name='Hardness (HRC)'
                        />
                      )}
                      {materialPropertiesData[0]?.strength !== undefined && (
                        <Area
                          type='monotone'
                          dataKey='strength'
                          stackId='1'
                          stroke='#82ca9d'
                          fill='#82ca9d'
                          name='Strength (MPa)'
                        />
                      )}
                      {materialPropertiesData[0]?.conductivity !== undefined && (
                        <Area
                          type='monotone'
                          dataKey='conductivity'
                          stackId='1'
                          stroke='#ffc658'
                          fill='#ffc658'
                          name='Conductivity (W/m·K)'
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Material Properties Comparison */}
          {materialPropertiesData &&
            materialPropertiesData.length > 0 &&
            (materialPropertiesData[0]?.hardness !== undefined ||
              materialPropertiesData[0]?.strength !== undefined ||
              materialPropertiesData[0]?.conductivity !== undefined) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <BarChart3 className='h-5 w-5' />
                      Material Properties Comparison
                    </CardTitle>
                    <CardDescription className='text-base leading-relaxed pt-2'>
                      This line chart provides a detailed comparison of material properties across
                      different temperature ranges. By visualizing hardness (HRC), strength (MPa),
                      and thermal conductivity (W/m·K) on the same scale, you can identify
                      temperature zones where all properties are optimized, enabling informed
                      decision-making for material processing and quality control.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width='100%' height={400}>
                      <LineChart data={materialPropertiesData} margin={{ bottom: 50 }}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis
                          dataKey='temperature'
                          label={{
                            value: 'Temperature (°C)',
                            position: 'bottom',
                            offset: 10
                          }}
                          tick={{ dy: 10 }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend wrapperStyle={{ paddingTop: '35px' }} />
                        {materialPropertiesData[0]?.hardness !== undefined && (
                          <Line
                            type='monotone'
                            dataKey='hardness'
                            stroke='#8884d8'
                            strokeWidth={2}
                            name='Hardness (HRC)'
                            dot={{ r: 4 }}
                          />
                        )}
                        {materialPropertiesData[0]?.strength !== undefined && (
                          <Line
                            type='monotone'
                            dataKey='strength'
                            stroke='#82ca9d'
                            strokeWidth={2}
                            name='Strength (MPa)'
                            dot={{ r: 4 }}
                          />
                        )}
                        {materialPropertiesData[0]?.conductivity !== undefined && (
                          <Line
                            type='monotone'
                            dataKey='conductivity'
                            stroke='#ffc658'
                            strokeWidth={2}
                            name='Conductivity (W/m·K)'
                            dot={{ r: 4 }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            )}
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className='max-w-6xl mx-auto px-4 mt-20 relative z-10'
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className='relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-0 shadow-2xl mb-20'>
            {/* Decorative elements */}
            <div className='absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />
            <div className='absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2' />
            <CardContent className='pt-8 pb-12'>
              <div className='grid md:grid-cols-3 gap-8 relative z-10'>
                {[
                  {
                    icon: Hammer,
                    title: 'Extract & Process',
                    description:
                      'Simulate mineral extraction processes with precision AI-powered analysis',
                    style: 'gradient',
                    gradient: 'from-primary/20 to-yellow-500/20'
                  },
                  {
                    icon: FlaskConical,
                    title: 'Refine & Analyze',
                    description:
                      'Get intelligent recommendations for metal refinement and mineral analysis',
                    style: 'elevated',
                    shadow: '2xl'
                  },
                  {
                    icon: Mountain,
                    title: 'Visualize Deposits',
                    description:
                      'Explore results with interactive geological charts and detailed mining reports',
                    style: 'bordered',
                    borderColor: 'primary'
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -10, scale: 1.03 }}
                    className={`p-8 rounded-xl transition-all relative overflow-hidden ${
                      feature.style === 'gradient'
                        ? `bg-gradient-to-br ${feature.gradient} border-2 border-primary/30 shadow-lg hover:shadow-xl bg-white/10 backdrop-blur-sm`
                        : feature.style === 'elevated'
                        ? `bg-white/10 backdrop-blur-sm shadow-2xl border-2 border-primary/20 hover:shadow-2xl`
                        : `bg-white/10 backdrop-blur-sm border-2 border-primary/30 shadow-lg hover:border-primary/50`
                    }`}
                  >
                    {/* Decorative corner element for gradient style */}
                    {feature.style === 'gradient' && (
                      <div className='absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-bl-full blur-2xl' />
                    )}
                    <motion.div
                      className='mb-6'
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className='h-12 w-12 text-primary mx-auto' />
                    </motion.div>
                    <h3 className='text-xl font-semibold mb-3 text-white text-center'>
                      {feature.title}
                    </h3>
                    <p className='text-slate-200 leading-relaxed text-center'>
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='mt-16 text-center relative z-10'
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className='text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight'
                >
                  Ready to Transform Your Mining Operations?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className='text-xl text-slate-300 mb-8 max-w-2xl mx-auto'
                >
                  Start simulating mineral extraction processes with AI-powered precision and unlock
                  insights that drive better decisions.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='flex justify-center'
                >
                  <Link href='/simulate'>
                    <Button
                      size='lg'
                      className='text-lg px-10 py-7 bg-primary hover:bg-primary/90 text-black font-semibold shadow-lg shadow-primary/50 transition-all'
                    >
                      Get Started Now
                      <ArrowRight className='ml-2 h-5 w-5' />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className='container mx-auto px-4 py-12 text-center text-slate-500 relative z-10 border-t border-slate-300/50'
      >
        <p>
          &copy; {new Date().getFullYear()} GeoSim. Unearthing knowledge, one simulation at a time.
        </p>
      </motion.footer>
    </div>
  );
}
