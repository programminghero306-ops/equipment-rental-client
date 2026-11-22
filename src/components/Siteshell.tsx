"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Navbar from "./Navbar";
import ScrollToTop from "./ScrollToTop";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Dashboards have their own full-width layout, so no site navbar or footer
  if (pathname.startsWith("/dashboard")) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}