"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaCalendarCheck,
  FaEnvelope,
  FaLocationDot,
  FaRegHeart,
  FaUser,
} from "react-icons/fa6";
import BookingModal from "@/components/BookingModal";
import PrivateRoute from "@/components/PrivateRoute";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Equipment } from "@/lib/types";

const unitName = { Daily: "day", Weekly: "week", Monthly: "month" };

function Details() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = authClient.useSession();
  const [item, setItem] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    let ignore = false;
    apiFetch<Equipment>(`/equipment/${id}`)
      .then((data) => {
        if (!ignore) setItem(data?._id ? data : null);
      })
      .catch(() => {
        if (!ignore) setItem(null);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="skeleton h-96 w-full" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-2/3" />
          <div className="skeleton h-6 w-1/3" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <p className="text-6xl font-extrabold text-primary">404</p>
        <h1 className="mt-4 text-3xl font-bold">Equipment not found</h1>
        <p className="mt-2 text-base-content/70">
          This item does not exist or is not available.
        </p>
        <Link href="/equipment" className="btn btn-primary mt-6">
          Browse Equipment
        </Link>
      </section>
    );
  }

  const available = item.quantity > 0;
  const canBook = session?.user.role === "customer";

  const facts = [
    ["Category", item.category],
    ["Rental type", item.rentalType],
    ["Available quantity", String(item.quantity)],
    ["Condition", item.condition],
    ["Brand", item.brand],
    ["Model", item.model],
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/equipment"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-base-content/70 hover:text-primary"
      >
        <FaArrowLeft /> Back to all equipment
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-box border border-base-300 bg-base-200">
          <img
            src={item.image}
            alt={item.name}
            className="h-80 w-full object-cover sm:h-[28rem]"
          />
        </div>

        {/* Main info */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-primary">{item.category}</span>
            <span
              className={`badge border-0 ${
                available ? "badge-success" : "badge-error"
              }`}
            >
              {available ? "Available" : "Unavailable"}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {item.name}
          </h1>

          <p className="flex items-center gap-2 text-base-content/70">
            <FaLocationDot className="text-primary" />
            {item.location}
          </p>

          <p>
            <span className="text-4xl font-extrabold">${item.price}</span>
            <span className="text-base-content/60">
              {" "}
              / {unitName[item.rentalType]}
            </span>
          </p>

          <dl className="grid grid-cols-2 gap-3">
            {facts.map(([label, value]) => (
              <div
                key={label}
                className="rounded-box border border-base-300 bg-base-100 p-3"
              >
                <dt className="text-xs uppercase tracking-wide text-base-content/60">
                  {label}
                </dt>
                <dd className="font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-3">
            <button
              className="btn btn-primary btn-lg flex-1"
              disabled={!available || !canBook}
              onClick={() => setShowBooking(true)}
            >
              <FaCalendarCheck /> Book Now
            </button>
            {/* TODO: favorites are connected in the Favorites step */}
            <button
              className="btn btn-outline btn-lg"
              onClick={() => toast("Favorites are coming soon", { icon: "🛠️" })}
            >
              <FaRegHeart /> Add to Favorites
            </button>
          </div>

          {!canBook && (
            <p className="text-sm text-base-content/60">
              Only customer accounts can book equipment.
            </p>
          )}
        </div>
      </div>

      {/* Description, owner, terms */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold">Description</h2>
          <p className="mt-3 leading-relaxed text-base-content/80">
            {item.description}
          </p>

          <h2 className="mt-8 text-xl font-bold">Rental Terms and Conditions</h2>
          <p className="mt-3 leading-relaxed text-base-content/80">
            {item.terms}
          </p>
        </div>

        <div className="h-fit rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
          <h2 className="text-xl font-bold">Owner Information</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <FaUser className="text-primary" />
              <span>{item.ownerName}</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-primary" />
              <span className="break-all">{item.ownerEmail}</span>
            </li>
          </ul>
        </div>
      </div>

      <BookingModal
        item={item}
        open={showBooking}
        onClose={() => setShowBooking(false)}
      />
    </div>
  );
}

export default function EquipmentDetailsPage() {
  return (
    <PrivateRoute>
      <Details />
    </PrivateRoute>
  );
}