"use client";
import Link from "next/link";
import AdminOverview from "@/components/dashboard/AdminOverview";
import { getMenu } from "@/components/dashboard/menu";
import OwnerOverview from "@/components/dashboard/OwnerOverview";
import { authClient } from "@/lib/auth-client";

export default function DashboardHome() {
  const { data: session } = authClient.useSession();
  if (!session) return null;

  const { name } = session.user;
  const role = session.user.role.toLowerCase().trim();
  const shortcuts = getMenu(role).filter((item) => item.href !== "/dashboard");

  return (
    <div className="space-y-6">
      <div className="rounded-box bg-secondary p-6 text-secondary-content sm:p-8">
        <span className="badge badge-primary mb-3 font-semibold capitalize">
          {role}
        </span>
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Welcome back, {name}
        </h2>
        <p className="mt-2 text-secondary-content/80">
          {role === "customer"
            ? "Use the shortcuts below or the sidebar to manage your rentals."
            : "Here is how things are going."}
        </p>
      </div>

      {role === "admin" && <AdminOverview />}
      {role === "owner" && <OwnerOverview />}

      {role === "customer" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shortcuts.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 rounded-box border border-base-300 bg-base-100 p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-md"
            >
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary/15 text-xl text-primary">
                <Icon />
              </span>
              <span className="font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}