import { ResultsContent } from "@/components/results/results-content";
import { ProtectedRoute } from "@/components/protected-route";

export default function ResultsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <ProtectedRoute>
      <ResultsContent simulationId={params.id} />
    </ProtectedRoute>
  );
}
