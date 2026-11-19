"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<string>("Checking server...");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch(() => setStatus("Could not reach server"));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Equipment Rental Platform</h1>
      <p>Server status: {status}</p>
      <button className="btn btn-primary">DaisyUI works</button>
    </main>
  );
}