"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [saving, setSaving] = useState(false);

  if (isPending || !session) {
    return <div className="skeleton h-96 w-full" />;
  }

  const user = session.user;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const image = String(fd.get("image") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const address = String(fd.get("address") || "").trim();

    if (!name) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);
    const { error } = await authClient.updateUser({
      name,
      image: image || null,
      phone,
      address,
    });
    setSaving(false);

    if (error) {
      toast.error(error.message || "Could not update profile");
      return;
    }
    toast.success("Profile updated successfully");
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {/* Summary card */}
      <div className="h-fit rounded-box border border-base-300 bg-base-100 p-6 text-center shadow-sm">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="mx-auto h-28 w-28 rounded-full border border-base-300 object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <span className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-secondary text-4xl font-bold text-secondary-content">
            {user.name.charAt(0).toUpperCase()}
          </span>
        )}
        <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
        <p className="break-all text-sm text-base-content/70">{user.email}</p>
        <span className="badge badge-primary mt-3 font-semibold capitalize">
          {user.role}
        </span>
      </div>

      {/* Edit form */}
      <form
        key={`${user.name}-${user.image}-${user.phone}-${user.address}`}
        onSubmit={handleSubmit}
        className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm xl:col-span-2"
      >
        <h2 className="mb-5 text-xl font-bold">Edit profile</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="form-control">
            <span className="label-text mb-1">Name</span>
            <input
              name="name"
              type="text"
              defaultValue={user.name}
              required
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Email (cannot be changed)</span>
            <input
              type="email"
              value={user.email}
              readOnly
              className="input input-bordered w-full bg-base-200"
            />
          </label>

          <label className="form-control sm:col-span-2">
            <span className="label-text mb-1">Profile image URL</span>
            <input
              name="image"
              type="url"
              defaultValue={user.image || ""}
              placeholder="https://example.com/photo.jpg"
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Phone number</span>
            <input
              name="phone"
              type="tel"
              defaultValue={user.phone || ""}
              placeholder="+880 1XXX XXXXXX"
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Address</span>
            <input
              name="address"
              type="text"
              defaultValue={user.address || ""}
              placeholder="House, road, city"
              className="input input-bordered w-full"
            />
          </label>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary mt-6">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}