"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaMagnifyingGlass } from "react-icons/fa6";
import EquipmentCard from "@/components/EquipmentCard";
import type { Equipment } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PER_PAGE = 9;

const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

type Result = {
  items: Equipment[];
  total: number;
  page: number;
  totalPages: number;
};

export default function EquipmentExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Ask the server whenever the filters in the URL change
  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams(query);
    params.set("limit", String(PER_PAGE));

    setLoading(true);
    setError(false);

    fetch(`${API_URL}/equipment?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((json: Result) => {
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
  }, [query]);

  // Put the chosen filters into the URL (empty values are removed)
  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    // Any filter change goes back to page 1
    if (!("page" in updates)) params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (key: string) => String(fd.get(key) || "").trim();
    updateParams({
      search: get("search"),
      category: get("category"),
      rentalType: get("rentalType"),
      availability: get("availability"),
      minPrice: get("minPrice"),
      maxPrice: get("maxPrice"),
      sort: get("sort"),
    });
  }

  function goToPage(page: number) {
    updateParams({ page: String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Selects apply immediately, using everything currently in the form
  const applyNow = (e: React.ChangeEvent<HTMLSelectElement>) =>
    e.currentTarget.form?.requestSubmit();

  // Page numbers to show (a window of up to 5)
  const totalPages = data?.totalPages ?? 0;
  const current = data?.page ?? 1;
  let start = Math.max(1, current - 2);
  const end = Math.min(totalPages, start + 4);
  start = Math.max(1, end - 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="space-y-8">
      {/* ---------- Filters ---------- */}
      <form
        key={query}
        onSubmit={handleSubmit}
        className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="form-control sm:col-span-2">
            <span className="label-text mb-1">Search</span>
            <input
              name="search"
              type="text"
              defaultValue={searchParams.get("search") || ""}
              placeholder="Name, location or category"
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Category</span>
            <select
              name="category"
              defaultValue={searchParams.get("category") || ""}
              onChange={applyNow}
              className="select select-bordered w-full"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Rental type</span>
            <select
              name="rentalType"
              defaultValue={searchParams.get("rentalType") || ""}
              onChange={applyNow}
              className="select select-bordered w-full"
            >
              <option value="">Any</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Availability</span>
            <select
              name="availability"
              defaultValue={searchParams.get("availability") || ""}
              onChange={applyNow}
              className="select select-bordered w-full"
            >
              <option value="">Any</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Min price ($)</span>
            <input
              name="minPrice"
              type="number"
              min="0"
              defaultValue={searchParams.get("minPrice") || ""}
              placeholder="0"
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Max price ($)</span>
            <input
              name="maxPrice"
              type="number"
              min="0"
              defaultValue={searchParams.get("maxPrice") || ""}
              placeholder="Any"
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Sort by</span>
            <select
              name="sort"
              defaultValue={searchParams.get("sort") || "newest"}
              onChange={applyNow}
              className="select select-bordered w-full"
            >
              <option value="newest">Recently added</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" className="btn btn-primary">
            <FaMagnifyingGlass /> Apply filters
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => router.push(pathname, { scroll: false })}
          >
            Reset
          </button>
        </div>
      </form>

      {/* ---------- Results ---------- */}
      {error ? (
        <div className="rounded-box border border-error/30 bg-error/10 p-8 text-center">
          <p className="font-semibold">Could not load equipment.</p>
          <p className="mt-1 text-sm text-base-content/70">
            Please check your connection and try again.
          </p>
          <button
            className="btn btn-primary btn-sm mt-4"
            onClick={() => router.refresh()}
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-96 w-full" />
          ))}
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <p className="text-sm text-base-content/70">
            Showing <strong>{data.items.length}</strong> of{" "}
            <strong>{data.total}</strong> items
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <div className="join">
                <button
                  className="btn join-item btn-sm"
                  disabled={current <= 1}
                  onClick={() => goToPage(current - 1)}
                >
                  « Prev
                </button>
                {pages.map((p) => (
                  <button
                    key={p}
                    className={`btn join-item btn-sm ${
                      p === current ? "btn-primary" : ""
                    }`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="btn join-item btn-sm"
                  disabled={current >= totalPages}
                  onClick={() => goToPage(current + 1)}
                >
                  Next »
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-box border border-base-300 bg-base-100 p-12 text-center">
          <p className="text-xl font-bold">No equipment found</p>
          <p className="mt-2 text-base-content/70">
            Try changing or resetting your filters.
          </p>
          <button
            className="btn btn-primary mt-5"
            onClick={() => router.push(pathname, { scroll: false })}
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}