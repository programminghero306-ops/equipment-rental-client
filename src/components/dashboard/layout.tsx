import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/DashboardShell";
import PrivateRoute from "@/components/PrivateRoute";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <DashboardShell>{children}</DashboardShell>
    </PrivateRoute>
  );
}