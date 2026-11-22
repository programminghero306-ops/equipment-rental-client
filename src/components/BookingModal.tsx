"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { calcBooking } from "@/lib/pricing";
import { formatMoney } from "@/lib/utils";
import type { Equipment } from "@/lib/types";

const unitName = { Daily: "day", Weekly: "week", Monthly: "month" };

export default function BookingModal({
  item,
  open,
  onClose,
}: {
  item: Equipment;
  open: boolean;
  onClose: () => void;
}) {
  // Today's date in the visitor's own time zone, used as the earliest start date
  const [today] = useState(() => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  });
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const preview = calcBooking(item.price, item.rentalType, start, end, quantity);
  const unit = unitName[item.rentalType];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const phone = String(fd.get("phone") || "").trim();
    const address = String(fd.get("address") || "").trim();
    const notes = String(fd.get("notes") || "").trim();

    if (!start || !end) {
      toast.error("Please choose the rental start and end dates");
      return;
    }
    if (end < start) {
      toast.error("End date must be on or after the start date");
      return;
    }
    if (quantity < 1 || quantity > item.quantity) {
      toast.error(`Quantity must be between 1 and ${item.quantity}`);
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiFetch<{ url: string }>("/bookings/checkout", {
        method: "POST",
        body: JSON.stringify({
          equipmentId: item._id,
          startDate: start,
          endDate: end,
          quantity,
          phone,
          address,
          notes,
        }),
      });
      // Go to the Stripe payment page
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start the booking");
      setSubmitting(false);
    }
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-h-[90vh] max-w-xl overflow-y-auto">
        <h3 className="text-xl font-bold">Book {item.name}</h3>
        <p className="mt-1 text-sm text-base-content/70">
          ${item.price} per {unit} · {item.quantity} available
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Rental start date</span>
              <input
                type="date"
                required
                min={today}
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                  if (end && e.target.value > end) setEnd("");
                }}
                className="input input-bordered w-full"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Rental end date</span>
              <input
                type="date"
                required
                min={start || today}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="input input-bordered w-full"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Required quantity</span>
              <input
                type="number"
                required
                min={1}
                max={item.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="input input-bordered w-full"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Contact number</span>
              <input
                name="phone"
                type="tel"
                required
                placeholder="+880 1XXX XXXXXX"
                className="input input-bordered w-full"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Delivery address</span>
            <input
              name="address"
              required
              placeholder="House, road, area, city"
              className="input input-bordered w-full"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Additional notes (optional)</span>
            <textarea
              name="notes"
              rows={2}
              placeholder="Anything the owner should know"
              className="textarea textarea-bordered w-full"
            />
          </label>

          <div className="rounded-box bg-base-200 p-4 text-sm">
            {preview ? (
              <>
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span>
                    {preview.days} day{preview.days > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span>
                    {preview.periods} {unit}
                    {preview.periods > 1 ? "s" : ""} x {quantity} unit
                    {quantity > 1 ? "s" : ""} x ${item.price}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-base-300 pt-3 text-base font-bold">
                  <span>Total amount</span>
                  <span className="text-primary">{formatMoney(preview.total)}</span>
                </div>
              </>
            ) : (
              <p className="text-base-content/70">
                Choose your dates to see the total price.
              </p>
            )}
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Redirecting to payment..." : "Confirm and pay"}
            </button>
          </div>
        </form>
      </div>
      <div
        className="modal-backdrop"
        onClick={() => {
          if (!submitting) onClose();
        }}
      />
    </dialog>
  );
}