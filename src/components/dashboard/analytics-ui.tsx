"use client";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { apiFetch } from "@/lib/api";

export const PALETTE = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-accent)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-error)",
];

export const tooltipStyle = {
  background: "var(--color-base-100)",
  border: "1px solid var(--color-base-300)",
  borderRadius: 12,
  color: "var(--color-base-content)",
};

export const axisTick = { fill: "var(--color-base-content)", fontSize: 12 };

export const cap = (text: string) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : text;

export function useAnalytics<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;
    apiFetch<T>(path)
      .then((json) => {
        if (!ignore) setData(json);
      })
      .catch(() => {
        if (!ignore) setError(true);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [path]);

  return { data, loading, error };
}

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: IconType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/15 text-xl text-primary">
        <Icon />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-base-content/60">{label}</p>
        <p className="truncate text-2xl font-extrabold">{value}</p>
      </div>
    </div>
  );
}

export function ChartCard({
  title,
  empty,
  children,
}: {
  title: string;
  empty?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
      <h3 className="mb-4 font-bold">{title}</h3>
      <div className="h-72 w-full">
        {empty ? (
          <div className="grid h-full place-items-center text-sm text-base-content/50">
            No data yet
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-24 w-full" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-80 w-full" />
        ))}
      </div>
    </div>
  );
}

export function OverviewError() {
  return (
    <div className="rounded-box border border-error/30 bg-error/10 p-8 text-center">
      <p className="font-semibold">Could not load the analytics.</p>
      <p className="mt-1 text-sm text-base-content/70">Please refresh the page.</p>
    </div>
  );
}
