
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function AccessDeniedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = session?.user.role;

  const dashboardLink =
    role === "customer"
      ? "/dashboard/customer"
      : role === "technician"
        ? "/dashboard/technician"
        : role === "admin"
          ? "/dashboard/admin"
          : "/";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EEFBFB] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mb-5 text-5xl">🔒</div>

        <p className="mb-2 text-sm font-semibold text-[#007CC7]">
          403 - FORBIDDEN
        </p>

        <h1 className="mb-3 text-2xl font-bold text-[#12232E]">
          Access Denied
        </h1>

        <p className="mb-7 text-gray-600">
          You don't have permission to access this page.
          Please visit your own dashboard.
        </p>

        <Link
          href={dashboardLink}
          className="inline-block rounded-lg bg-[#007CC7] px-6 py-3 font-semibold text-white transition hover:bg-[#12232E]"
        >
          Go to My Dashboard
        </Link>
      </div>
    </main>
  );
}
