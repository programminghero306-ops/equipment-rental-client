"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaBars, FaHouse, FaRightFromBracket } from "react-icons/fa6";
import Logo from "@/components/Logo";
import { authClient } from "@/lib/auth-client";
import { getMenu } from "./menu";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const role = session?.user.role ?? "customer";
  const menu = getMenu(role);
  const current = menu.find((item) =>
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href)
  );

  function closeDrawer() {
    const toggle = document.getElementById("dash-drawer") as HTMLInputElement | null;
    if (toggle) toggle.checked = false;
  }

  async function handleLogout() {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  }

  const image = session?.user.image;
  const name = session?.user.name ?? "";

  return (
    <div className="drawer lg:drawer-open">
      <input id="dash-drawer" type="checkbox" className="drawer-toggle" />

      {/* ---------- Main area ---------- */}
      <div className="drawer-content flex min-h-screen flex-col bg-base-200">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-base-300 bg-base-100 px-4 py-3 sm:px-6">
          <label
            htmlFor="dash-drawer"
            aria-label="Open sidebar"
            className="btn btn-ghost btn-square lg:hidden"
          >
            <FaBars />
          </label>

          <h1 className="flex-1 truncate text-lg font-bold sm:text-xl">
            {current?.label ?? "Dashboard"}
          </h1>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight">{name}</p>
              <p className="text-xs capitalize text-base-content/60">{role}</p>
            </div>
            {image ? (
              <img
                src={image}
                alt={name}
                className="h-10 w-10 rounded-full border border-base-300 object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary font-bold text-secondary-content">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* ---------- Sidebar ---------- */}
      <div className="drawer-side z-40">
        <label
          htmlFor="dash-drawer"
          aria-label="Close sidebar"
          className="drawer-overlay"
        />
        <aside className="flex min-h-full w-72 flex-col bg-neutral p-4 text-neutral-content">
          <div className="px-2 py-3">
            <Logo light />
          </div>

          <ul className="menu mt-4 w-full flex-1 gap-1 p-0">
            {menu.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeDrawer}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                      active
                        ? "bg-primary font-semibold text-primary-content"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <Icon /> {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-white/10"
            >
              <FaHouse /> Back to Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-white/10"
            >
              <FaRightFromBracket /> Logout
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}