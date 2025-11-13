'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Copy } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const examples = [
  {
    simulationTitle: 'Carbon Steel Thermal Treatment',
    category: 'Metals',
    goal: 'Analyze the thermal treatment process for improving the mechanical properties of carbon steel through quenching and tempering. The goal is to optimize temperature profiles to achieve optimal hardness and toughness balance for structural applications.',
    materialType: 'metals',
    composition: 'Fe 98%, C 0.4%, Mn 0.6%, Si 0.3%, P 0.03%, S 0.02%',
    conditions:
      'Quenching temperature: 850°C, Quenching medium: Oil, Tempering temperature: 400-600°C, Holding time: 2 hours, Cooling rate: 50°C/min',
    application: 'structural',
    targetProperties: 'Hardness: 40-50 HRC, Tensile strength: >600 MPa, Toughness: >50 J/cm²',
    processingMethod: 'heat-treatment',
    priority: 'performance',
    constraints: 'Processing time: <4 hours, Maximum temperature: 900°C'
  },
  {
    simulationTitle: 'Stainless Steel Corrosion Resistance',
    category: 'Metals',
    goal: 'Investigate the corrosion resistance of stainless steel in marine environments. Evaluate the effect of chromium and nickel content on pitting corrosion resistance and passive film formation.',
    materialType: 'metals',
    composition: 'Fe 70%, Cr 18%, Ni 8%, Mo 3%, C 0.08%, Mn 1%, Si 0.5%',
    conditions:
      'Temperature: 25°C, Pressure: 1 atm, Environment: 3.5% NaCl solution, pH: 7-8, Exposure time: 1000 hours, Electrochemical potential: +0.3V vs SCE',
    application: 'marine',
    targetProperties: 'Pitting potential: >0.4V, Corrosion rate: <0.01 mm/year',
    processingMethod: '',
    priority: 'durability',
    constraints: ''
  },
  {
    simulationTitle: 'Polyethylene Mechanical Properties',
    category: 'Polymers',
    goal: 'Optimize the mechanical properties of high-density polyethylene (HDPE) by analyzing the effects of molecular weight distribution and processing conditions on tensile strength and impact resistance.',
    materialType: 'polymers',
    composition:
      'HDPE (High-Density Polyethylene): 95%, Additives (UV stabilizers, antioxidants): 3%, Impact modifiers: 2%',
    conditions:
      'Processing temperature: 200-220°C, Injection pressure: 80-100 MPa, Cooling rate: 10°C/min, Mold temperature: 40°C, Holding pressure: 50 MPa, Crystallization temperature: 120°C',
    application: 'automotive',
    targetProperties:
      'Tensile strength: >25 MPa, Impact strength: >15 kJ/m², Elongation at break: >500%',
    processingMethod: 'injection-molding',
    priority: 'performance',
    constraints: 'Cycle time: <60 seconds, Material cost: <$2/kg'
  },
  {
    simulationTitle: 'Alumina Sintering',
    category: 'Ceramics',
    goal: 'Optimize the sintering process for alumina ceramics to achieve maximum density and mechanical strength. Analyze the effect of sintering temperature, time, and heating rate on microstructure and properties.',
    materialType: 'ceramics',
    composition: 'Al2O3: 99.5%, MgO sintering aid: 0.5%, Particle size: D50 = 0.5 μm',
    conditions:
      'Sintering temperature: 1600-1700°C, Sintering time: 2-4 hours, Heating rate: 5°C/min, Cooling rate: 10°C/min, Atmosphere: Air, Green density: 55% theoretical',
    application: 'high-temperature',
    targetProperties:
      'Density: >99% theoretical, Flexural strength: >400 MPa, Operating temperature: up to 1600°C',
    processingMethod: 'sintering',
    priority: 'performance',
    constraints: 'Maximum sintering temperature: 1750°C, Processing time: <6 hours'
  },
  {
    simulationTitle: 'Carbon Fiber Composite',
    category: 'Composites',
    goal: 'Optimize the processing parameters for carbon fiber reinforced polymer (CFRP) composites to maximize interlaminar shear strength and reduce void content.',
    materialType: 'composites',
    composition:
      'Epoxy resin matrix: 40%, Carbon fiber (T300): 60%, Fiber orientation: [0/90]₂s, Fiber volume fraction: 0.6',
    conditions:
      'Curing temperature: 180°C, Curing pressure: 0.6 MPa, Curing time: 2 hours, Post-curing: 200°C for 1 hour, Vacuum level: 0.1 atm, Heating rate: 2°C/min',
    application: 'aerospace',
    targetProperties:
      'Interlaminar shear strength: >60 MPa, Void content: <1%, Flexural modulus: >70 GPa',
    processingMethod: '',
    priority: 'quality',
    constraints: 'Processing temperature: <220°C, Part size: <500mm'
  },
  {
    simulationTitle: 'Nanocrystalline Titanium',
    category: 'Nanomaterials',
    goal: 'Study the grain size refinement and mechanical properties of nanocrystalline titanium produced through severe plastic deformation. Analyze the relationship between grain size and yield strength.',
    materialType: 'nanomaterials',
    composition:
      'Pure Ti (Grade 2): 99.9%, Average grain size target: < 100 nm, Oxygen content: < 0.15%, Nitrogen: < 0.05%',
    conditions:
      'Processing method: ECAP, Processing temperature: 400°C, Number of passes: 8, Total accumulated strain: ~8, Strain rate: 10⁻² s⁻¹',
    application: 'biomedical',
    targetProperties: 'Grain size: <100 nm, Yield strength: >800 MPa, Biocompatibility: excellent',
    processingMethod: '',
    priority: 'performance',
    constraints: 'Processing temperature: <500°C, Material purity: >99.9%'
  }
];

