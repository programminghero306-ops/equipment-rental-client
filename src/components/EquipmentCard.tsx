"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaLocationDot } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import type { Equipment } from "@/lib/types";

const unitName = { Daily: "day", Weekly: "week", Monthly: "month" };

export default function EquipmentCard({ item }: { item: Equipment }) {
  const { data: session } = authClient.useSession();
  const available = item.quantity > 0;
  const href = session ? `/equipment/${item._id}` : "/login";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 w-full bg-base-200">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span
          className={`badge absolute left-3 top-3 border-0 ${
            available ? "badge-success" : "badge-error"
          }`}
        >
          {available ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="line-clamp-1 text-xs font-semibold uppercase tracking-wide text-primary">
            {item.category}
          </span>
          <span className="badge badge-outline badge-sm">{item.rentalType}</span>
        </div>

        <h3 className="line-clamp-1 text-lg font-bold">{item.name}</h3>

        <p className="flex items-center gap-2 text-sm text-base-content/70">
          <FaLocationDot className="text-primary" />
          {item.location}
        </p>

        <p className="mt-auto pt-2">
          <span className="text-2xl font-extrabold">${item.price}</span>
          <span className="text-sm text-base-content/60">
            {" "}
            / {unitName[item.rentalType]}
          </span>
        </p>

        <Link
          href={href}
          onClick={() => {
            if (!session) toast("Please login to view details", { icon: "🔒" });
          }}
          className="btn btn-primary btn-block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}