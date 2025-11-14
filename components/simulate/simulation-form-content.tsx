'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { SimulationLoader } from '@/components/ui/simulation-loader';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip } from '@/components/ui/tooltip';
import { createClient } from '@/lib/supabase/client';
import { ChevronDown, ChevronUp, FlaskConical, RotateCcw, Save, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Simulation templates/presets
const SIMULATION_TEMPLATES = [
  { value: '', label: 'Select Simulation Type...' },
  { value: 'chalcopyrite-acidic', label: 'Chalcopyrite Leaching — Acidic' },
  { value: 'chalcopyrite-ferric', label: 'Chalcopyrite Leaching — Ferric (Fe³⁺ Oxidative)' },
  { value: 'chalcopyrite-pressure-oxidation', label: 'Chalcopyrite Leaching — Pressure Oxidation' },
  { value: 'bornite-leach', label: 'Bornite Leach — Rapid Oxidation' },
  { value: 'pyrite-oxidation', label: 'Pyrite Oxidation Kinetics' },
  { value: 'mixed-sulfide-leach', label: 'Mixed Sulfide Leach' },
  { value: 'hvp-pretreatment-leach', label: 'HVP Pre-Treatment + Leach' },
  { value: 'heap-leach-copper', label: 'Heap Leach (Copper)' },
  { value: 'flotation-response', label: 'Flotation Response Simulation' },
  { value: 'ore-sorting', label: 'Ore Sorting & Mineral Upgrading' },
  { value: 'custom-process', label: 'Custom Process (Manual Inputs)' }
];

// Oxidant types
const OXIDANT_TYPES = [
  { value: '', label: 'Select oxidant...' },
  { value: 'none', label: 'None' },
  { value: 'o2', label: 'O₂' },
  { value: 'h2o2', label: 'H₂O₂' },
  { value: 'chloride', label: 'Chloride' },
  { value: 'nitrate', label: 'Nitrate' },
  { value: 'thiourea', label: 'Thiourea' }
];

// Leach medium types
const LEACH_MEDIUM_TYPES = [
  { value: '', label: 'Select leach medium...' },
  { value: 'sulfuric-acid', label: 'Sulfuric Acid' },
  { value: 'chloride-medium', label: 'Chloride Medium' },
  { value: 'ammoniacal', label: 'Ammoniacal' },
  { value: 'glycine', label: 'Glycine' },
  { value: 'other', label: 'Other' }
];

// Mineral types
const MINERAL_TYPES = [
  { value: '', label: 'Select mineral type...' },
  { value: 'chalcopyrite', label: 'Chalcopyrite' },
  { value: 'bornite', label: 'Bornite' },
  { value: 'pyrite', label: 'Pyrite' },
  { value: 'covellite', label: 'Covellite' },
  { value: 'enargite', label: 'Enargite' },
  { value: 'sphalerite', label: 'Sphalerite' },
  { value: 'galena', label: 'Galena' },
  { value: 'mixed-sulfides', label: 'Mixed Sulfides' }
];

// Industrial goals
const INDUSTRIAL_GOALS = [
  { value: '', label: 'Select primary objective...' },
  { value: 'recovery', label: 'Recovery Optimization' },
  { value: 'grade', label: 'Grade Improvement' },
  { value: 'kinetics', label: 'Kinetics Analysis' },
  { value: 'throughput', label: 'Throughput Maximization' },
  { value: 'reagent-savings', label: 'Reagent Savings' },
  { value: 'energy-savings', label: 'Energy Savings' },
  { value: 'liberation', label: 'Liberation Optimization' }
];

// Example simulation preview component
function ExampleSimulationPreview() {
  return (
    <Card className='mb-8 bg-gradient-to-br from-blue-50 to-green-50 border-blue-200'>
      <CardHeader>
        <CardTitle className='text-xl'>Example: Chalcopyrite Leach Simulation</CardTitle>
        <CardDescription>Preview of typical simulation outputs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div className='space-y-2'>
            <h4 className='font-semibold text-gray-700'>Recovery Curve</h4>
            <p className='text-gray-600'>Cu recovery: 85% at 24h, 92% at 48h, 95% at 72h</p>
          </div>
          <div className='space-y-2'>
            <h4 className='font-semibold text-gray-700'>Rate Constants</h4>
            <p className='text-gray-600'>k = 0.045 h⁻¹ (first-order kinetics)</p>
          </div>
          <div className='space-y-2'>
            <h4 className='font-semibold text-gray-700'>pH vs. Time</h4>
            <p className='text-gray-600'>Initial: 1.8 → Final: 1.5 (acid consumption)</p>
          </div>
          <div className='space-y-2'>
            <h4 className='font-semibold text-gray-700'>Fe³⁺ Regeneration</h4>
            <p className='text-gray-600'>Fe³⁺/Fe²⁺ ratio: 2.5 → 3.2 (oxidative efficiency)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SimulationFormContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showLeachChemistry, setShowLeachChemistry] = useState(false);
  const [showMineralogical, setShowMineralogical] = useState(false);
  const [showOperational, setShowOperational] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [savedTemplates, setSavedTemplates] = useState<
    Array<{ value: string; label: string; data: any }>
  >([]);

  const [formData, setFormData] = useState({
    title: '',
    template: '',
    goal: '',
    mineralType: '',
    // Leach Chemistry
    pH: '',
    eh: '',
    fe3Concentration: '',
    fe2Concentration: '',
    orp: '',
    acidConcentration: '',
    oxidantType: '',
    oxidantDosage: '',
    sulfateConcentration: '',
    // Mineralogical Inputs
    mineralComposition: '',
    chalcopyritePercent: '',
    pyritePercent: '',
    bornitePercent: '',
    alterationMinerals: '',
    gangueMatrix: '',
    // Operational Inputs
    residenceTime: '',
    grainSize: '',
    temperature: '',
    pulpDensity: '',
    particleSize: '',
    particleLiberation: '',
    agitationRate: '',
    pressure: '',
    reagentSchedule: '',
    // Energy Inputs (HVP)
    voltage: '',
    pulseFrequency: '',
    pulseEnergy: '',
    specificEnergy: '',
    hvpTargetedLiberation: '',
    fragmentationModel: '',
    // Environmental Inputs
    atmosphere: '',
    leachMedium: '',
    dissolvedOxygen: '',
    oxygenFlowRate: '',
    solidToLiquidRatio: '',
    oxidativePotential: '',
    redoxControl: '',
    particleLiberationIndex: '',
    // Advanced Parameters
    diffusionCoefficient: '',
    shrinkingCoreModel: '',
    rateConstantOverride: '',
    activationEnergy: '',
    reactionOrder: '',
    gangueAcidConsumption: '',
    ferricRegenerationEfficiency: '',
    surfacePassivation: '',
    particleShapeFactor: '',
    // Additional
    composition: '',
    constraints: ''
  });

  const supabase = createClient();

  // Load saved templates from localStorage on mount
  // useEffect(() => {
  //   const saved = localStorage.getItem('savedSimulationTemplates');
  //   if (saved) {
  //     try {
  //       const parsed = JSON.parse(saved);
  //       setSavedTemplates(parsed);
  //     } catch (error) {
  //       console.error('Error loading saved templates:', error);
  //     }
  //   }
  // }, []);

  // Get all available templates (built-in + saved)
  const getAllTemplates = () => {
    return [
      ...SIMULATION_TEMPLATES
      // ...savedTemplates.map(t => ({ value: t.value, label: `⭐ ${t.label}` }))
    ];
  };

  // Handle saving template
  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    const templateId = `custom-${Date.now()}`;
    const newTemplate = {
      value: templateId,
      label: templateName.trim(),
      data: { ...formData }
    };

    const updated = [...savedTemplates, newTemplate];
    setSavedTemplates(updated);
    localStorage.setItem('savedSimulationTemplates', JSON.stringify(updated));

    setShowSaveTemplateModal(false);
    setTemplateName('');
    toast.success('Template saved successfully!');
  };

  // Handle template selection
  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);

    // Reset form data first
    const resetData = {
      title: '',
      template: '',
      goal: '',
      mineralType: '',
      // Leach Chemistry
      pH: '',
      eh: '',
      fe3Concentration: '',
      fe2Concentration: '',
      orp: '',
      acidConcentration: '',
      oxidantType: '',
      oxidantDosage: '',
      sulfateConcentration: '',
      // Mineralogical Inputs
      mineralComposition: '',
      chalcopyritePercent: '',
      pyritePercent: '',
      bornitePercent: '',
      alterationMinerals: '',
      gangueMatrix: '',
      // Operational Inputs
      residenceTime: '',
      grainSize: '',
      temperature: '',
      pulpDensity: '',
      particleSize: '',
      particleLiberation: '',
      agitationRate: '',
      pressure: '',
      reagentSchedule: '',
      // Energy Inputs (HVP)
      voltage: '',
      pulseFrequency: '',
      pulseEnergy: '',
      specificEnergy: '',
      hvpTargetedLiberation: '',
      fragmentationModel: '',
      // Environmental Inputs
      atmosphere: '',
      leachMedium: '',
      dissolvedOxygen: '',
      oxygenFlowRate: '',
      solidToLiquidRatio: '',
      oxidativePotential: '',
      redoxControl: '',
      particleLiberationIndex: '',
      // Advanced Parameters
      diffusionCoefficient: '',
      shrinkingCoreModel: '',
      rateConstantOverride: '',
      activationEnergy: '',
      reactionOrder: '',
      gangueAcidConsumption: '',
      ferricRegenerationEfficiency: '',
      surfacePassivation: '',
      particleShapeFactor: '',
      // Additional
      composition: '',
      constraints: ''
    };

    // Pre-fill based on template
    if (template === 'chalcopyrite-acidic' || template === 'chalcopyrite-acidic-oxidative') {
      setFormData({
        ...resetData,
        template,
        mineralType: 'chalcopyrite',
        goal: 'recovery',
        pH: '1.5',
        eh: '550',
        temperature: '75',
        residenceTime: '24',
        pulpDensity: '20',
        acidConcentration: '50',
        fe3Concentration: '3.5',
        fe2Concentration: '1.2',
        oxidantDosage: '0.5',
        chalcopyritePercent: '45',
        pyritePercent: '25',
        particleSize: '150',
        atmosphere: 'oxidizing',
        oxygenFlowRate: '0.5'
      });
      setShowLeachChemistry(true);
      setShowMineralogical(true);
      setShowOperational(true);
    } else if (template === 'chalcopyrite-ferric') {
      setFormData({
        ...resetData,
        template,
        mineralType: 'chalcopyrite',
        goal: 'recovery',
        pH: '1.8',
        eh: '580',
        temperature: '85',
        residenceTime: '36',
        pulpDensity: '25',
        acidConcentration: '40',
        fe3Concentration: '5.0',
        fe2Concentration: '0.8',
        chalcopyritePercent: '50',
        pyritePercent: '20',
        particleSize: '120',
        redoxControl: 'Fe³⁺/Fe²⁺ ratio maintained at 6.25',
        atmosphere: 'oxidizing'
      });
      setShowLeachChemistry(true);
      setShowMineralogical(true);
      setShowOperational(true);
    } else if (template === 'hvp-liberation') {
      setFormData({
        ...resetData,
        template,
        goal: 'liberation',
        mineralType: 'chalcopyrite',
        voltage: '15',
        pulseFrequency: '100',
        pulseEnergy: '2.5',
        specificEnergy: '5.0',
        particleSize: '200',
        grainSize: '50',
        fragmentationModel: 'Weibull distribution',
        chalcopyritePercent: '40',
        particleLiberationIndex: '0.75'
      });
      setShowMineralogical(true);
      setShowOperational(true);
      setShowAdvanced(true);
    } else if (template === 'hvp-pretreatment-leach') {
      setFormData({
        ...resetData,
        template,
        mineralType: 'chalcopyrite',
        goal: 'recovery',
        voltage: '18',
        pulseFrequency: '120',
        pulseEnergy: '3.0',
        specificEnergy: '6.5',
        pH: '1.6',
        temperature: '70',
        residenceTime: '18',
        pulpDensity: '22',
        acidConcentration: '45',
        fe3Concentration: '3.0',
        chalcopyritePercent: '42',
        particleSize: '180',
        particleLiberation: '90',
        fragmentationModel: 'Log-normal distribution',
        atmosphere: 'oxidizing'
      });
      setShowLeachChemistry(true);
      setShowMineralogical(true);
      setShowOperational(true);
      setShowAdvanced(true);
    } else if (template === 'heap-leach-copper') {
      setFormData({
        ...resetData,
        template,
        mineralType: 'chalcopyrite',
        goal: 'recovery',
        pH: '2.0',
        temperature: '25',
        residenceTime: '720',
        acidConcentration: '30',
        chalcopyritePercent: '35',
        pyritePercent: '15',
        particleSize: '12.5',
        solidToLiquidRatio: '0.3',
        atmosphere: 'oxidizing',
        oxygenFlowRate: '0.2',
        reagentSchedule: 'Acid: 30 g/L initial, continuous addition at 0.5 g/L/day'
      });
      setShowLeachChemistry(true);
      setShowMineralogical(true);
      setShowOperational(true);
      setShowAdvanced(true);
    } else if (template === 'flotation-optimization') {
      setFormData({
        ...resetData,
        template,
        mineralType: 'mixed-sulfides',
        goal: 'grade',
        pH: '9.5',
        temperature: '25',
        pulpDensity: '30',
        particleSize: '75',
        chalcopyritePercent: '35',
        pyritePercent: '30',
        bornitePercent: '15',
        particleLiberation: '85',
        reagentSchedule: 'Collector: Xanthate 50 g/t, Frother: MIBC 20 g/t, pH modifier: Lime'
      });
      setShowLeachChemistry(true);
      setShowMineralogical(true);
      setShowOperational(true);
    } else if (template === 'ore-sorting') {
      setFormData({
        ...resetData,
        template,
        goal: 'grade',
        mineralType: 'chalcopyrite',
        chalcopyritePercent: '38',
        pyritePercent: '22',
        particleSize: '50',
        particleLiberation: '80',
        grainSize: '30',
        particleLiberationIndex: '0.80'
      });
      setShowMineralogical(true);
      setShowOperational(true);
    } else if (template === 'grain-size-reduction') {
      setFormData({
        ...resetData,
        template,
        goal: 'liberation',
        mineralType: 'chalcopyrite',
        particleSize: '300',
        grainSize: '80',
        chalcopyritePercent: '40',
        pyritePercent: '25',
        particleLiberation: '60',
        particleLiberationIndex: '0.60',
        specificEnergy: '12',
        fragmentationModel: 'Bond work index model'
      });
      setShowMineralogical(true);
      setShowOperational(true);
      setShowAdvanced(true);
    } else if (template.startsWith('custom-')) {
      // Load custom saved template
      const customTemplate = savedTemplates.find(t => t.value === template);
      if (customTemplate) {
        setFormData({ ...resetData, ...customTemplate.data });
        // Auto-expand sections based on filled data
        if (customTemplate.data.pH || customTemplate.data.acidConcentration) {
          setShowLeachChemistry(true);
        }
        if (customTemplate.data.chalcopyritePercent || customTemplate.data.pyritePercent) {
          setShowMineralogical(true);
        }
        if (customTemplate.data.temperature || customTemplate.data.residenceTime) {
          setShowOperational(true);
        }
        if (customTemplate.data.voltage || customTemplate.data.specificEnergy) {
          setShowAdvanced(true);
        }
      }
    } else {
      // Reset to empty if no template selected
      setFormData(resetData);
    }
  };

  // Reset form function
  const handleReset = () => {
    const resetData = {
      title: '',
      template: '',
      goal: '',
      mineralType: '',
      // Leach Chemistry
      pH: '',
      eh: '',
      fe3Concentration: '',
      fe2Concentration: '',
      orp: '',
      acidConcentration: '',
      oxidantType: '',
      oxidantDosage: '',
      sulfateConcentration: '',
      // Mineralogical Inputs
      mineralComposition: '',
      chalcopyritePercent: '',
      pyritePercent: '',
      bornitePercent: '',
      alterationMinerals: '',
      gangueMatrix: '',
      // Operational Inputs
      residenceTime: '',
      grainSize: '',
      temperature: '',
      pulpDensity: '',
      particleSize: '',
      particleLiberation: '',
      agitationRate: '',
      pressure: '',
      reagentSchedule: '',
      // Energy Inputs (HVP)
      voltage: '',
      pulseFrequency: '',
      pulseEnergy: '',
      specificEnergy: '',
      hvpTargetedLiberation: '',
      fragmentationModel: '',
      // Environmental Inputs
      atmosphere: '',
      leachMedium: '',
      dissolvedOxygen: '',
      oxygenFlowRate: '',
      solidToLiquidRatio: '',
      oxidativePotential: '',
      redoxControl: '',
      particleLiberationIndex: '',
      // Advanced Parameters
      diffusionCoefficient: '',
      shrinkingCoreModel: '',
      rateConstantOverride: '',
      activationEnergy: '',
      reactionOrder: '',
      gangueAcidConsumption: '',
      ferricRegenerationEfficiency: '',
      surfacePassivation: '',
      particleShapeFactor: '',
      // Additional
      composition: '',
      constraints: ''
    };
    setFormData(resetData);
    setSelectedTemplate('');
    setShowAdvanced(false);
    setShowLeachChemistry(false);
    setShowMineralogical(false);
    setShowOperational(false);
    toast.success('Form reset successfully');
  };

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
    <div className='min-h-screen bg-gradient-to-b from-[#f8fefa] to-white'>
      <Navigation />

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12 pt-24'>
        {/* Example Simulation Preview */}
        {loading ? null : (
          <div className='max-w-6xl mx-auto mb-8'>
            <ExampleSimulationPreview />
          </div>
        )}

        <Card className='max-w-6xl mx-auto'>
          {loading ? null : (
            <CardHeader>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1'>
                  <CardTitle className='flex items-center gap-2'>Run Simulation</CardTitle>
                  <CardDescription>
                    <p className='text-sm text-muted-foreground my-2'>
                      Configure your simulation parameters to generate comprehensive analysis
                      reports
                    </p>
                    <Link href='/examples' className='text-primary hover:underline text-sm'>
                      View example queries →
                    </Link>
                  </CardDescription>
                </div>
                <div className='flex gap-2 shrink-0'>
                  <Button type='button' variant='outline' onClick={handleReset} size='sm'>
                    <RotateCcw className='mr-2 h-4 w-4' />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
          )}
          <CardContent>
            {loading ? (
              <SimulationLoader />
            ) : (
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Template Selection */}
                <div className='space-y-2 md:w-1/2'>
                  <Label htmlFor='template'>Simulation Type</Label>
                  <Select
                    id='template'
                    value={selectedTemplate}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleTemplateChange(e.target.value)
                    }
                  >
                    {getAllTemplates().map(template => (
                      <option key={template.value} value={template.value}>
                        {template.label}
                      </option>
                    ))}
                  </Select>
                  <p className='text-xs text-muted-foreground'>
                    Select a pre-configured simulation type to auto-fill parameters
                  </p>
                </div>

                {/* Basic Parameters */}
                <div className='space-y-6 border-t pt-6'>
                  <h3 className='text-lg font-semibold text-gray-900'>Basic Parameters</h3>

                  <div className='space-y-2'>
                    <Label htmlFor='title'>Simulation Title</Label>
                    <Input
                      id='title'
                      placeholder='e.g., Chalcopyrite Acidic Leach Optimization'
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Give your simulation a descriptive name (optional)
                    </p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='goal' className='flex items-center gap-2'>
                        Primary Objective
                        <span className='text-xs text-muted-foreground font-normal'>
                          (Required)
                        </span>
                      </Label>
                      <Select
                        id='goal'
                        value={formData.goal}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setFormData({ ...formData, goal: e.target.value })
                        }
                        required
                      >
                        {INDUSTRIAL_GOALS.map(goal => (
                          <option key={goal.value} value={goal.value}>
                            {goal.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='mineralType' className='flex items-center gap-2'>
                        Mineral Type
                        <span className='text-xs text-muted-foreground font-normal'>
                          (Required)
                        </span>
                      </Label>
                      <Select
                        id='mineralType'
                        value={formData.mineralType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setFormData({ ...formData, mineralType: e.target.value })
                        }
                        required
                      >
                        {MINERAL_TYPES.map(mineral => (
                          <option key={mineral.value} value={mineral.value}>
                            {mineral.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Leach Chemistry Section */}
                <div className='border-t pt-6'>
                  <button
                    type='button'
                    onClick={() => setShowLeachChemistry(!showLeachChemistry)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100/50 shadow-sm hover:shadow-md hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-sm font-semibold text-gray-800 ${
                      showLeachChemistry ? 'rounded-t-lg rounded-b-none mb-0' : 'rounded-lg mb-4'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      <span>Leach Chemistry</span>
                    </div>
                    {showLeachChemistry ? (
                      <ChevronUp className='h-4 w-4 text-gray-600' />
                    ) : (
                      <ChevronDown className='h-4 w-4 text-gray-600' />
                    )}
                  </button>

                  {showLeachChemistry && (
                    <div className='space-y-6 bg-gray-50/50 p-4 rounded-b-lg border border-gray-200 border-t-0'>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='pH' className='flex items-center gap-2'>
                            <Tooltip text='pH level of the leach solution. Typical range for chalcopyrite: 1.5-2.5. pH affects dissolution kinetics & ferric regeneration'>
                              pH Setpoint
                            </Tooltip>
                            <span className='text-xs text-muted-foreground font-normal'>
                              (Required)
                            </span>
                          </Label>
                          <Input
                            id='pH'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 1.8'
                            value={formData.pH}
                            onChange={e => setFormData({ ...formData, pH: e.target.value })}
                            required
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='eh' className='flex items-center gap-2'>
                            <Tooltip text='Redox potential in millivolts. Measures oxidizing/reducing conditions. Typical range: 400-600 mV. Indicates oxidizing conditions; essential for sulphide leach'>
                              Redox Potential (Eh, mV)
                            </Tooltip>
                            <span className='text-xs text-muted-foreground font-normal'>
                              (Required)
                            </span>
                          </Label>
                          <Input
                            id='eh'
                            type='number'
                            placeholder='e.g., 530'
                            value={formData.eh}
                            onChange={e => setFormData({ ...formData, eh: e.target.value })}
                            required
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='orp' className='flex items-center gap-2'>
                            <Tooltip text='Oxidation-Reduction Potential. Similar to Eh but measured with different reference'>
                              ORP (mV)
                            </Tooltip>
                          </Label>
                          <Input
                            id='orp'
                            type='number'
                            placeholder='e.g., 520'
                            value={formData.orp}
                            onChange={e => setFormData({ ...formData, orp: e.target.value })}
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='fe3Concentration' className='flex items-center gap-2'>
                            <Tooltip text='Ferric iron concentration. Primary oxidant in many leaching systems. Controls oxidative dissolution of chalcopyrite'>
                              Ferric Iron (Fe³⁺) Concentration (g/L)
                            </Tooltip>
                            <span className='text-xs text-muted-foreground font-normal'>
                              (Required)
                            </span>
                          </Label>
                          <Input
                            id='fe3Concentration'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 5'
                            value={formData.fe3Concentration}
                            onChange={e =>
                              setFormData({ ...formData, fe3Concentration: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='fe2Concentration' className='flex items-center gap-2'>
                            <Tooltip text='Ferrous iron concentration. Reduced form of iron'>
                              Fe²⁺ Concentration (g/L)
                            </Tooltip>
                          </Label>
                          <Input
                            id='fe2Concentration'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 1.2'
                            value={formData.fe2Concentration}
                            onChange={e =>
                              setFormData({ ...formData, fe2Concentration: e.target.value })
                            }
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='acidConcentration' className='flex items-center gap-2'>
                            <Tooltip text='Acid concentration (typically H₂SO₄). Typical range: 20-100 g/L'>
                              Acid Concentration (g/L)
                            </Tooltip>
                            <span className='text-xs text-muted-foreground font-normal'>
                              (Required)
                            </span>
                          </Label>
                          <Input
                            id='acidConcentration'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 20'
                            value={formData.acidConcentration}
                            onChange={e =>
                              setFormData({ ...formData, acidConcentration: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='oxidantType' className='flex items-center gap-2'>
                            <Tooltip text='Type of oxidant/additive used in the leaching process'>
                              Oxidant / Additives
                            </Tooltip>
                          </Label>
                          <Select
                            id='oxidantType'
                            value={formData.oxidantType}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                              setFormData({ ...formData, oxidantType: e.target.value })
                            }
                          >
                            {OXIDANT_TYPES.map(oxidant => (
                              <option key={oxidant.value} value={oxidant.value}>
                                {oxidant.label}
                              </option>
                            ))}
                          </Select>
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='oxidantDosage' className='flex items-center gap-2'>
                            <Tooltip text='Additional oxidant dosage (e.g., H₂O₂, O₂, Cl₂)'>
                              Oxidant Dosage (g/L)
                            </Tooltip>
                          </Label>
                          <Input
                            id='oxidantDosage'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 0.5'
                            value={formData.oxidantDosage}
                            onChange={e =>
                              setFormData({ ...formData, oxidantDosage: e.target.value })
                            }
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='sulfateConcentration' className='flex items-center gap-2'>
                            <Tooltip text='Sulfate ion concentration in solution'>
                              Sulfate Concentration (g/L)
                            </Tooltip>
                          </Label>
                          <Input
                            id='sulfateConcentration'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 120'
                            value={formData.sulfateConcentration}
                            onChange={e =>
                              setFormData({ ...formData, sulfateConcentration: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mineralogical Inputs Section */}
                <div className='border-t pt-6'>
                  <button
                    type='button'
                    onClick={() => setShowMineralogical(!showMineralogical)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100/50 shadow-sm hover:shadow-md hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-sm font-semibold text-gray-800 ${
                      showMineralogical ? 'rounded-t-lg rounded-b-none mb-0' : 'rounded-lg mb-4'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      <span>Mineralogical Inputs</span>
                    </div>
                    {showMineralogical ? (
                      <ChevronUp className='h-4 w-4 text-gray-600' />
                    ) : (
                      <ChevronDown className='h-4 w-4 text-gray-600' />
                    )}
                  </button>

                  {showMineralogical && (
                    <div className='space-y-6 bg-gray-50/50 p-4 rounded-b-lg border border-gray-200 border-t-0'>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <div className='space-y-2 md:col-span-2 lg:col-span-3'>
                          <Label htmlFor='mineralComposition' className='flex items-center gap-2'>
                            Mineral Composition / Assay
                            <span className='text-xs text-muted-foreground font-normal'>
                              (Required)
                            </span>
                          </Label>
                          <Textarea
                            id='mineralComposition'
                            placeholder='e.g., Cu (as chalcopyrite): 1.2%, Fe: 28%, S: 32%, Gangue: Quartz 40%, Calcite 10%'
                            value={formData.mineralComposition}
                            onChange={e =>
                              setFormData({ ...formData, mineralComposition: e.target.value })
                            }
                            rows={2}
                            required
                          />
                          <p className='text-xs text-muted-foreground'>
                            Enter grade or mineral percentages
                          </p>
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='particleSize' className='flex items-center gap-2'>
                            <Tooltip text='Typical range 20–150 µm'>Particle Size (µm)</Tooltip>
                            <span className='text-xs text-muted-foreground font-normal'>
                              (Required)
                            </span>
                          </Label>
                          <Input
                            id='particleSize'
                            type='number'
                            step='1'
                            placeholder='e.g., 75'
                            value={formData.particleSize}
                            onChange={e =>
                              setFormData({ ...formData, particleSize: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='particleLiberation' className='flex items-center gap-2'>
                            <Tooltip text='% of mineral phase liberated at specified grind size'>
                              Liberation Index (%)
                            </Tooltip>
                          </Label>
                          <Input
                            id='particleLiberation'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 82'
                            value={formData.particleLiberation}
                            onChange={e =>
                              setFormData({ ...formData, particleLiberation: e.target.value })
                            }
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='chalcopyritePercent'>Chalcopyrite (%)</Label>
                          <Input
                            id='chalcopyritePercent'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 45.5'
                            value={formData.chalcopyritePercent}
                            onChange={e =>
                              setFormData({ ...formData, chalcopyritePercent: e.target.value })
                            }
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='pyritePercent'>Pyrite (%)</Label>
                          <Input
                            id='pyritePercent'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 25.0'
                            value={formData.pyritePercent}
                            onChange={e =>
                              setFormData({ ...formData, pyritePercent: e.target.value })
                            }
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='bornitePercent'>Bornite (%)</Label>
                          <Input
                            id='bornitePercent'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 5.0'
                            value={formData.bornitePercent}
                            onChange={e =>
                              setFormData({ ...formData, bornitePercent: e.target.value })
                            }
                          />
                        </div>

                        <div className='space-y-2 md:col-span-2'>
                          <Label htmlFor='alterationMinerals'>Alteration Minerals</Label>
                          <Input
                            id='alterationMinerals'
                            placeholder='e.g., Sericite, Chlorite, Kaolinite'
                            value={formData.alterationMinerals}
                            onChange={e =>
                              setFormData({ ...formData, alterationMinerals: e.target.value })
                            }
                          />
                        </div>

                        <div className='space-y-2 md:col-span-2'>
                          <Label htmlFor='gangueMatrix'>Gangue Matrix</Label>
                          <Input
                            id='gangueMatrix'
                            placeholder='e.g., Quartz, Feldspar, Silicates'
                            value={formData.gangueMatrix}
                            onChange={e =>
                              setFormData({ ...formData, gangueMatrix: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Operational Inputs Section */}
                <div className='border-t pt-6'>
                  <button
                    type='button'
                    onClick={() => setShowOperational(!showOperational)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100/50 shadow-sm hover:shadow-md hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-sm font-semibold text-gray-800 ${
                      showOperational ? 'rounded-t-lg rounded-b-none mb-0' : 'rounded-lg mb-4'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      <span>Operational Inputs</span>
                    </div>
                    {showOperational ? (
                      <ChevronUp className='h-4 w-4 text-gray-600' />
                    ) : (
                      <ChevronDown className='h-4 w-4 text-gray-600' />
                    )}
                  </button>

                  {showOperational && (
                    <div className='space-y-6 bg-gray-50/50 p-4 rounded-b-lg border border-gray-200 border-t-0'>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='temperature' className='flex items-center gap-2'>
                            <Tooltip text='Process temperature in Celsius. Typical range for chalcopyrite: 65-95°C'>
                              Temperature (°C)
                            </Tooltip>
                            <span className='text-xs text-muted-foreground font-normal'>
                              (Required)
                            </span>
                          </Label>
                          <Input
                            id='temperature'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 80'
                            value={formData.temperature}
                            onChange={e =>
                              setFormData({ ...formData, temperature: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='residenceTime' className='flex items-center gap-2'>
                            <Tooltip text='Time the ore spends in the leach reactor'>
                              Residence Time (hours)
                            </Tooltip>
                            <span className='text-xs text-muted-foreground font-normal'>
                              (Required)
                            </span>
                          </Label>
                          <Input
                            id='residenceTime'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 12'
                            value={formData.residenceTime}
                            onChange={e =>
                              setFormData({ ...formData, residenceTime: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='pulpDensity' className='flex items-center gap-2'>
                            <Tooltip text='Solid-to-liquid ratio. Typical range: 15-30%'>
                              Pulp Density (%)
                            </Tooltip>
                            <span className='text-xs text-muted-foreground font-normal'>
                              (Required)
                            </span>
                          </Label>
                          <Input
                            id='pulpDensity'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 20'
                            value={formData.pulpDensity}
                            onChange={e =>
                              setFormData({ ...formData, pulpDensity: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='agitationRate' className='flex items-center gap-2'>
                            <Tooltip text='Mixing/agitation rate in revolutions per minute'>
                              Agitation / Mixing Rate (rpm)
                            </Tooltip>
                          </Label>
                          <Input
                            id='agitationRate'
                            type='number'
                            step='1'
                            placeholder='e.g., 450'
                            value={formData.agitationRate}
                            onChange={e =>
                              setFormData({ ...formData, agitationRate: e.target.value })
                            }
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='pressure' className='flex items-center gap-2'>
                            <Tooltip text='Required for pressure oxidation processes'>
                              Pressure (atm)
                            </Tooltip>
                          </Label>
                          <Input
                            id='pressure'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 2'
                            value={formData.pressure}
                            onChange={e => setFormData({ ...formData, pressure: e.target.value })}
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='grainSize'>Grain Size (µm)</Label>
                          <Input
                            id='grainSize'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 50'
                            value={formData.grainSize}
                            onChange={e => setFormData({ ...formData, grainSize: e.target.value })}
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='particleLiberation'>Particle Liberation (%)</Label>
                          <Input
                            id='particleLiberation'
                            type='number'
                            step='0.1'
                            placeholder='e.g., 85'
                            value={formData.particleLiberation}
                            onChange={e =>
                              setFormData({ ...formData, particleLiberation: e.target.value })
                            }
                          />
                        </div>

                        <div className='space-y-2 md:col-span-2'>
                          <Label htmlFor='reagentSchedule'>Reagent Addition Schedule</Label>
                          <Textarea
                            id='reagentSchedule'
                            placeholder='e.g., Acid: 50 g/L at t=0, Fe³⁺: 3 g/L at t=0, O₂: continuous at 0.5 L/min'
                            value={formData.reagentSchedule}
                            onChange={e =>
                              setFormData({ ...formData, reagentSchedule: e.target.value })
                            }
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Energy Inputs Section (HVP) */}
                <div className='border-t pt-6'>
                  <button
                    type='button'
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100/50 shadow-sm hover:shadow-md hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-sm font-semibold text-gray-800 ${
                      showAdvanced ? 'rounded-t-lg rounded-b-none mb-0' : 'rounded-lg mb-4'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      <Zap className='h-4 w-4 text-green-600' />
                      <span>Energy Inputs (HVP) & Advanced Parameters</span>
                    </div>
                    {showAdvanced ? (
                      <ChevronUp className='h-4 w-4 text-gray-600' />
                    ) : (
                      <ChevronDown className='h-4 w-4 text-gray-600' />
                    )}
                  </button>

                  {showAdvanced && (
                    <div className='bg-gray-50/50 p-4 rounded-b-lg border border-gray-200 border-t-0 space-y-6'>
                      <div>
                        <h4 className='font-semibold text-gray-900 mb-4'>HVP Parameters</h4>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='pulseEnergy' className='flex items-center gap-2'>
                              <Tooltip text='Pulse energy per ton of ore'>
                                Pulse Energy (kWh/t)
                              </Tooltip>
                            </Label>
                            <Input
                              id='pulseEnergy'
                              type='number'
                              step='0.1'
                              placeholder='e.g., 0.6'
                              value={formData.pulseEnergy}
                              onChange={e =>
                                setFormData({ ...formData, pulseEnergy: e.target.value })
                              }
                            />
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor='voltage' className='flex items-center gap-2'>
                              <Tooltip text='Voltage applied in kilovolts'>Voltage (kV)</Tooltip>
                            </Label>
                            <Input
                              id='voltage'
                              type='number'
                              step='0.1'
                              placeholder='e.g., 150'
                              value={formData.voltage}
                              onChange={e => setFormData({ ...formData, voltage: e.target.value })}
                            />
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor='pulseFrequency' className='flex items-center gap-2'>
                              <Tooltip text='Pulse frequency in hertz'>
                                Pulse Frequency (Hz)
                              </Tooltip>
                            </Label>
                            <Input
                              id='pulseFrequency'
                              type='number'
                              step='1'
                              placeholder='e.g., 10'
                              value={formData.pulseFrequency}
                              onChange={e =>
                                setFormData({ ...formData, pulseFrequency: e.target.value })
                              }
                            />
                          </div>

                          <div className='space-y-2'>
                            <Label
                              htmlFor='hvpTargetedLiberation'
                              className='flex items-center gap-2'
                            >
                              <Tooltip text='Target liberation percentage after HVP treatment'>
                                Targeted Liberation % after HVP
                              </Tooltip>
                            </Label>
                            <Input
                              id='hvpTargetedLiberation'
                              type='number'
                              step='0.1'
                              placeholder='e.g., 95'
                              value={formData.hvpTargetedLiberation}
                              onChange={e =>
                                setFormData({ ...formData, hvpTargetedLiberation: e.target.value })
                              }
                            />
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor='specificEnergy' className='flex items-center gap-2'>
                              <Tooltip text='Energy consumption per ton of ore processed'>
                                Specific Energy (kWh/t)
                              </Tooltip>
                            </Label>
                            <Input
                              id='specificEnergy'
                              type='number'
                              step='0.1'
                              placeholder='e.g., 5.0'
                              value={formData.specificEnergy}
                              onChange={e =>
                                setFormData({ ...formData, specificEnergy: e.target.value })
                              }
                            />
                          </div>

                          <div className='space-y-2 md:col-span-2'>
                            <Label htmlFor='fragmentationModel'>Fragmentation Model</Label>
                            <Input
                              id='fragmentationModel'
                              placeholder='e.g., Weibull distribution, log-normal'
                              value={formData.fragmentationModel}
                              onChange={e =>
                                setFormData({ ...formData, fragmentationModel: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className='font-semibold text-gray-900 mb-4'>Environmental Inputs</h4>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='atmosphere' className='flex items-center gap-2'>
                              Atmosphere
                              <span className='text-xs text-muted-foreground font-normal'>
                                (Required)
                              </span>
                            </Label>
                            <Select
                              id='atmosphere'
                              value={formData.atmosphere}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setFormData({ ...formData, atmosphere: e.target.value })
                              }
                              required
                            >
                              <option value=''>Select atmosphere...</option>
                              <option value='air'>Air</option>
                              <option value='oxygen-enriched'>Oxygen-Enriched</option>
                              <option value='nitrogen'>Nitrogen</option>
                              <option value='inert'>Inert</option>
                            </Select>
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor='leachMedium' className='flex items-center gap-2'>
                              Leach Medium
                              <span className='text-xs text-muted-foreground font-normal'>
                                (Required)
                              </span>
                            </Label>
                            <Select
                              id='leachMedium'
                              value={formData.leachMedium}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setFormData({ ...formData, leachMedium: e.target.value })
                              }
                              required
                            >
                              {LEACH_MEDIUM_TYPES.map(medium => (
                                <option key={medium.value} value={medium.value}>
                                  {medium.label}
                                </option>
                              ))}
                            </Select>
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor='dissolvedOxygen' className='flex items-center gap-2'>
                              <Tooltip text='Dissolved oxygen concentration in the leach solution'>
                                Dissolved Oxygen (mg/L)
                              </Tooltip>
                            </Label>
                            <Input
                              id='dissolvedOxygen'
                              type='number'
                              step='0.1'
                              placeholder='e.g., 8'
                              value={formData.dissolvedOxygen}
                              onChange={e =>
                                setFormData({ ...formData, dissolvedOxygen: e.target.value })
                              }
                            />
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor='oxygenFlowRate' className='flex items-center gap-2'>
                              <Tooltip text='Oxygen flow rate for oxidative leaching'>
                                Oxygen Flow Rate (L/min)
                              </Tooltip>
                            </Label>
                            <Input
                              id='oxygenFlowRate'
                              type='number'
                              step='0.1'
                              placeholder='e.g., 0.5'
                              value={formData.oxygenFlowRate}
                              onChange={e =>
                                setFormData({ ...formData, oxygenFlowRate: e.target.value })
                              }
                            />
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor='solidToLiquidRatio' className='flex items-center gap-2'>
                              <Tooltip text='Ratio of solid ore to liquid solution'>
                                Solid-to-Liquid Ratio
                              </Tooltip>
                            </Label>
                            <Input
                              id='solidToLiquidRatio'
                              type='number'
                              step='0.1'
                              placeholder='e.g., 0.25'
                              value={formData.solidToLiquidRatio}
                              onChange={e =>
                                setFormData({ ...formData, solidToLiquidRatio: e.target.value })
                              }
                            />
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor='oxidativePotential'>Oxidative Potential</Label>
                            <Input
                              id='oxidativePotential'
                              type='number'
                              step='0.1'
                              placeholder='e.g., 550'
                              value={formData.oxidativePotential}
                              onChange={e =>
                                setFormData({ ...formData, oxidativePotential: e.target.value })
                              }
                            />
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor='redoxControl'>Redox Control</Label>
                            <Input
                              id='redoxControl'
                              placeholder='e.g., Fe³⁺/Fe²⁺ ratio maintained at 2.5'
                              value={formData.redoxControl}
                              onChange={e =>
                                setFormData({ ...formData, redoxControl: e.target.value })
                              }
                            />
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor='particleLiberationIndex'>
                              Particle Liberation Index
                            </Label>
                            <Input
                              id='particleLiberationIndex'
                              type='number'
                              step='0.01'
                              placeholder='e.g., 0.85'
                              value={formData.particleLiberationIndex}
                              onChange={e =>
                                setFormData({
                                  ...formData,
                                  particleLiberationIndex: e.target.value
                                })
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <h4 className='font-semibold text-gray-900 mb-4'>Advanced Parameters</h4>
                          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            <div className='space-y-2'>
                              <Label htmlFor='diffusionCoefficient'>
                                Diffusion Coefficient Adjustments
                              </Label>
                              <Input
                                id='diffusionCoefficient'
                                type='number'
                                step='0.0001'
                                placeholder='e.g., 0.0015'
                                value={formData.diffusionCoefficient}
                                onChange={e =>
                                  setFormData({ ...formData, diffusionCoefficient: e.target.value })
                                }
                              />
                            </div>

                            <div className='space-y-2'>
                              <Label htmlFor='shrinkingCoreModel'>
                                Shrinking Core Model Selection
                              </Label>
                              <Input
                                id='shrinkingCoreModel'
                                placeholder='e.g., Chemical reaction control, Diffusion control'
                                value={formData.shrinkingCoreModel}
                                onChange={e =>
                                  setFormData({ ...formData, shrinkingCoreModel: e.target.value })
                                }
                              />
                            </div>

                            <div className='space-y-2'>
                              <Label htmlFor='rateConstantOverride'>
                                Rate Constant (k) Override
                              </Label>
                              <Input
                                id='rateConstantOverride'
                                type='number'
                                step='0.0001'
                                placeholder='e.g., 0.045'
                                value={formData.rateConstantOverride}
                                onChange={e =>
                                  setFormData({ ...formData, rateConstantOverride: e.target.value })
                                }
                              />
                            </div>

                            <div className='space-y-2'>
                              <Label htmlFor='activationEnergy'>
                                Activation Energy Estimates (kJ/mol)
                              </Label>
                              <Input
                                id='activationEnergy'
                                type='number'
                                step='0.1'
                                placeholder='e.g., 65'
                                value={formData.activationEnergy}
                                onChange={e =>
                                  setFormData({ ...formData, activationEnergy: e.target.value })
                                }
                              />
                            </div>

                            <div className='space-y-2'>
                              <Label htmlFor='reactionOrder'>Reaction Order Assumptions</Label>
                              <Input
                                id='reactionOrder'
                                type='number'
                                step='0.1'
                                placeholder='e.g., 1.0'
                                value={formData.reactionOrder}
                                onChange={e =>
                                  setFormData({ ...formData, reactionOrder: e.target.value })
                                }
                              />
                            </div>

                            <div className='space-y-2'>
                              <Label htmlFor='gangueAcidConsumption'>
                                Gangue Acid Consumption (GAC) (kg/t)
                              </Label>
                              <Input
                                id='gangueAcidConsumption'
                                type='number'
                                step='0.1'
                                placeholder='e.g., 15.5'
                                value={formData.gangueAcidConsumption}
                                onChange={e =>
                                  setFormData({
                                    ...formData,
                                    gangueAcidConsumption: e.target.value
                                  })
                                }
                              />
                            </div>

                            <div className='space-y-2'>
                              <Label htmlFor='ferricRegenerationEfficiency'>
                                Ferric Regeneration Efficiency (%)
                              </Label>
                              <Input
                                id='ferricRegenerationEfficiency'
                                type='number'
                                step='0.1'
                                placeholder='e.g., 85'
                                value={formData.ferricRegenerationEfficiency}
                                onChange={e =>
                                  setFormData({
                                    ...formData,
                                    ferricRegenerationEfficiency: e.target.value
                                  })
                                }
                              />
                            </div>

                            <div className='space-y-2'>
                              <Label htmlFor='surfacePassivation'>
                                Surface Passivation Modelling
                              </Label>
                              <Input
                                id='surfacePassivation'
                                placeholder='e.g., Elemental sulfur layer, Jarosite formation'
                                value={formData.surfacePassivation}
                                onChange={e =>
                                  setFormData({ ...formData, surfacePassivation: e.target.value })
                                }
                              />
                            </div>

                            <div className='space-y-2'>
                              <Label htmlFor='particleShapeFactor'>Particle Shape Factor</Label>
                              <Input
                                id='particleShapeFactor'
                                type='number'
                                step='0.01'
                                placeholder='e.g., 0.8'
                                value={formData.particleShapeFactor}
                                onChange={e =>
                                  setFormData({ ...formData, particleShapeFactor: e.target.value })
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='composition'>Additional Composition Details</Label>
                          <Textarea
                            id='composition'
                            placeholder='Additional mineralogical or chemical composition details...'
                            value={formData.composition}
                            onChange={e =>
                              setFormData({ ...formData, composition: e.target.value })
                            }
                            rows={2}
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='constraints'>Constraints & Limitations</Label>
                          <Textarea
                            id='constraints'
                            placeholder='e.g., Budget constraints, time limitations, equipment capacity...'
                            value={formData.constraints}
                            onChange={e =>
                              setFormData({ ...formData, constraints: e.target.value })
                            }
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className='flex gap-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleReset}
                    className='flex-1'
                    size='lg'
                  >
                    <RotateCcw className='mr-2 h-5 w-5' />
                    Reset Form
                  </Button>
                  <Button type='submit' className='flex-1' size='lg'>
                    <FlaskConical className='mr-2 h-5 w-5' />
                    Run Simulation
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Template Modal */}
      {showSaveTemplateModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <Card className='w-full max-w-md'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Save as Template</CardTitle>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    setShowSaveTemplateModal(false);
                    setTemplateName('');
                  }}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
              <CardDescription>
                Save your current simulation parameters as a reusable template
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='templateName'>Template Name</Label>
                <Input
                  id='templateName'
                  placeholder='e.g., My Custom Leach Process'
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSaveTemplate();
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className='flex gap-2 justify-end'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setShowSaveTemplateModal(false);
                    setTemplateName('');
                  }}
                >
                  Cancel
                </Button>
                <Button type='button' onClick={handleSaveTemplate}>
                  <Save className='mr-2 h-4 w-4' />
                  Save Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
