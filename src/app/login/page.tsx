"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Login failed");
      return;
    }

    toast.success("Login successful!");
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <form onSubmit={handleSubmit} className="card-body gap-3">
          <h1 className="text-2xl font-bold text-center">Welcome back</h1>

          <label className="form-control">
            <span className="label-text mb-1">Email</span>
            <input name="email" type="email" required placeholder="you@example.com" className="input input-bordered w-full" />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Password</span>
            <input name="password" type="password" required placeholder="Your password" className="input input-bordered w-full" />
          </label>

          <button type="submit" disabled={loading} className="btn btn-primary mt-2">
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center">
            New here?{" "}
            <Link href="/register" className="link link-primary">Register</Link>
          </p>
        </form>
      </div>
    </main>
  );
}