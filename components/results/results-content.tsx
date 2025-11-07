'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { createClient } from '@/lib/supabase/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BarChart3, Download, Globe, Loader2, Lock } from 'lucide-react';
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
  is_public: boolean | null;
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
}

export function ResultsContent({ simulationId }: { simulationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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

  const temperatureData = simulation.ai_result.temperatureData || [];

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      <Navigation variant='back-to-dashboard' backUrl='/dashboard' backLabel='Back to Dashboard' />

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12' id='results-content'>
        <div className='max-w-5xl mx-auto space-y-6'>
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
              <Button onClick={handleDownloadPDF}>
                <Download className='mr-2 h-4 w-4' />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Input Data Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Input Parameters</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <strong>Goal:</strong> {simulation.input_data.goal}
              </div>
              <div>
                <strong>Material Type:</strong> {simulation.input_data.materialType}
              </div>
              <div>
                <strong>Composition:</strong> {simulation.input_data.composition}
              </div>
              <div>
                <strong>Conditions:</strong> {simulation.input_data.conditions}
              </div>
            </CardContent>
          </Card>

          {/* AI Report */}
          <Card>
            <CardHeader>
              <CardTitle>AI Simulation Report</CardTitle>
              <CardDescription>
                Confidence Score: {(simulation.ai_result.confidenceScore * 100).toFixed(1)}%
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
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

          {/* Visualizations */}
          <div className='full-w flex flex-col gap-6'>
            {/* Efficiency vs Temperature */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5' />
                  Extraction Efficiency vs Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                {temperatureData.length > 0 ? (
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

            {/* Confidence Score Visualization */}
            <Card className='lg:col-span-2'>
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
