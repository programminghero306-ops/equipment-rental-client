import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import SiteShell from "@/components/SiteShell";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

// Runs before the page paints, so a saved theme never flashes the wrong colors
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="rentdark"||t==="rentlight"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}`;

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
    <html lang="en" data-theme="rentlight" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${font.className} antialiased`}>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "12px",
              background: "var(--color-base-100)",
              color: "var(--color-base-content)",
              border: "1px solid var(--color-base-300)",
            },
          }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}