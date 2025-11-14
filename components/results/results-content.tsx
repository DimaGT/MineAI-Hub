'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { createClient } from '@/lib/supabase/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BarChart3, ChevronDown, ChevronUp, Globe, Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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

interface SimulationData {
  id: string;
  is_public: boolean | null;
  input_data: {
    goal?: string;
    materialType?: string;
    mineralType?: string;
    composition?: string;
    conditions?: string;
    template?: string;
    // Leach Chemistry
    pH?: string;
    eh?: string;
    temperature?: string;
    // Mineralogical
    chalcopyritePercent?: string;
    pyritePercent?: string;
    // Operational
    residenceTime?: string;
    pulpDensity?: string;
    particleSize?: string;
    // And other new fields...
    [key: string]: any;
  };
  ai_result: {
    processSummary: string;
    recommendedMethod: string;
    // Legacy data format
    temperatureData?: Array<{ temperature: number; efficiency: number }>;
    materialPropertiesData?: Array<{
      temperature: number;
      hardness?: number;
      strength?: number;
      conductivity?: number;
    }>;
    // New mining-specific data format
    recoveryData?: Array<{ time: number; recovery: number; grade?: number }>;
    chemistryProfiles?: {
      pH?: Array<{ time: number; pH: number }>;
      eh?: Array<{ time: number; eh: number }>;
      fe3Fe2Ratio?: Array<{ time: number; ratio: number }>;
    };
    kineticsAnalysis?: {
      rateConstant?: number;
      reactionOrder?: number;
      activationEnergy?: number;
      halfLife?: number;
    };
    confidenceScore: number;
    predictions?: any;
  };
  created_at: string;
}

