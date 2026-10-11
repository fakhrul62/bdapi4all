import { ApiKeysDashboard } from "@/components/developer/api-keys-dashboard";
import { isAdminRequest } from "@/lib/admin-auth";

export const metadata = { title: "API Keys" };

export default async function DashboardPage() {
  return <div><ApiKeysDashboard initialAuthenticated={await isAdminRequest()} /></div>;
}
