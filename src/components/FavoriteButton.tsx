"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { apiFetch } from "@/lib/api";

export default function FavoriteButton({
  equipmentId,
  enabled,
}: {
  equipmentId: string;
  enabled: boolean;
}) {
  const [favorited, setFavorited] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let ignore = false;
    apiFetch<string[]>("/favorites/ids")
      .then((ids) => {
        if (!ignore) setFavorited(ids.includes(equipmentId));
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [enabled, equipmentId]);

  async function toggle() {
    if (!enabled) {
      toast("Only customer accounts can save favorites", { icon: "ℹ️" });
      return;
    }
    setBusy(true);
    try {
      if (favorited) {
        await apiFetch(`/favorites/${equipmentId}`, { method: "DELETE" });
        setFavorited(false);
        toast.success("Removed from favorites");
      } else {
        await apiFetch("/favorites", {
          method: "POST",
          body: JSON.stringify({ equipmentId }),
        });
        setFavorited(true);
        toast.success("Added to favorites");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`btn btn-lg ${favorited ? "btn-secondary" : "btn-outline"}`}
    >
      {favorited ? <FaHeart /> : <FaRegHeart />}
      {favorited ? "Remove from Favorites" : "Add to Favorites"}
    </button>
  );
}