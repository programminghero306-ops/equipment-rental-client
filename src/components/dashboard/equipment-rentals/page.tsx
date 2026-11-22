"use client";
import { useEffect, useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import { apiFetch } from "@/lib/api";
import { bookingClass, paymentClass } from "@/lib/status";
import { formatDate, formatMoney } from "@/lib/utils";
import type { Booking } from "@/lib/types";

function OwnerRentals() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;
    apiFetch<Booking[]>("/bookings/owner")
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

  if (loading) return <div className="skeleton h-72 w-full" />;

  if (error) {
    return (
      <div className="rounded-box border border-error/30 bg-error/10 p-8 text-center">
        <p className="font-semibold">Could not load rentals.</p>
        <p className="mt-1 text-sm text-base-content/70">Please refresh the page.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-box border border-base-300 bg-base-100 p-12 text-center">
        <p className="text-xl font-bold">No rentals yet</p>
        <p className="mt-2 text-base-content/70">
          When customers book and pay for your equipment, they appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
      <table className="table">
        <thead>
          <tr>
            <th>Customer information</th>
            <th>Equipment information</th>
            <th>Rental duration</th>
            <th>Required quantity</th>
            <th>Booking amount</th>
            <th>Payment status</th>
            <th>Booking status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((b) => (
            <tr key={b._id}>
              <td>
                <p className="font-semibold">{b.customerName}</p>
                <p className="text-xs text-base-content/60">{b.customerEmail}</p>
                <p className="text-xs text-base-content/60">{b.phone}</p>
                <p className="max-w-[14rem] truncate text-xs text-base-content/60" title={b.address}>
                  {b.address}
                </p>
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
                    <p className="text-xs text-base-content/60">{b.category}</p>
                  </div>
                </div>
              </td>
              <td>
                <p>{formatDate(b.startDate, true)}</p>
                <p className="text-xs text-base-content/60">
                  to {formatDate(b.endDate, true)} ({b.days} day{b.days > 1 ? "s" : ""})
                </p>
              </td>
              <td>{b.quantity}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function OwnerRentalsPage() {
  return (
    <PrivateRoute roles={["owner"]}>
      <OwnerRentals />
    </PrivateRoute>
  );
}