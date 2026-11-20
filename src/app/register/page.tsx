"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const photo = String(formData.get("photo") || "").trim();
    const password = String(formData.get("password") || "");

    // Password rules from the assignment
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain an uppercase letter");
      return;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain a lowercase letter");
      return;
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      image: photo,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Registration failed");
      return;
    }

    toast.success("Registration successful!");
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-[75vh]flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <form onSubmit={handleSubmit} className="card-body gap-3">
          <h1 className="text-2xl font-bold text-center">Create your account</h1>

          <label className="form-control">
            <span className="label-text mb-1">Name</span>
            <input name="name" type="text" required placeholder="Your full name" className="input input-bordered w-full" />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Email</span>
            <input name="email" type="email" required placeholder="you@example.com" className="input input-bordered w-full" />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Photo URL</span>
            <input name="photo" type="url" required placeholder="https://example.com/photo.jpg" className="input input-bordered w-full" />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Password</span>
            <input name="password" type="password" required placeholder="Uppercase, lowercase, 6+ characters" className="input input-bordered w-full" />
          </label>

          <button type="submit" disabled={loading} className="btn btn-primary mt-2">
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary">Login</Link>
          </p>
        </form>
      </div>
    </main>
  );
}