export function ResultsContent({ simulationId }: { simulationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  const supabase = createClient();

  // Accordion states for input parameters
  const [showBasicParams, setShowBasicParams] = useState(true);
  const [showLeachChemistry, setShowLeachChemistry] = useState(false);
  const [showMineralogical, setShowMineralogical] = useState(false);
  const [showOperational, setShowOperational] = useState(false);
  const [showHVP, setShowHVP] = useState(false);
  const [showEnvironmental, setShowEnvironmental] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);

  useEffect(() => {
    const fetchSimulation = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/signin');
        return;
      }

      const { data, error } = await supabase
        .from('simulations')
        .select('*')
        .eq('id', simulationId)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        console.error('Error fetching simulation:', error);
        router.push('/dashboard');
        return;
      }

      setSimulation(data as SimulationData);
      setLoading(false);
    };

    fetchSimulation();
  }, [simulationId, router, supabase]);

  const handleDownloadPDF = async () => {
    if (!simulation) return;

    const element = document.getElementById('results-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`simulation-${simulationId}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleTogglePublic = async () => {
    if (!simulation || updating) return;

    setUpdating(true);
    try {
      const newPublicStatus = !simulation.is_public;
      const response = await fetch(`/api/simulations/${simulationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_public: newPublicStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update simulation');
      }

      setSimulation({ ...simulation, is_public: newPublicStatus });
      toast.success(newPublicStatus ? 'Simulation made public' : 'Simulation made private');
    } catch (error) {
      console.error('Error updating simulation:', error);
      toast.error('Failed to update simulation visibility');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <LoadingSpinner title='Loading simulation results...' />
      </div>
    );
  }

  if (!simulation) {
    return null;
  }

  // Support both legacy and new data formats
  const temperatureData = simulation.ai_result.temperatureData || [];
  const recoveryData = simulation.ai_result.recoveryData || [];
  const chemistryProfiles = simulation.ai_result.chemistryProfiles || {};
  const kineticsAnalysis = simulation.ai_result.kineticsAnalysis;

  // Determine if this is a mining simulation (new format) or legacy
  const isMiningSimulation = recoveryData.length > 0 || Object.keys(chemistryProfiles).length > 0;

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#f8fefa] to-white'>
      <Navigation variant='back-to-dashboard' backUrl='/dashboard' backLabel='Back to Dashboard' />

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12 pt-24' id='results-content'>
        <div className='max-w-6xl mx-auto space-y-6'>
          {/* Header */}
          <div className='flex justify-between items-start'>
            <div>
              <h1 className='text-3xl font-bold mb-2'>Simulation Results</h1>
              <p className='text-muted-foreground'>
                {new Date(simulation.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className='flex gap-2'>
              <Button
                variant={simulation.is_public ? 'default' : 'outline'}
                onClick={handleTogglePublic}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : simulation.is_public ? (
                  <Globe className='mr-2 h-4 w-4' />
                ) : (
                  <Lock className='mr-2 h-4 w-4' />
                )}
                {simulation.is_public ? 'Public' : 'Make Public'}
              </Button>
              {/* <Button onClick={handleDownloadPDF}>
                <Download className='mr-2 h-4 w-4' />
                Download PDF
              </Button> */}
            </div>
          </div>

          {/* Input Data Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Input Parameters</CardTitle>
              <CardDescription>
                Click on sections to expand or collapse parameter groups
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Basic Parameters */}
              {(simulation.input_data.title ||
                simulation.input_data.goal ||
                simulation.input_data.mineralType ||
                simulation.input_data.materialType ||
                simulation.input_data.template) && (
                <div className='border rounded-lg overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => setShowBasicParams(!showBasicParams)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100/50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-base font-semibold text-gray-800 ${
                      showBasicParams ? 'rounded-t-lg' : 'rounded-lg'
                    }`}
                  >
                    <span>Basic Parameters</span>
                    {showBasicParams ? (
                      <ChevronUp className='h-4 w-4 text-gray-600' />
                    ) : (
                      <ChevronDown className='h-4 w-4 text-gray-600' />
                    )}
                  </button>
                  {showBasicParams && (
                    <div className='p-4 bg-gray-50/50'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        {simulation.input_data.title && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Simulation Title:</span>{' '}
                            <span className='text-gray-600'>{simulation.input_data.title}</span>
                          </div>
                        )}
                        {simulation.input_data.goal && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Primary Objective:</span>{' '}
                            <span className='text-gray-600'>{simulation.input_data.goal}</span>
                          </div>
                        )}
                        {(simulation.input_data.mineralType ||
                          simulation.input_data.materialType) && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Mineral Type:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.mineralType ||
                                simulation.input_data.materialType}
                            </span>
                          </div>
                        )}
                        {simulation.input_data.template && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Simulation Template:
                            </span>{' '}
                            <span className='text-gray-600'>{simulation.input_data.template}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Leach Chemistry */}
              {(simulation.input_data.pH ||
                simulation.input_data.eh ||
                simulation.input_data.acidConcentration ||
                simulation.input_data.fe3Concentration) && (
                <div className='border rounded-lg overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => setShowLeachChemistry(!showLeachChemistry)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100/50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-base font-semibold text-gray-800 ${
                      showLeachChemistry ? 'rounded-t-lg' : 'rounded-lg'
                    }`}
                  >
                    <span>Leach Chemistry</span>
                    {showLeachChemistry ? (
                      <ChevronUp className='h-4 w-4 text-gray-600' />
                    ) : (
                      <ChevronDown className='h-4 w-4 text-gray-600' />
                    )}
                  </button>
                  {showLeachChemistry && (
                    <div className='p-4 bg-gray-50/50'>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {simulation.input_data.pH && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>pH Setpoint:</span>{' '}
                            <span className='text-gray-600'>{simulation.input_data.pH}</span>
                          </div>
                        )}
                        {simulation.input_data.eh && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Redox Potential (Eh):
                            </span>{' '}
                            <span className='text-gray-600'>{simulation.input_data.eh} mV</span>
                          </div>
                        )}
                        {simulation.input_data.orp && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>ORP:</span>{' '}
                            <span className='text-gray-600'>{simulation.input_data.orp} mV</span>
                          </div>
                        )}
                        {simulation.input_data.acidConcentration && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Acid Concentration:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.acidConcentration} g/L
                            </span>
                          </div>
                        )}
                        {simulation.input_data.fe3Concentration && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Fe³⁺ Concentration:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.fe3Concentration} g/L
                            </span>
                          </div>
                        )}
                        {simulation.input_data.fe2Concentration && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Fe²⁺ Concentration:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.fe2Concentration} g/L
                            </span>
                          </div>
                        )}
                        {simulation.input_data.oxidantType && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Oxidant Type:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.oxidantType}
                            </span>
                          </div>
                        )}
                        {simulation.input_data.oxidantDosage && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Oxidant Dosage:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.oxidantDosage} g/L
                            </span>
                          </div>
                        )}
                        {simulation.input_data.sulfateConcentration && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Sulfate Concentration:
                            </span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.sulfateConcentration} g/L
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mineralogical Inputs */}
              {(simulation.input_data.mineralComposition ||
                simulation.input_data.particleSize ||
                simulation.input_data.chalcopyritePercent ||
                simulation.input_data.pyritePercent) && (
                <div className='border rounded-lg overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => setShowMineralogical(!showMineralogical)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100/50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-base font-semibold text-gray-800 ${
                      showMineralogical ? 'rounded-t-lg' : 'rounded-lg'
                    }`}
                  >
                    <span>Mineralogical Inputs</span>
                    {showMineralogical ? (
                      <ChevronUp className='h-4 w-4 text-gray-600' />
                    ) : (
                      <ChevronDown className='h-4 w-4 text-gray-600' />
                    )}
                  </button>
                  {showMineralogical && (
                    <div className='p-4 bg-gray-50/50'>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {simulation.input_data.mineralComposition && (
                          <div className='md:col-span-2 lg:col-span-3 text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Mineral Composition/Assay:
                            </span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.mineralComposition}
                            </span>
                          </div>
                        )}
                        {simulation.input_data.particleSize && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Particle Size:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.particleSize} µm
                            </span>
                          </div>
                        )}
                        {simulation.input_data.particleLiberation && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Liberation Index:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.particleLiberation}%
                            </span>
                          </div>
                        )}
                        {simulation.input_data.chalcopyritePercent && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Chalcopyrite:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.chalcopyritePercent}%
                            </span>
                          </div>
                        )}
                        {simulation.input_data.pyritePercent && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Pyrite:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.pyritePercent}%
                            </span>
                          </div>
                        )}
                        {simulation.input_data.bornitePercent && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Bornite:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.bornitePercent}%
                            </span>
                          </div>
                        )}
                        {simulation.input_data.alterationMinerals && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Alteration Minerals:
                            </span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.alterationMinerals}
                            </span>
                          </div>
                        )}
                        {simulation.input_data.gangueMatrix && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Gangue Matrix:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.gangueMatrix}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Operational Conditions */}
              {(simulation.input_data.temperature ||
                simulation.input_data.residenceTime ||
                simulation.input_data.pulpDensity ||
                simulation.input_data.agitationRate) && (
                <div className='border rounded-lg overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => setShowOperational(!showOperational)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100/50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-base font-semibold text-gray-800 ${
                      showOperational ? 'rounded-t-lg' : 'rounded-lg'
                    }`}
                  >
                    <span>Operational Conditions</span>
                    {showOperational ? (
                      <ChevronUp className='h-4 w-4 text-gray-600' />
                    ) : (
                      <ChevronDown className='h-4 w-4 text-gray-600' />
                    )}
                  </button>
                  {showOperational && (
                    <div className='p-4 bg-gray-50/50'>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {simulation.input_data.temperature && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Temperature:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.temperature}°C
                            </span>
                          </div>
                        )}
                        {simulation.input_data.residenceTime && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Residence Time:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.residenceTime} hours
                            </span>
                          </div>
                        )}
                        {simulation.input_data.pulpDensity && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Pulp Density:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.pulpDensity}%
                            </span>
                          </div>
                        )}
                        {simulation.input_data.agitationRate && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Agitation/Mixing Rate:
                            </span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.agitationRate} rpm
                            </span>
                          </div>
                        )}
                        {simulation.input_data.pressure && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Pressure:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.pressure} atm
                            </span>
                          </div>
                        )}
                        {simulation.input_data.grainSize && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Grain Size:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.grainSize} µm
                            </span>
                          </div>
                        )}
                        {simulation.input_data.reagentSchedule && (
                          <div className='md:col-span-2 lg:col-span-3 text-sm'>
                            <span className='font-semibold text-gray-700'>Reagent Schedule:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.reagentSchedule}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* HVP Parameters */}
              {(simulation.input_data.voltage ||
                simulation.input_data.pulseFrequency ||
                simulation.input_data.pulseEnergy ||
                simulation.input_data.hvpTargetedLiberation) && (
                <div className='border rounded-lg overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => setShowHVP(!showHVP)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100/50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-base font-semibold text-gray-800 ${
                      showHVP ? 'rounded-t-lg' : 'rounded-lg'
                    }`}
                  >
                    <span>HVP Parameters</span>
                    {showHVP ? (
                      <ChevronUp className='h-4 w-4 text-gray-600' />
                    ) : (
                      <ChevronDown className='h-4 w-4 text-gray-600' />
                    )}
                  </button>
                  {showHVP && (
                    <div className='p-4 bg-gray-50/50'>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {simulation.input_data.voltage && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Voltage:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.voltage} kV
                            </span>
                          </div>
                        )}
                        {simulation.input_data.pulseFrequency && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Pulse Frequency:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.pulseFrequency} Hz
                            </span>
                          </div>
                        )}
                        {simulation.input_data.pulseEnergy && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Pulse Energy:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.pulseEnergy} kWh/t
                            </span>
                          </div>
                        )}
                        {simulation.input_data.specificEnergy && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Specific Energy:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.specificEnergy} kWh/t
                            </span>
                          </div>
                        )}
                        {simulation.input_data.hvpTargetedLiberation && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Targeted Liberation after HVP:
                            </span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.hvpTargetedLiberation}%
                            </span>
                          </div>
                        )}
                        {simulation.input_data.fragmentationModel && (
                          <div className='md:col-span-2 lg:col-span-3 text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Fragmentation Model:
                            </span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.fragmentationModel}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Environmental Conditions */}
              {(simulation.input_data.atmosphere ||
                simulation.input_data.leachMedium ||
                simulation.input_data.dissolvedOxygen) && (
                <div className='border rounded-lg overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => setShowEnvironmental(!showEnvironmental)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100/50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-base font-semibold text-gray-800 ${
                      showEnvironmental ? 'rounded-t-lg' : 'rounded-lg'
                    }`}
                  >
                    <span>Environmental Conditions</span>
                    {showEnvironmental ? (
                      <ChevronUp className='h-4 w-4 text-gray-600' />
                    ) : (
                      <ChevronDown className='h-4 w-4 text-gray-600' />
                    )}
                  </button>
                  {showEnvironmental && (
                    <div className='p-4 bg-gray-50/50'>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {simulation.input_data.atmosphere && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Atmosphere:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.atmosphere}
                            </span>
                          </div>
                        )}
                        {simulation.input_data.leachMedium && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Leach Medium:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.leachMedium}
                            </span>
                          </div>
                        )}
                        {simulation.input_data.dissolvedOxygen && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Dissolved Oxygen:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.dissolvedOxygen} mg/L
                            </span>
                          </div>
                        )}
                        {simulation.input_data.oxygenFlowRate && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Oxygen Flow Rate:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.oxygenFlowRate} L/min
                            </span>
                          </div>
                        )}
                        {simulation.input_data.solidToLiquidRatio && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Solid-to-Liquid Ratio:
                            </span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.solidToLiquidRatio}
                            </span>
                          </div>
                        )}
                        {simulation.input_data.redoxControl && (
                          <div className='md:col-span-2 lg:col-span-3 text-sm'>
                            <span className='font-semibold text-gray-700'>Redox Control:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.redoxControl}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Advanced Parameters */}
              {(simulation.input_data.diffusionCoefficient ||
                simulation.input_data.rateConstantOverride ||
                simulation.input_data.activationEnergy ||
                simulation.input_data.gangueAcidConsumption) && (
                <div className='border rounded-lg overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100/50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-base font-semibold text-gray-800 ${
                      showAdvanced ? 'rounded-t-lg' : 'rounded-lg'
                    }`}
                  >
                    <span>Advanced Parameters</span>
                    {showAdvanced ? (
                      <ChevronUp className='h-4 w-4 text-gray-600' />
                    ) : (
                      <ChevronDown className='h-4 w-4 text-gray-600' />
                    )}
                  </button>
                  {showAdvanced && (
                    <div className='p-4 bg-gray-50/50'>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {simulation.input_data.diffusionCoefficient && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Diffusion Coefficient:
                            </span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.diffusionCoefficient}
                            </span>
                          </div>
                        )}
                        {simulation.input_data.shrinkingCoreModel && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Shrinking Core Model:
                            </span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.shrinkingCoreModel}
                            </span>
                          </div>
                        )}
                        {simulation.input_data.rateConstantOverride && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Rate Constant (k):</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.rateConstantOverride}
                            </span>
                          </div>
                        )}
                        {simulation.input_data.activationEnergy && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Activation Energy:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.activationEnergy} kJ/mol
                            </span>
                          </div>
                        )}
                        {simulation.input_data.reactionOrder && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>Reaction Order:</span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.reactionOrder}
                            </span>
                          </div>
                        )}
                        {simulation.input_data.gangueAcidConsumption && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Gangue Acid Consumption (GAC):
                            </span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.gangueAcidConsumption} kg/t
                            </span>
                          </div>
                        )}
                        {simulation.input_data.ferricRegenerationEfficiency && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Ferric Regeneration Efficiency:
                            </span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.ferricRegenerationEfficiency}%
                            </span>
                          </div>
                        )}
                        {simulation.input_data.surfacePassivation && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Surface Passivation:
                            </span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.surfacePassivation}
                            </span>
                          </div>
                        )}
                        {simulation.input_data.particleShapeFactor && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700'>
                              Particle Shape Factor:
                            </span>{' '}
                            <span className='text-gray-600'>
                              {simulation.input_data.particleShapeFactor}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Information */}
              {(simulation.input_data.composition || simulation.input_data.constraints) && (
                <div className='border rounded-lg overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => setShowAdditional(!showAdditional)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100/50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-base font-semibold text-gray-800 ${
                      showAdditional ? 'rounded-t-lg' : 'rounded-lg'
                    }`}
                  >
                    <span>Additional Information</span>
                    {showAdditional ? (
                      <ChevronUp className='h-4 w-4 text-gray-600' />
                    ) : (
                      <ChevronDown className='h-4 w-4 text-gray-600' />
                    )}
                  </button>
                  {showAdditional && (
                    <div className='p-4 bg-gray-50/50'>
                      <div className='space-y-3'>
                        {simulation.input_data.composition && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700 block mb-1'>
                              Additional Composition Details:
                            </span>
                            <p className='text-gray-600'>{simulation.input_data.composition}</p>
                          </div>
                        )}
                        {simulation.input_data.constraints && (
                          <div className='text-sm'>
                            <span className='font-semibold text-gray-700 block mb-1'>
                              Constraints & Limitations:
                            </span>
                            <p className='text-gray-600'>{simulation.input_data.constraints}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Report */}
          <Card>
            <CardHeader>
              <CardTitle>AI Simulation Report</CardTitle>
              <CardDescription>Simulation Results</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Confidence Level with Progress Bar */}
              <div className='pb-4 border-b'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-semibold text-gray-700'>Confidence Level:</span>
                  <span className='text-sm font-semibold text-gray-800'>
                    {Math.round(simulation.ai_result.confidenceScore * 100)}%
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2.5'>
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      simulation.ai_result.confidenceScore > 0.7
                        ? 'bg-green-500'
                        : simulation.ai_result.confidenceScore > 0.5
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${simulation.ai_result.confidenceScore * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <h3 className='font-semibold mb-2'>Process Summary</h3>
                <p className='text-muted-foreground whitespace-pre-wrap'>
                  {simulation.ai_result.processSummary}
                </p>
              </div>
              <div>
                <h3 className='font-semibold mb-2'>Recommended Method</h3>
                <p className='text-muted-foreground whitespace-pre-wrap'>
                  {simulation.ai_result.recommendedMethod}
                </p>
              </div>
            </CardContent>
          </Card>
{/* Kinetics Analysis (Mining) */}
{isMiningSimulation && kineticsAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='h-5 w-5' />
                    Kinetics Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {kineticsAnalysis.rateConstant !== undefined && (
                      <div>
                        <p className='text-sm text-muted-foreground'>Rate Constant</p>
                        <p className='text-2xl font-bold'>
                          {kineticsAnalysis.rateConstant.toFixed(4)} h⁻¹
                        </p>
                      </div>
                    )}
                    {kineticsAnalysis.reactionOrder !== undefined && (
                      <div>
                        <p className='text-sm text-muted-foreground'>Reaction Order</p>
                        <p className='text-2xl font-bold'>
                          {kineticsAnalysis.reactionOrder.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {kineticsAnalysis.activationEnergy !== undefined && (
                      <div>
                        <p className='text-sm text-muted-foreground'>Activation Energy</p>
                        <p className='text-2xl font-bold'>
                          {kineticsAnalysis.activationEnergy.toFixed(1)} kJ/mol
                        </p>
                      </div>
                    )}
                    {kineticsAnalysis.halfLife !== undefined && (
                      <div>
                        <p className='text-sm text-muted-foreground'>Half-Life</p>
                        <p className='text-2xl font-bold'>
                          {kineticsAnalysis.halfLife.toFixed(1)} hours
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          {/* Visualizations */}
          <div className='full-w flex flex-col gap-6 '>
            {/* Recovery vs Time (Mining) or Efficiency vs Temperature (Legacy) */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {isMiningSimulation && recoveryData.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='h-5 w-5' />
                    Metal Recovery vs Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={400}>
                    <LineChart
                      data={recoveryData}
                      margin={{ top: 20, bottom: 50, left: 20, right: 20 }}
                    >
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis
                        dataKey='time'
                        label={{
                          value: 'Time (hours)',
                          position: 'bottom',
                          offset: 10
                        }}
                        tick={{ dy: 10 }}
                      />
                      <YAxis
                        label={{ value: 'Recovery (%)', angle: -90, position: 'insideLeft' }}
                        domain={[0, 100]}
                      />
                      <Tooltip />
                      <Legend wrapperStyle={{ paddingTop: '35px' }} />
                      <Line
                        type='monotone'
                        dataKey='recovery'
                        stroke='hsl(var(--primary))'
                        strokeWidth={2}
                        name='Recovery (%)'
                        dot={{ r: 4 }}
                      />
                      {recoveryData[0]?.grade !== undefined && (
                        <Line
                          type='monotone'
                          dataKey='grade'
                          stroke='#82ca9d'
                          strokeWidth={2}
                          name='Grade (%)'
                          dot={{ r: 4 }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : temperatureData.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='h-5 w-5' />
                    Extraction Efficiency vs Temperature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={400}>
                    <LineChart
                      data={temperatureData}
                      margin={{ top: 20, bottom: 50, left: 20, right: 20 }}
                    >
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
                      <YAxis
                        label={{ value: 'Efficiency', angle: -90, position: 'insideLeft' }}
                        domain={[
                          0,
                          Math.min(1, Math.max(...temperatureData.map(d => d.efficiency)) + 0.1)
                        ]}
                      />
                      <Tooltip />
                      <Legend wrapperStyle={{ paddingTop: '35px' }} />
                      <Line
                        type='monotone'
                        dataKey='efficiency'
                        stroke='hsl(var(--primary))'
                        strokeWidth={2}
                        name='Efficiency'
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : null}

            {/* Chemistry Profiles (Mining) */}
            {isMiningSimulation && Object.keys(chemistryProfiles).length > 0 && (
              <>
                {chemistryProfiles.pH && chemistryProfiles.pH.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <BarChart3 className='h-5 w-5' />
                        pH vs Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width='100%' height={400}>
                        <LineChart
                          data={chemistryProfiles.pH}
                          margin={{ top: 20, bottom: 50, left: 20, right: 20 }}
                        >
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis
                            dataKey='time'
                            label={{
                              value: 'Time (hours)',
                              position: 'bottom',
                              offset: 10
                            }}
                            tick={{ dy: 10 }}
                          />
                          <YAxis label={{ value: 'pH', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Legend wrapperStyle={{ paddingTop: '35px' }} />
                          <Line
                            type='monotone'
                            dataKey='pH'
                            stroke='#8884d8'
                            strokeWidth={2}
                            name='pH'
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {chemistryProfiles.eh && chemistryProfiles.eh.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <BarChart3 className='h-5 w-5' />
                        Eh vs Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width='100%' height={400}>
                        <LineChart
                          data={chemistryProfiles.eh}
                          margin={{ top: 20, bottom: 50, left: 20, right: 20 }}
                        >
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis
                            dataKey='time'
                            label={{
                              value: 'Time (hours)',
                              position: 'bottom',
                              offset: 10
                            }}
                            tick={{ dy: 10 }}
                          />
                          <YAxis label={{ value: 'Eh (mV)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Legend wrapperStyle={{ paddingTop: '35px' }} />
                          <Line
                            type='monotone'
                            dataKey='eh'
                            stroke='#82ca9d'
                            strokeWidth={2}
                            name='Eh (mV)'
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {chemistryProfiles.fe3Fe2Ratio && chemistryProfiles.fe3Fe2Ratio.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <BarChart3 className='h-5 w-5' />
                        Fe³⁺/Fe²⁺ Ratio vs Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width='100%' height={400}>
                        <LineChart
                          data={chemistryProfiles.fe3Fe2Ratio}
                          margin={{ top: 20, bottom: 50, left: 20, right: 20 }}
                        >
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis
                            dataKey='time'
                            label={{
                              value: 'Time (hours)',
                              position: 'bottom',
                              offset: 10
                            }}
                            tick={{ dy: 10 }}
                          />
                          <YAxis
                            label={{ value: 'Fe³⁺/Fe²⁺ Ratio', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip />
                          <Legend wrapperStyle={{ paddingTop: '35px' }} />
                          <Line
                            type='monotone'
                            dataKey='ratio'
                            stroke='#ffc658'
                            strokeWidth={2}
                            name='Fe³⁺/Fe²⁺ Ratio'
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
</div>
            
            {/* Material Properties vs Temperature */}
            {simulation.ai_result.materialPropertiesData &&
              simulation.ai_result.materialPropertiesData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <BarChart3 className='h-5 w-5' />
                      Material Properties vs Temperature
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width='100%' height={400}>
                      <AreaChart
                        data={simulation.ai_result.materialPropertiesData}
                        margin={{ bottom: 50 }}
                      >
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
                        {simulation.ai_result.materialPropertiesData[0]?.hardness !== undefined && (
                          <Area
                            type='monotone'
                            dataKey='hardness'
                            stackId='1'
                            stroke='#8884d8'
                            fill='#8884d8'
                            name='Hardness (HRC)'
                          />
                        )}
                        {simulation.ai_result.materialPropertiesData[0]?.strength !== undefined && (
                          <Area
                            type='monotone'
                            dataKey='strength'
                            stackId='1'
                            stroke='#82ca9d'
                            fill='#82ca9d'
                            name='Strength (MPa)'
                          />
                        )}
                        {simulation.ai_result.materialPropertiesData[0]?.conductivity !==
                          undefined && (
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
              )}
            {/* Material Properties Comparison (if multiple properties) */}
            {simulation.ai_result.materialPropertiesData &&
              simulation.ai_result.materialPropertiesData.length > 0 &&
              (simulation.ai_result.materialPropertiesData[0]?.hardness !== undefined ||
                simulation.ai_result.materialPropertiesData[0]?.strength !== undefined ||
                simulation.ai_result.materialPropertiesData[0]?.conductivity !== undefined) && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <BarChart3 className='h-5 w-5' />
                      Material Properties Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width='100%' height={400}>
                      <LineChart
                        data={simulation.ai_result.materialPropertiesData}
                        margin={{ bottom: 50 }}
                      >
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
                        {simulation.ai_result.materialPropertiesData[0]?.hardness !== undefined && (
                          <Line
                            type='monotone'
                            dataKey='hardness'
                            stroke='#8884d8'
                            strokeWidth={2}
                            name='Hardness (HRC)'
                            dot={{ r: 4 }}
                          />
                        )}
                        {simulation.ai_result.materialPropertiesData[0]?.strength !== undefined && (
                          <Line
                            type='monotone'
                            dataKey='strength'
                            stroke='#82ca9d'
                            strokeWidth={2}
                            name='Strength (MPa)'
                            dot={{ r: 4 }}
                          />
                        )}
                        {simulation.ai_result.materialPropertiesData[0]?.conductivity !==
                          undefined && (
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
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
