"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/imgbb";
import type { Equipment } from "@/lib/types";

const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];
const CONDITIONS = ["Excellent", "Good", "Fair"];

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export default function EquipmentForm({
  initial,
  redirectTo = "/dashboard/my-equipment",
}: {
  initial?: Equipment;
  redirectTo?: string;
}) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initial?.image || "");
  const isEdit = Boolean(initial);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const chosen = e.target.files?.[0];
    if (!chosen) return;
    if (!chosen.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (chosen.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (key: string) => String(fd.get(key) || "").trim();

    if (!file && !initial?.image) {
      toast.error("Please choose an equipment image");
      return;
    }
    if (Number(get("price")) <= 0) {
      toast.error("Rental price must be greater than 0");
      return;
    }

    setSaving(true);
    try {
      const image = file ? await uploadImage(file) : (initial?.image as string);

      const body = {
        name: get("name"),
        description: get("description"),
        category: get("category"),
        location: get("location"),
        price: Number(get("price")),
        rentalType: get("rentalType"),
        quantity: Number(get("quantity")),
        condition: get("condition"),
        brand: get("brand"),
        model: get("model"),
        image,
        terms: get("terms"),
      };

      await apiFetch(isEdit ? `/equipment/${initial?._id}` : "/equipment", {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(body),
      });

      toast.success(
        isEdit
          ? "Equipment updated successfully"
          : "Equipment submitted and waiting for admin approval"
      );
      router.push(redirectTo);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const ownerName = initial?.ownerName ?? session?.user.name ?? "";
  const ownerEmail = initial?.ownerEmail ?? session?.user.email ?? "";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm"
    >
      <h2 className="mb-6 text-xl font-bold">
        {isEdit ? "Update equipment" : "Add new equipment"}
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Equipment name">
          <input name="name" required defaultValue={initial?.name} placeholder="e.g. Canon EOS R5 Camera Kit" className="input input-bordered w-full" />
        </Field>

        <Field label="Category">
          <select name="category" required defaultValue={initial?.category ?? ""} className="select select-bordered w-full">
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Location">
          <input name="location" required defaultValue={initial?.location} placeholder="e.g. Dhaka" className="input input-bordered w-full" />
        </Field>

        <Field label="Rental price ($)">
          <input name="price" type="number" min="1" step="any" required defaultValue={initial?.price} className="input input-bordered w-full" />
        </Field>

        <Field label="Rental type">
          <select name="rentalType" required defaultValue={initial?.rentalType ?? "Daily"} className="select select-bordered w-full">
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </Field>

        <Field label="Available quantity">
          <input name="quantity" type="number" min="0" step="1" required defaultValue={initial?.quantity} className="input input-bordered w-full" />
        </Field>

        <Field label="Equipment condition">
          <select name="condition" required defaultValue={initial?.condition ?? "Good"} className="select select-bordered w-full">
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Brand">
          <input name="brand" required defaultValue={initial?.brand} className="input input-bordered w-full" />
        </Field>

        <Field label="Model">
          <input name="model" required defaultValue={initial?.model} className="input input-bordered w-full" />
        </Field>

        <Field label="Status">
          <input
            readOnly
            value={initial ? initial.status : "pending"}
            className="input input-bordered w-full bg-base-200 capitalize"
          />
        </Field>

        <Field label="Owner name">
          <input readOnly value={ownerName} className="input input-bordered w-full bg-base-200" />
        </Field>

        <Field label="Owner email">
          <input readOnly value={ownerEmail} className="input input-bordered w-full bg-base-200" />
        </Field>

        <Field label="Equipment image" className="sm:col-span-2">
          <div className="flex flex-wrap items-center gap-4">
            {preview ? (
              <img src={preview} alt="Preview" className="h-24 w-36 rounded-lg border border-base-300 object-cover" />
            ) : (
              <div className="grid h-24 w-36 place-items-center rounded-lg border border-dashed border-base-300 text-xs text-base-content/50">
                No image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="file-input file-input-bordered w-full max-w-xs"
            />
          </div>
        </Field>

        <Field label="Description" className="sm:col-span-2">
          <textarea name="description" required rows={4} defaultValue={initial?.description} placeholder="Describe the equipment, what is included and what it is best for." className="textarea textarea-bordered w-full" />
        </Field>

        <Field label="Rental terms and conditions" className="sm:col-span-2">
          <textarea name="terms" required rows={4} defaultValue={initial?.terms} placeholder="Deposit, late fees, return conditions..." className="textarea textarea-bordered w-full" />
        </Field>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? "Saving..." : isEdit ? "Save changes" : "Submit equipment"}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => router.push(redirectTo)}>
          Cancel
        </button>
      </div>
    </form>
  );
}