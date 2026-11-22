"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import PrivateRoute from "@/components/PrivateRoute";
import { apiFetch } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/utils";
import type { Booking } from "@/lib/types";

function SuccessContent() {
  const sessionId = useSearchParams().get("session_id");
  const [state, setState] = useState<"loading" | "done" | "error">("loading");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [message, setMessage] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!sessionId) {
      setMessage("The payment session is missing.");
      setState("error");
      return;
    }

    apiFetch<{ booking: Booking }>("/bookings/confirm", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    })
      .then((data) => {
        setBooking(data.booking);
        setState("done");
      })
      .catch((err) => {
        setMessage(err instanceof Error ? err.message : "Something went wrong");
        setState("error");
      });
  }, [sessionId]);

  if (state === "loading") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="text-base-content/70">Confirming your payment...</p>
      </div>
    );
  }

  if (state === "error" || !booking) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <FaCircleXmark className="text-6xl text-error" />
        <h1 className="mt-4 text-3xl font-bold">We could not confirm your payment</h1>
        <p className="mt-2 text-base-content/70">{message}</p>
        <Link href="/dashboard/my-rentals" className="btn btn-primary mt-6">
          Go to My Rentals
        </Link>
      </section>
    );
  }

  const rows = [
    ["Equipment", booking.equipmentName],
    ["Rental period", `${formatDate(booking.startDate, true)} to ${formatDate(booking.endDate, true)}`],
    ["Quantity", String(booking.quantity)],
    ["Amount paid", formatMoney(booking.totalAmount)],
    ["Transaction ID", booking.transactionId || "-"],
  ];

  return (
    <section className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-box border border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <FaCircleCheck className="mx-auto text-6xl text-success" />
        <h1 className="mt-4 text-3xl font-extrabold">Payment successful</h1>
        <p className="mt-2 text-base-content/70">
          Your booking is confirmed. The owner has been notified.
        </p>

        <dl className="mt-6 space-y-3 rounded-box bg-base-200 p-5 text-left text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-base-content/60">{label}</dt>
              <dd className="break-all text-right font-semibold">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/my-rentals" className="btn btn-primary">
            View My Rentals
          </Link>
          <Link href="/equipment" className="btn btn-outline">
            Browse more equipment
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function PaymentSuccessPage() {
  return (
    <PrivateRoute roles={["customer"]}>
      <Suspense fallback={<div className="skeleton mx-auto my-16 h-64 max-w-xl" />}>
        <SuccessContent />
      </Suspense>
    </PrivateRoute>
  );
}