"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-extrabold text-error">Oops!</p>
      <h1 className="mt-4 text-3xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-base-content/70">
        An unexpected error happened. Please try again.
      </p>
      <button onClick={reset} className="btn btn-primary mt-6">
        Try again
      </button>
    </section>
  );
}