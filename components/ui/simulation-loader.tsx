"use client";

import { useState, useEffect } from "react";
import { Brain, Database, Zap, CheckCircle2, Loader2, Settings, BarChart3, Sparkles } from "lucide-react";

interface SimulationStage {
  icon: React.ReactNode;
  message: string;
  description: string;
}

const stages: SimulationStage[] = [
  {
    icon: <Database className="h-5 w-5" />,
    message: "Collecting data...",
    description: "Analyzing your input parameters",
  },
  {
    icon: <Settings className="h-5 w-5" />,
    message: "Preprocessing...",
    description: "Validating and structuring input data",
  },
  {
    icon: <Brain className="h-5 w-5" />,
    message: "Processing with AI...",
    description: "GPT-4 is analyzing your simulation",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    message: "Generating insights...",
    description: "Creating technical recommendations",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    message: "Calculating predictions...",
    description: "Computing temperature and efficiency data",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    message: "Optimizing results...",
    description: "Fine-tuning simulation parameters",
  },
  {
    icon: <CheckCircle2 className="h-5 w-5" />,
    message: "Finalizing report...",
    description: "Compiling simulation results",
  },
];

export function SimulationLoader() {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through stages
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= stages.length - 1) {
          return prev; // Reset to start
        }
        return prev + 1;
      });
    }, 2200); // Change stage every 2.2 seconds

    // Simulate progress with realistic increments
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        // Faster progress in early stages, slower near end
        const increment = prev < 30 ? 2 + Math.random() * 2 : 0.5 + Math.random() * 1;
        return Math.min(prev + increment, 95);
      });
    }, 150);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const currentStageData = stages[currentStage];

  return (
    <div className="py-12 space-y-8">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Status Message */}
        <div className="text-center space-y-3 min-h-[100px]">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-foreground/60">
              {currentStageData.icon}
            </div>
            <h3 className="text-xl font-medium text-foreground transition-all duration-500">
              {currentStageData.message}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground transition-all duration-500">
            {currentStageData.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md space-y-2">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out bg-gray-600"
              style={{ width: `${Math.min(progress, 95)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">
              Stage {currentStage + 1} of {stages.length}
            </span>
            <span className="text-foreground font-medium">
              {Math.round(Math.min(progress, 95))}%
            </span>
          </div>
        </div>

        {/* Stage Indicators */}
        <div className="flex items-center gap-1.5 mt-6">
          {stages.map((stage, index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                index === currentStage
                  ? "bg-foreground scale-125"
                  : index < currentStage
                  ? "bg-foreground/40"
                  : "bg-gray-300"
              }`}
              title={stage.message}
            />
          ))}
        </div>

        {/* Status List */}
        <div className="w-full max-w-md space-y-2 mt-8">
          {stages.map((stage, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 text-sm transition-all duration-500 ${
                index === currentStage
                  ? "text-foreground font-medium"
                  : index < currentStage
                  ? "text-muted-foreground"
                  : "text-muted-foreground/50"
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                {index === currentStage ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : index < currentStage ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </div>
              <span>{stage.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
