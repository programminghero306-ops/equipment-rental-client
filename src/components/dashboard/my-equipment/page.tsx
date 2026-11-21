"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import { apiFetch } from "@/lib/api";
import type { Equipment } from "@/lib/types";

const statusClass: Record<string, string> = {
  approved: "badge-success",
  pending: "badge-warning",
  rejected: "badge-error",
};

function MyEquipment() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;
    apiFetch<Equipment[]>("/equipment/mine")
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

  async function handleDelete(item: Equipment) {
    const result = await Swal.fire({
      title: "Delete this equipment?",
      text: `"${item.name}" will be removed permanently.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      confirmButtonColor: "#d33",
    });
    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/equipment/${item._id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i._id !== item._id));
      toast.success("Equipment deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete");
    }
  }

  if (loading) return <div className="skeleton h-72 w-full" />;

  if (error) {
    return (
      <div className="rounded-box border border-error/30 bg-error/10 p-8 text-center">
        <p className="font-semibold">Could not load your equipment.</p>
        <p className="mt-1 text-sm text-base-content/70">Please refresh the page.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-box border border-base-300 bg-base-100 p-12 text-center">
        <p className="text-xl font-bold">You have not added any equipment yet</p>
        <Link href="/dashboard/add-equipment" className="btn btn-primary mt-5">
          Add your first equipment
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
            <th>Rental price</th>
            <th>Available quantity</th>
            <th>Status</th>
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
              <td>
                ${item.price} / {item.rentalType.toLowerCase()}
              </td>
              <td>{item.quantity}</td>
              <td>
                <span className={`badge border-0 capitalize ${statusClass[item.status]}`}>
                  {item.status}
                </span>
              </td>
              <td>
                <div className="flex justify-end gap-2">
                  <Link href={`/equipment/${item._id}`} className="btn btn-ghost btn-xs">
                    View
                  </Link>
                  <Link
                    href={`/dashboard/my-equipment/${item._id}/edit`}
                    className="btn btn-outline btn-xs"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(item)}
                    className="btn btn-error btn-outline btn-xs"
                  >
                    Delete
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

export default function MyEquipmentPage() {
  return (
    <PrivateRoute roles={["owner"]}>
      <MyEquipment />
    </PrivateRoute>
  );
}