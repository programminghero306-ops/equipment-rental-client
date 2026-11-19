"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Equipment Rental Platform</h1>

      {isPending ? (
        <p>Loading...</p>
      ) : session ? (
        <>
          <p>Logged in as: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
          <p>Role: {session.user.role}</p>
          <button className="btn btn-error" onClick={() => authClient.signOut()}>
            Logout
          </button>
        </>
      ) : (
        <div className="flex gap-3">
          <Link href="/login" className="btn btn-primary">Login</Link>
          <Link href="/register" className="btn btn-outline">Register</Link>
        </div>
      )}
    </main>
  );
}