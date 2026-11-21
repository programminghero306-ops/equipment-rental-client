"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import EquipmentForm from "@/components/dashboard/EquipmentForm";
import PrivateRoute from "@/components/PrivateRoute";
import { apiFetch } from "@/lib/api";
import type { Equipment } from "@/lib/types";

function EditEquipment() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    apiFetch<Equipment>(`/equipment/${id}`)
      .then((data) => {
        if (!ignore) setItem(data);
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

  if (loading) return <div className="skeleton h-96 w-full" />;

  if (!item) {
    return (
      <div className="rounded-box border border-base-300 bg-base-100 p-12 text-center">
        <p className="text-xl font-bold">Equipment not found</p>
        <Link href="/dashboard/all-equipment" className="btn btn-primary mt-5">
          Back to all equipment
        </Link>
      </div>
    );
  }

  return <EquipmentForm initial={item} redirectTo="/dashboard/all-equipment" />;
}

export default function AdminEditEquipmentPage() {
  return (
    <PrivateRoute roles={["admin"]}>
      <EditEquipment />
    </PrivateRoute>
  );
}