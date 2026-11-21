"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

type AppUser = {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  createdAt?: string;
};

const ROLES = ["customer", "owner", "admin"];

function Users() {
  const { data: session } = authClient.useSession();
  const myId = session?.user.id;

  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let ignore = false;
    apiFetch<AppUser[]>("/users")
      .then((data) => {
        if (!ignore) setUsers(data);
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

  async function changeRole(user: AppUser, role: string) {
    const result = await Swal.fire({
      title: "Change role?",
      text: `${user.name} will become ${role}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change it",
    });
    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/users/${user._id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role } : u))
      );
      toast.success(`${user.name} is now ${role}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change role");
    }
  }

  async function handleDelete(user: AppUser) {
    const result = await Swal.fire({
      title: "Delete this user?",
      text: `${user.name} (${user.email}) will lose access permanently.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete user",
      confirmButtonColor: "#d33",
    });
    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/users/${user._id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete user");
    }
  }

  if (loading) return <div className="skeleton h-72 w-full" />;

  if (error) {
    return (
      <div className="rounded-box border border-error/30 bg-error/10 p-8 text-center">
        <p className="font-semibold">Could not load users.</p>
        <p className="mt-1 text-sm text-base-content/70">Please refresh the page.</p>
      </div>
    );
  }

  const term = search.toLowerCase().trim();
  const visible = users.filter(
    (u) =>
      !term ||
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
  );

  return (
    <div className="space-y-5">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email"
        className="input input-bordered w-full max-w-sm bg-base-100"
      />

      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Registered</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-base-content/60">
                  No users found
                </td>
              </tr>
            ) : (
              visible.map((user) => {
                const isMe = user._id === myId;
                return (
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        ) : (
                          <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary font-bold text-secondary-content">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <span className="font-semibold">
                          {user.name}
                          {isMe && <span className="ml-2 badge badge-primary badge-sm">You</span>}
                        </span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        disabled={isMe}
                        onChange={(e) => changeRole(user, e.target.value)}
                        className="select select-bordered select-sm capitalize"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="text-right">
                      <button
                        className="btn btn-error btn-outline btn-xs"
                        disabled={isMe}
                        onClick={() => handleDelete(user)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <PrivateRoute roles={["admin"]}>
      <Users />
    </PrivateRoute>
  );
}