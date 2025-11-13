"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Features adapted for GeoSim
const FEATURES = [
  {
    title: "Model Extraction Kinetics",
    description: "Simulate pH, redox, oxidative reactions, temperature effects, Fe³⁺ regeneration, and chalcopyrite behavior.",
    features: [
      "pH simulation and analysis",
      "Redox reaction modeling",
      "Temperature effect analysis",
    ],
    buttonText: "Launch Demo Simulation",
    link: "/simulate",
  },
  {
    title: "Visualize Geological & Metallurgical Outputs",
    description: "View 2D/3D reaction progress, mineral breakdown, particle liberation, and predictive metallurgical recovery.",
    features: [
      "2D/3D reaction progress visualization",
      "Mineral breakdown analysis",
      "Predictive metallurgical recovery",
    ],
    buttonText: "Explore Prototype",
    link: "/simulate",
  },
  {
    title: "Optimize Refinement Pathways",
    description: "Run scenario analyses for HVP liberation, leach efficiency, reagent consumption, and energy curves.",
    features: [
      "HVP liberation analysis",
      "Leach efficiency optimization",
      "Energy curve analysis",
    ],
    buttonText: "Preview Workflow",
    link: "/simulate",
  },
];

const FeaturesCard: React.FC = ({}) => {
  let [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full")}>
      {FEATURES.map((feature, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full "
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-muted/[0.8] -z-[1] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card
            key={feature.title}
            className={cn("w-full flex flex-col justify-between z-30", {
              "border border-primary": idx === 1,
            })}
          >
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {feature.features.map((featureItem) => (
                  <div key={featureItem} className="flex gap-2 items-center">
                    <CheckCircle2
                      aria-hidden
                      className="text-emerald-500 h-5 w-5"
                    />
                    <p>{featureItem}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <Link
                href={feature.link}
                className={cn(
                  "w-full",
                  "hover:opacity-90 transition-opacity duration-300",
                  buttonVariants({
                    variant: "default",
                  }),
                  idx === 0
                    ? "bg-gradient-to-r from-secondary-foreground to-primary text-white"
                    : idx === 1
                      ? "bg-primary text-white"
                      : "bg-gradient-to-r from-primary to-secondary-foreground text-white"
                )}
              >
                {feature.buttonText}
              </Link>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default FeaturesCard;

