import { MySimulationsContent } from "@/components/my-simulations/my-simulations-content";
import { ProtectedRoute } from "@/components/protected-route";

export default function MySimulationsPage() {
  return (
    <ProtectedRoute>
      <MySimulationsContent />
    </ProtectedRoute>
  );
}
