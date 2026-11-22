"use client";
import { useEffect, useState } from "react";
import EquipmentCard from "@/components/EquipmentCard";
import type { Equipment } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RelatedEquipment({
  category,
  currentId,
}: {
  category: string;
  currentId: string;
}) {
  const [items, setItems] = useState<Equipment[]>([]);

  useEffect(() => {
    let ignore = false;
    fetch(`${API_URL}/equipment?category=${encodeURIComponent(category)}&limit=4`)
      .then((res) => res.json())
      .then((data) => {
        if (ignore) return;
        const list: Equipment[] = data.items || [];
        setItems(list.filter((i) => i._id !== currentId).slice(0, 3));
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [category, currentId]);

  if (items.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="text-2xl font-extrabold tracking-tight">You may also like</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <EquipmentCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}