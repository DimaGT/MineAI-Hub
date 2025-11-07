import { SimulationFormContent } from "@/components/simulate/simulation-form-content";
import { ProtectedRoute } from "@/components/protected-route";

export default function SimulatePage() {
  return (
    <ProtectedRoute>
      <SimulationFormContent />
    </ProtectedRoute>
  );
}

