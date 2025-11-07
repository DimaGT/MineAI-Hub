import { KnowledgeHubContent } from "@/components/knowledge/knowledge-hub-content";
import { ProtectedRoute } from "@/components/protected-route";

export default function KnowledgePage() {
  return (
    <ProtectedRoute>
      <KnowledgeHubContent />
    </ProtectedRoute>
  );
}
