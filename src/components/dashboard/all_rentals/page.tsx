"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import { apiFetch } from "@/lib/api";
import { bookingClass, paymentClass } from "@/lib/status";
import { formatDate, formatMoney } from "@/lib/utils";
import type { Booking } from "@/lib/types";

const TABS = ["all", "pending", "confirmed", "completed", "cancelled"] as const;
type Tab = (typeof TABS)[number];

function AllRentals() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<Tab>("all");

  useEffect(() => {
    let ignore = false;
    apiFetch<Booking[]>("/bookings/all")
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

  async function changeStatus(
    booking: Booking,
    status: "completed" | "cancelled"
  ) {
    const result = await Swal.fire({
      title: status === "completed" ? "Mark as completed?" : "Cancel this booking?",
      text: `${booking.equipmentName} for ${booking.customerName}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, continue",
    });
    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/bookings/${booking._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setItems((prev) =>
        prev.map((b) => (b._id === booking._id ? { ...b, bookingStatus: status } : b))
      );
      toast.success(`Booking marked as ${status}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update booking");
    }
  }

  if (loading) return <div className="skeleton h-72 w-full" />;

  if (error) {
    return (
      <div className="rounded-box border border-error/30 bg-error/10 p-8 text-center">
        <p className="font-semibold">Could not load rentals.</p>
        <p className="mt-1 text-sm text-base-content/70">Please refresh the page.</p>
      </div>
    );
  }

  const count = (t: Tab) =>
    t === "all" ? items.length : items.filter((b) => b.bookingStatus === t).length;
  const visible = tab === "all" ? items : items.filter((b) => b.bookingStatus === tab);

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
          <p className="text-xl font-bold">No bookings in this list</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
          <table className="table">
            <thead>
              <tr>
                <th>Customer information</th>
                <th>Owner information</th>
                <th>Equipment</th>
                <th>Rental duration</th>
                <th>Booking amount</th>
                <th>Payment status</th>
                <th>Booking status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((b) => (
                <tr key={b._id}>
                  <td>
                    <p className="font-semibold">{b.customerName}</p>
                    <p className="text-xs text-base-content/60">{b.customerEmail}</p>
                    <p className="text-xs text-base-content/60">{b.phone}</p>
                  </td>
                  <td>
                    <p className="font-semibold">{b.ownerName}</p>
                    <p className="text-xs text-base-content/60">{b.ownerEmail}</p>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={b.equipmentImage}
                        alt={b.equipmentName}
                        className="h-12 w-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold">{b.equipmentName}</p>
                        <p className="text-xs text-base-content/60">Qty: {b.quantity}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p>{formatDate(b.startDate, true)}</p>
                    <p className="text-xs text-base-content/60">
                      to {formatDate(b.endDate, true)} ({b.days} day{b.days > 1 ? "s" : ""})
                    </p>
                  </td>
                  <td className="font-semibold">{formatMoney(b.totalAmount)}</td>
                  <td>
                    <span className={`badge border-0 capitalize ${paymentClass[b.paymentStatus]}`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge border-0 capitalize ${bookingClass[b.bookingStatus]}`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      {b.paymentStatus === "paid" && b.bookingStatus === "confirmed" && (
                        <button
                          className="btn btn-success btn-xs"
                          onClick={() => changeStatus(b, "completed")}
                        >
                          Mark completed
                        </button>
                      )}
                      {b.paymentStatus === "unpaid" && b.bookingStatus === "pending" && (
                        <button
                          className="btn btn-error btn-outline btn-xs"
                          onClick={() => changeStatus(b, "cancelled")}
                        >
                          Cancel
                        </button>
                      )}
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

export default function AllRentalsPage() {
  return (
    <PrivateRoute roles={["admin"]}>
      <AllRentals />
    </PrivateRoute>
  );
}