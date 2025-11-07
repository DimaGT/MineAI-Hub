'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { SimulationLoader } from '@/components/ui/simulation-loader';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { ChevronDown, ChevronUp, FlaskConical, Info, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function SimulationFormContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    goal: '',
    materialType: '',
    composition: '',
    conditions: '',
    application: '',
    targetProperties: '',
    processingMethod: '',
    constraints: '',
    priority: ''
  });
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Simulation failed');
      }

      const data = await response.json();
      router.push(`/results/${data.id}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to run simulation. Please try again.');
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      <Navigation />

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12'>
        <Card className='max-w-4xl mx-auto'>
          {loading ? null : <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FlaskConical className='h-6 w-6' />
              Run Simulation
            </CardTitle>
            <CardDescription>
              Enter your research parameters to generate an AI-powered simulation report
              <br />
              <Link href='/examples' className='text-primary hover:underline text-sm'>
                📖 View example queries →
              </Link>
            </CardDescription>
          </CardHeader>}
          <CardContent>
            {loading ? (
              <SimulationLoader />
            ) : (
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Basic Parameters */}
                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='title'>Simulation Title</Label>
                    <Input
                      id='title'
                      placeholder='e.g., Steel Thermal Treatment Optimization'
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Give your simulation a descriptive name (optional)
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='goal' className='flex items-center gap-2'>
                      Research Goal
                      <span className='text-xs text-muted-foreground font-normal'>(Required)</span>
                    </Label>
                    <Textarea
                      id='goal'
                      placeholder='Describe your research objective, what you want to achieve, optimize, or investigate...'
                      value={formData.goal}
                      onChange={e => setFormData({ ...formData, goal: e.target.value })}
                      required
                      rows={4}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Be specific about your objectives and target outcomes
                    </p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='materialType' className='flex items-center gap-2'>
                        Material Type
                        <span className='text-xs text-muted-foreground font-normal'>
                          (Required)
                        </span>
                      </Label>
                      <Select
                        id='materialType'
                        value={formData.materialType}
                        onChange={e => setFormData({ ...formData, materialType: e.target.value })}
                        required
                      >
                        <option value=''>Select material type</option>
                        <option value='metals'>Metals</option>
                        <option value='polymers'>Polymers</option>
                        <option value='ceramics'>Ceramics</option>
                        <option value='composites'>Composites</option>
                        <option value='nanomaterials'>Nanomaterials</option>
                        <option value='other'>Other</option>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='application' className='flex items-center gap-2'>
                        Application Area
                      </Label>
                      <Select
                        id='application'
                        value={formData.application}
                        onChange={e => setFormData({ ...formData, application: e.target.value })}
                      >
                        <option value=''>Select application (optional)</option>
                        <option value='structural'>Structural Components</option>
                        <option value='aerospace'>Aerospace</option>
                        <option value='automotive'>Automotive</option>
                        <option value='electronics'>Electronics</option>
                        <option value='biomedical'>Biomedical</option>
                        <option value='energy'>Energy Storage</option>
                        <option value='marine'>Marine Applications</option>
                        <option value='high-temperature'>High Temperature</option>
                        <option value='other'>Other</option>
                      </Select>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='composition' className='flex items-center gap-2'>
                      Composition
                      <span className='text-xs text-muted-foreground font-normal'>(Required)</span>
                    </Label>
                    <Input
                      id='composition'
                      placeholder='e.g., Fe 95%, C 0.4%, Mn 0.6%, Si 0.3%'
                      value={formData.composition}
                      onChange={e => setFormData({ ...formData, composition: e.target.value })}
                      required
                    />
                    <p className='text-xs text-muted-foreground'>
                      Specify chemical composition with percentages or ratios
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='conditions' className='flex items-center gap-2'>
                      Experimental Conditions
                      <span className='text-xs text-muted-foreground font-normal'>(Required)</span>
                    </Label>
                    <Textarea
                      id='conditions'
                      placeholder='Temperature: 850°C, Pressure: 1 atm, Time: 2 hours, Heating rate: 5°C/min, Atmosphere: Air...'
                      value={formData.conditions}
                      onChange={e => setFormData({ ...formData, conditions: e.target.value })}
                      required
                      rows={3}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Include temperature, pressure, time, heating/cooling rates, atmosphere, etc.
                    </p>
                  </div>
                </div>

                {/* Advanced Parameters */}
                <div className='border-t pt-6'>
                  <button
                    type='button'
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className='flex items-center justify-between w-full mb-4 text-sm font-medium text-gray-700 hover:text-primary transition-colors'
                  >
                    <div className='flex items-center gap-2'>
                      <Zap className='h-4 w-4' />
                      <span>Advanced Parameters</span>
                      <span className='text-xs text-muted-foreground font-normal'>(Optional)</span>
                    </div>
                    {showAdvanced ? (
                      <ChevronUp className='h-4 w-4' />
                    ) : (
                      <ChevronDown className='h-4 w-4' />
                    )}
                  </button>

                  {showAdvanced && (
                    <div className='space-y-6 pt-2 bg-gray-50/50 p-4 rounded-lg border border-gray-200'>
                      <div className='space-y-2'>
                        <Label htmlFor='targetProperties' className='flex items-center gap-2'>
                          <Target className='h-4 w-4' />
                          Target Properties
                        </Label>
                        <Textarea
                          id='targetProperties'
                          placeholder='e.g., Tensile strength: >500 MPa, Hardness: 40-50 HRC, Thermal conductivity: >100 W/m·K, Operating temperature: up to 800°C...'
                          value={formData.targetProperties}
                          onChange={e =>
                            setFormData({ ...formData, targetProperties: e.target.value })
                          }
                          rows={3}
                        />
                        <p className='text-xs text-muted-foreground flex items-start gap-1'>
                          <Info className='h-3 w-3 mt-0.5 flex-shrink-0' />
                          Specify desired material properties and performance criteria
                        </p>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='processingMethod'>Processing Method</Label>
                          <Select
                            id='processingMethod'
                            value={formData.processingMethod}
                            onChange={e =>
                              setFormData({ ...formData, processingMethod: e.target.value })
                            }
                          >
                            <option value=''>Select method (optional)</option>
                            <option value='casting'>Casting</option>
                            <option value='forging'>Forging</option>
                            <option value='extrusion'>Extrusion</option>
                            <option value='sintering'>Sintering</option>
                            <option value='3d-printing'>3D Printing</option>
                            <option value='injection-molding'>Injection Molding</option>
                            <option value='machining'>Machining</option>
                            <option value='welding'>Welding</option>
                            <option value='heat-treatment'>Heat Treatment</option>
                            <option value='other'>Other</option>
                          </Select>
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='priority'>Priority Focus</Label>
                          <Select
                            id='priority'
                            value={formData.priority}
                            onChange={e => setFormData({ ...formData, priority: e.target.value })}
                          >
                            <option value=''>Select priority (optional)</option>
                            <option value='cost'>Cost Optimization</option>
                            <option value='performance'>Performance Maximization</option>
                            <option value='durability'>Durability & Reliability</option>
                            <option value='efficiency'>Process Efficiency</option>
                            <option value='quality'>Quality Consistency</option>
                            <option value='sustainability'>Sustainability</option>
                          </Select>
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='constraints'>Constraints & Limitations</Label>
                        <Textarea
                          id='constraints'
                          placeholder='e.g., Budget: <$1000/kg, Processing time: <24 hours, Maximum temperature: 1200°C, Size limitations: <100mm...'
                          value={formData.constraints}
                          onChange={e => setFormData({ ...formData, constraints: e.target.value })}
                          rows={2}
                        />
                        <p className='text-xs text-muted-foreground'>
                          Include any budget, time, size, or technical limitations
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Button type='submit' className='w-full' size='lg'>
                  <FlaskConical className='mr-2 h-5 w-5' />
                  Run Simulation
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
