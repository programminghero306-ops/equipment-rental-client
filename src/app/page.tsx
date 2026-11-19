"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">Equipment Rental Platform</h1>

      {isPending ? (
        <p>Loading...</p>
      ) : session ? (
        <>
          <p>Logged in as: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
          <p>Role: {session.user.role}</p>

          <button className="btn btn-error" onClick={() => authClient.signOut()}>
            Logout
          </button>

          {/* ---------- TEMPORARY TEST BUTTONS (we will delete these later) ---------- */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className="btn btn-outline"
              onClick={async () => console.log("ME:", await apiFetch("/me"))}
            >
              Test /me
            </button>

            <button
              className="btn btn-outline"
              onClick={async () =>
                console.log("ADMIN:", await apiFetch("/test/admin"))
              }
            >
              Test admin route
            </button>

            <button
              className="btn btn-outline"
              onClick={async () =>
                console.log(
                  "CREATE:",
                  await apiFetch("/equipment", {
                    method: "POST",
                    body: JSON.stringify({
                      name: "Canon EOS R5 Camera",
                      description:
                        "Professional mirrorless camera for photo and video.",
                      category: "Photography Equipment",
                      location: "Dhaka",
                      price: 2500,
                      rentalType: "Daily",
                      quantity: 3,
                      condition: "Excellent",
                      brand: "Canon",
                      model: "EOS R5",
                      image: "https://picsum.photos/seed/camera/600/400",
                      terms:
                        "Security deposit required. Return in the same condition.",
                    }),
                  })
                )
              }
            >
              Test create equipment
            </button>
          </div>
        </>
      ) : (
        <div className="flex gap-3">
          <Link href="/login" className="btn btn-primary">Login</Link>
          <Link href="/register" className="btn btn-outline">Register</Link>
        </div>
      )}
    </main>
  );
}