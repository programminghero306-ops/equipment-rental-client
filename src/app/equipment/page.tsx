import { Suspense } from "react";
import type { Metadata } from "next";
import EquipmentExplorer from "@/components/EquipmentExplorer";

export const metadata: Metadata = {
  title: "All Equipment",
};

export default function EquipmentPage() {
  return (
    <>
      <section className="bg-secondary text-secondary-content">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            All Equipment
          </h1>
          <p className="mt-3 max-w-2xl text-secondary-content/80">
            Search, filter and compare equipment from verified owners, then
            rent what you need.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense
            fallback={<div className="skeleton h-64 w-full" />}
          >
            <EquipmentExplorer />
          </Suspense>
        </div>
      </section>
    </>
  );
}