export function ExamplesContent() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-50 to-white'>
      <Navigation variant='back-to-dashboard' backUrl='/dashboard' backLabel='Back to Dashboard' />

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12 pt-24'>
        <div className='max-w-5xl mx-auto space-y-8'>
          {/* Header */}
          <div>
            <h1 className='text-4xl font-bold mb-4'>Simulation Query Examples</h1>
            <p className='text-muted-foreground text-lg'>
              Use these examples as templates for your research
            </p>
          </div>

          {/* Examples Grid */}
          <div className='grid gap-6'>
            {examples.map((example, index) => (
              <Card key={index} className='hover:shadow-lg transition-shadow'>
                <CardHeader>
                  <div className='flex justify-between items-start'>
                    <div>
                      <CardTitle className='text-xl mb-2'>{example.simulationTitle}</CardTitle>
                      <CardDescription className='flex items-center gap-2'>
                        <span className='inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                          {example.category}
                        </span>
                      </CardDescription>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        let copyText = `Title: ${example.simulationTitle}\n\nGoal: ${example.goal}\n\nMaterial Type: ${example.materialType}\n\nComposition: ${example.composition}\n\nConditions: ${example.conditions}`;
                        if (example.application)
                          copyText += `\n\nApplication: ${example.application}`;
                        if (example.targetProperties)
                          copyText += `\n\nTarget Properties: ${example.targetProperties}`;
                        if (example.processingMethod)
                          copyText += `\n\nProcessing Method: ${example.processingMethod}`;
                        if (example.priority) copyText += `\n\nPriority: ${example.priority}`;
                        if (example.constraints)
                          copyText += `\n\nConstraints: ${example.constraints}`;
                        copyToClipboard(copyText, index);
                      }}
                    >
                      {copiedIndex === index ? (
                        <Check className='h-4 w-4 text-green-500' />
                      ) : (
                        <Copy className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <h4 className='font-semibold mb-2 text-sm'>Research Goal:</h4>
                    <p className='text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md'>
                      {example.goal}
                    </p>
                  </div>
                  <div className='grid md:grid-cols-2 gap-4 text-sm'>
                    <div>
                      <h4 className='font-semibold mb-1'>Material Type:</h4>
                      <p className='text-muted-foreground'>{example.materialType}</p>
                    </div>
                    {example.application && (
                      <div>
                        <h4 className='font-semibold mb-1'>Application:</h4>
                        <p className='text-muted-foreground capitalize'>
                          {example.application.replace('-', ' ')}
                        </p>
                      </div>
                    )}
                    <div>
                      <h4 className='font-semibold mb-1'>Composition:</h4>
                      <p className='text-muted-foreground text-xs'>{example.composition}</p>
                    </div>
                    <div>
                      <h4 className='font-semibold mb-1'>Conditions:</h4>
                      <p className='text-muted-foreground text-xs'>{example.conditions}</p>
                    </div>
                  </div>
                  {(example.targetProperties ||
                    example.processingMethod ||
                    example.priority ||
                    example.constraints) && (
                    <div className='pt-4 border-t space-y-3'>
                      <h4 className='font-semibold text-sm text-primary'>Advanced Parameters:</h4>
                      <div className='grid md:grid-cols-2 gap-3 text-sm'>
                        {example.targetProperties && (
                          <div>
                            <h5 className='font-medium mb-1 text-xs'>Target Properties:</h5>
                            <p className='text-muted-foreground text-xs'>
                              {example.targetProperties}
                            </p>
                          </div>
                        )}
                        {example.processingMethod && (
                          <div>
                            <h5 className='font-medium mb-1 text-xs'>Processing Method:</h5>
                            <p className='text-muted-foreground text-xs capitalize'>
                              {example.processingMethod.replace('-', ' ')}
                            </p>
                          </div>
                        )}
                        {example.priority && (
                          <div>
                            <h5 className='font-medium mb-1 text-xs'>Priority:</h5>
                            <p className='text-muted-foreground text-xs capitalize'>
                              {example.priority}
                            </p>
                          </div>
                        )}
                        {example.constraints && (
                          <div>
                            <h5 className='font-medium mb-1 text-xs'>Constraints:</h5>
                            <p className='text-muted-foreground text-xs'>{example.constraints}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tips Section */}
          <Card className='bg-primary/5 border-primary/20'>
            <CardHeader>
              <CardTitle>💡 Tips for Better Results</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm'>
              <div>
                <h4 className='font-semibold mb-1'>Research Goal:</h4>
                <ul className='list-disc list-inside space-y-1 text-muted-foreground'>
                  <li>Be specific and detailed</li>
                  <li>Specify target properties or characteristics</li>
                  <li>Mention the application area</li>
                </ul>
              </div>
              <div>
                <h4 className='font-semibold mb-1'>Composition:</h4>
                <ul className='list-disc list-inside space-y-1 text-muted-foreground'>
                  <li>Specify exact percentages or ratios</li>
                  <li>Mention impurities and additives</li>
                  <li>For composites, specify volume/weight fraction</li>
                </ul>
              </div>
              <div>
                <h4 className='font-semibold mb-1'>Experimental Conditions:</h4>
                <ul className='list-disc list-inside space-y-1 text-muted-foreground'>
                  <li>Specify temperature and pressure ranges</li>
                  <li>Mention heating/cooling rates</li>
                  <li>Specify processing time and atmosphere</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className='text-center'>
            <Link href='/dashboard'>
              <Button size='lg'>Create Your Simulation</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
