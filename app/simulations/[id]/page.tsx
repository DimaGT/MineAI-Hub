import { PublicSimulationContent } from "@/components/simulations/public-simulation-content";
import { ProtectedRoute } from "@/components/protected-route";

export default function PublicSimulationPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <ProtectedRoute>
      <PublicSimulationContent simulationId={params.id} />
    </ProtectedRoute>
  );
}

