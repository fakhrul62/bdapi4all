import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { isAdminRequest } from "@/lib/admin-auth";

export default async function AdminPage() {
  return <AdminDashboard initialAuthenticated={await isAdminRequest()} />;
}
