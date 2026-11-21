"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function PrivateRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect AFTER we know for sure nobody is logged in
    if (!isPending && !session) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, session, pathname, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (roles && !roles.includes(session.user.role)) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <p className="text-6xl font-extrabold text-error">403</p>
        <h1 className="mt-4 text-3xl font-bold">Access denied</h1>
        <p className="mt-2 text-base-content/70">
          You do not have permission to view this page.
        </p>
        <Link href="/" className="btn btn-primary mt-6">
          Back to Home
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}