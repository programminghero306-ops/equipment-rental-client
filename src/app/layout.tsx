import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import SiteShell from "@/components/SiteShell";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Equipment Rental Platform`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Rent construction, photography, vehicle, farming, electronics and event equipment from verified owners.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="rentlight">
      <body className={`${font.className} antialiased`}>
        <Toaster position="top-center" />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}