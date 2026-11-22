"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import { apiFetch } from "@/lib/api";
import type { Equipment } from "@/lib/types";

function Favorites() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;
    apiFetch<Equipment[]>("/favorites")
      .then((data) => {
        if (!ignore) setItems(data);
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
  }, []);

  async function handleRemove(item: Equipment) {
    try {
      await apiFetch(`/favorites/${item._id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i._id !== item._id));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove");
    }
  }

  if (loading) return <div className="skeleton h-72 w-full" />;

  if (error) {
    return (
      <div className="rounded-box border border-error/30 bg-error/10 p-8 text-center">
        <p className="font-semibold">Could not load your favorites.</p>
        <p className="mt-1 text-sm text-base-content/70">Please refresh the page.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-box border border-base-300 bg-base-100 p-12 text-center">
        <p className="text-xl font-bold">You have no favorites yet</p>
        <p className="mt-2 text-base-content/70">
          Tap Add to Favorites on any equipment page to save it here.
        </p>
        <Link href="/equipment" className="btn btn-primary mt-5">
          Browse equipment
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
      <table className="table">
        <thead>
          <tr>
            <th>Equipment</th>
            <th>Category</th>
            <th>Location</th>
            <th>Rental price</th>
            <th>Availability</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-16 rounded-lg object-cover"
                  />
                  <span className="font-semibold">{item.name}</span>
                </div>
              </td>
              <td>{item.category}</td>
              <td>{item.location}</td>
              <td>
                ${item.price} / {item.rentalType.toLowerCase()}
              </td>
              <td>
                <span
                  className={`badge border-0 ${
                    item.quantity > 0 ? "badge-success" : "badge-error"
                  }`}
                >
                  {item.quantity > 0 ? "Available" : "Unavailable"}
                </span>
              </td>
              <td>
                <div className="flex justify-end gap-2">
                  <Link href={`/equipment/${item._id}`} className="btn btn-primary btn-xs">
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemove(item)}
                    className="btn btn-error btn-outline btn-xs"
                  >
                    Remove Favorite
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <PrivateRoute roles={["customer"]}>
      <Favorites />
    </PrivateRoute>
  );
}