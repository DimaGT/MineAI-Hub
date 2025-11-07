'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BarChart3, Download } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
  title: string | null;
  user_id: string;
  input_data: {
    goal: string;
    materialType: string;
    composition: string;
    conditions: string;
  };
  ai_result: {
    processSummary: string;
    recommendedMethod: string;
    temperatureData: Array<{ temperature: number; efficiency: number }>;
    materialPropertiesData?: Array<{
      temperature: number;
      hardness?: number;
      strength?: number;
      conductivity?: number;
    }>;
    confidenceScore: number;
    predictions?: any;
  };
  created_at: string;
  author?: {
    email: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
    };
  };
}

export function PublicSimulationContent({ simulationId }: { simulationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchSimulation = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/signin');
        return;
      }

      // Fetch public simulation (no user_id check)
      const { data, error } = await supabase
        .from('simulations')
        .select('*')
        .eq('id', simulationId)
        .eq('is_public', true)
        .single();

      if (error || !data) {
        console.error('Error fetching simulation:', error);
        router.push('/knowledge');
        return;
      }

      // Fetch author information
      try {
        const simulationData = data as any;
        const response = await fetch(`/api/users/${simulationData.user_id}`);
        const authorData = await response.json();

        setSimulation({
          ...simulationData,
          author: {
            email: authorData.email || 'Unknown',
            user_metadata: authorData.user_metadata || {}
          }
        } as SimulationData);
      } catch {
        setSimulation(data as SimulationData);
      }

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

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
        <div className='container mx-auto px-4 py-12'>
          <LoadingSpinner title='Loading simulation results...' />
        </div>
      </div>
    );
  }

  if (!simulation) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
        <div className='container mx-auto px-4 py-12'>
          <Card>
            <CardContent className='py-12 text-center'>
              <p className='text-muted-foreground'>Simulation not found.</p>
              <Link href='/knowledge' className='mt-4 inline-block'>
                <Button variant='outline'>Back to Knowledge Hub</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      <Navigation
        variant='back-to-knowledge'
        backUrl='/knowledge'
        backLabel='Back to Knowledge Hub'
      />

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-5xl mx-auto space-y-8' id='results-content'>
          {/* Header */}
          <div className='space-y-4'>
            <div>
              <h1 className='text-4xl font-bold mb-2'>
                {simulation.title || 'Untitled Simulation'}
              </h1>
              <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                <span>{format(new Date(simulation.created_at), 'PPP')}</span>
                {/* {simulation.author && (
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">
                      {simulation.author.user_metadata?.full_name ||
                        simulation.author.user_metadata?.name ||
                        simulation.author.email?.split("@")[0] ||
                        "Unknown"}
                    </span>
                  </span>
                )} */}
              </div>
            </div>
            <Button onClick={handleDownloadPDF} variant='outline'>
              <Download className='mr-2 h-4 w-4' />
              Download as PDF
            </Button>
          </div>

          {/* Input Data */}
          <Card>
            <CardHeader>
              <CardTitle>Research Parameters</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h3 className='font-semibold mb-2'>Research Goal</h3>
                <p className='text-muted-foreground'>{simulation.input_data.goal}</p>
              </div>
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <h3 className='font-semibold mb-2'>Material Type</h3>
                  <p className='text-muted-foreground'>{simulation.input_data.materialType}</p>
                </div>
                <div>
                  <h3 className='font-semibold mb-2'>Composition</h3>
                  <p className='text-muted-foreground'>{simulation.input_data.composition}</p>
                </div>
              </div>
              <div>
                <h3 className='font-semibold mb-2'>Experimental Conditions</h3>
                <p className='text-muted-foreground'>{simulation.input_data.conditions}</p>
              </div>
            </CardContent>
          </Card>

          {/* AI Results */}
          <Card>
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
              <CardDescription>
                Confidence Score: {(simulation.ai_result.confidenceScore * 100).toFixed(0)}%
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <h3 className='font-semibold mb-2'>Process Summary</h3>
                <p className='text-muted-foreground whitespace-pre-line'>
                  {simulation.ai_result.processSummary}
                </p>
              </div>
              <div>
                <h3 className='font-semibold mb-2'>Recommended Method</h3>
                <p className='text-muted-foreground'>{simulation.ai_result.recommendedMethod}</p>
              </div>
            </CardContent>
          </Card>

          {/* Visualizations */}
          <div className='space-y-6'>
            {/* Efficiency vs Temperature */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5' />
                  Extraction Efficiency vs Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                {simulation.ai_result.temperatureData?.length > 0 ? (
                  <ResponsiveContainer width='100%' height={400}>
                    <LineChart
                      data={simulation.ai_result.temperatureData}
                      margin={{ bottom: 50, left: 20 }}
                    >
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

            {/* Material Properties Comparison */}
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

            {/* Confidence Score Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5' />
                  Simulation Confidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart
                    data={[
                      {
                        name: 'Confidence',
                        value: Math.round(simulation.ai_result.confidenceScore * 100)
                      }
                    ]}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis
                      domain={[0, 100]}
                      label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey='value'
                      fill={
                        simulation.ai_result.confidenceScore > 0.7
                          ? '#10b981'
                          : simulation.ai_result.confidenceScore > 0.5
                          ? '#f59e0b'
                          : '#ef4444'
                      }
                      name='Confidence Score (%)'
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className='mt-4 text-center'>
                  <p className='text-sm text-muted-foreground'>
                    Confidence Level: {Math.round(simulation.ai_result.confidenceScore * 100)}%
                  </p>
                  <div className='mt-2 w-full bg-gray-200 rounded-full h-2.5'>
                    <div
                      className={`h-2.5 rounded-full ${
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
