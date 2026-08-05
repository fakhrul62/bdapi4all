import { ApiKeysDashboard } from "@/components/developer/api-keys-dashboard";
import { isAdminRequest } from "@/lib/admin-auth";

export default async function DashboardPage() {
  return <ApiKeysDashboard initialAuthenticated={await isAdminRequest()} />;
}