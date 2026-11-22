"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import { apiFetch } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/utils";
import type { Booking } from "@/lib/types";

const paymentClass: Record<Booking["paymentStatus"], string> = {
  paid: "badge-success",
  unpaid: "badge-warning",
};

const bookingClass: Record<Booking["bookingStatus"], string> = {
  pending: "badge-warning",
  confirmed: "badge-info",
  completed: "badge-success",
  cancelled: "badge-error",
};

function MyRentals() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    apiFetch<Booking[]>("/bookings/mine")
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

  async function handlePay(booking: Booking) {
    setBusyId(booking._id);
    try {
      const data = await apiFetch<{ url: string }>(`/bookings/${booking._id}/pay`, {
        method: "POST",
      });
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start the payment");
      setBusyId(null);
    }
  }

  async function handleCancel(booking: Booking) {
    const result = await Swal.fire({
      title: "Cancel this booking?",
      text: `"${booking.equipmentName}" has not been paid for yet.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "Keep it",
    });
    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/bookings/${booking._id}/cancel`, { method: "PATCH" });
      setItems((prev) =>
        prev.map((b) =>
          b._id === booking._id ? { ...b, bookingStatus: "cancelled" } : b
        )
      );
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel");
    }
  }

  if (loading) return <div className="skeleton h-72 w-full" />;

  if (error) {
    return (
      <div className="rounded-box border border-error/30 bg-error/10 p-8 text-center">
        <p className="font-semibold">Could not load your rentals.</p>
        <p className="mt-1 text-sm text-base-content/70">Please refresh the page.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-box border border-base-300 bg-base-100 p-12 text-center">
        <p className="text-xl font-bold">You have not rented anything yet</p>
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
            <th>Start date</th>
            <th>End date</th>
            <th>Booking date</th>
            <th>Total amount</th>
            <th>Payment status</th>
            <th>Booking status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((b) => {
            const canPay = b.paymentStatus === "unpaid" && b.bookingStatus === "pending";
            return (
              <tr key={b._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <img
                      src={b.equipmentImage}
                      alt={b.equipmentName}
                      className="h-12 w-16 rounded-lg object-cover"
                    />
                    <span className="font-semibold">{b.equipmentName}</span>
                  </div>
                </td>
                <td>{formatDate(b.startDate, true)}</td>
                <td>{formatDate(b.endDate, true)}</td>
                <td>{formatDate(b.createdAt)}</td>
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
                    {canPay ? (
                      <>
                        <button
                          className="btn btn-primary btn-xs"
                          disabled={busyId === b._id}
                          onClick={() => handlePay(b)}
                        >
                          Pay now
                        </button>
                        <button
                          className="btn btn-outline btn-xs"
                          onClick={() => handleCancel(b)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <span className="text-base-content/40">-</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function MyRentalsPage() {
  return (
    <PrivateRoute roles={["customer"]}>
      <MyRentals />
    </PrivateRoute>
  );
}