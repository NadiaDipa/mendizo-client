import { redirect } from "next/navigation";

/**
 * The profile UI already lives at /profile (Navbar + Footer layout).
 * This route keeps the dashboard navigation valid without duplicating it.
 */
export default function DashboardProfilePage() {
  redirect("/profile");
}
