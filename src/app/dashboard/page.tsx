import { currentUser } from "@clerk/nextjs/server";
import CreatorDashboard from "@/components/CreatorDashboard";
import BrandDashboard from "@/components/BrandDashboard";

export default async function Dashboard() {
  const user = await currentUser();
  const role = user?.publicMetadata?.role;
  if (role === "BRAND") return <BrandDashboard />;
  return <CreatorDashboard />;
}
