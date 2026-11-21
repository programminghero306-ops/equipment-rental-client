"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import { apiFetch } from "@/lib/api";
import type { Equipment } from "@/lib/types";

type Status = Equipment["status"];
const TABS = ["all", "pending", "approved", "rejected"] as const;
type Tab = (typeof TABS)[number];

const statusClass: Record<Status, string> = {
  approved: "badge-success",
  pending: "badge-warning",
  rejected: "badge-error",
};

function AllEquipment() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<Tab>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    apiFetch<Equipment[]>("/equipment/admin/all")
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

  async function changeStatus(item: Equipment, status: Status) {
    setBusyId(item._id);
    try {
      await apiFetch(`/equipment/${item._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, status } : i))
      );
      toast.success(`Equipment ${status}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update status");
    } finally {
      setBusyId(null);
    }
  }

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
        <p className="font-semibold">Could not load equipment.</p>
        <p className="mt-1 text-sm text-base-content/70">Please refresh the page.</p>
      </div>
    );
  }

  const count = (t: Tab) =>
    t === "all" ? items.length : items.filter((i) => i.status === t).length;
  const visible = tab === "all" ? items : items.filter((i) => i.status === tab);

  return (
    <div className="space-y-5">
      <div className="tabs tabs-box w-fit max-w-full overflow-x-auto bg-base-100">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tab capitalize ${tab === t ? "tab-active" : ""}`}
          >
            {t} ({count(t)})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-box border border-base-300 bg-base-100 p-12 text-center">
          <p className="text-xl font-bold">No equipment in this list</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
          <table className="table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Owner</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
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
                  <td>
                    <p className="font-medium">{item.ownerName}</p>
                    <p className="text-xs text-base-content/60">{item.ownerEmail}</p>
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
                    <div className="flex flex-wrap justify-end gap-1">
                      <button
                        className="btn btn-success btn-xs"
                        disabled={item.status === "approved" || busyId === item._id}
                        onClick={() => changeStatus(item, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-warning btn-xs"
                        disabled={item.status === "rejected" || busyId === item._id}
                        onClick={() => changeStatus(item, "rejected")}
                      >
                        Reject
                      </button>
                      <Link href={`/equipment/${item._id}`} className="btn btn-ghost btn-xs">
                        View
                      </Link>
                      <Link
                        href={`/dashboard/all-equipment/${item._id}/edit`}
                        className="btn btn-outline btn-xs"
                      >
                        Update
                      </Link>
                      <button
                        className="btn btn-error btn-outline btn-xs"
                        onClick={() => handleDelete(item)}
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
      )}
    </div>
  );
}

export default function AllEquipmentPage() {
  return (
    <PrivateRoute roles={["admin"]}>
      <AllEquipment />
    </PrivateRoute>
  );
}