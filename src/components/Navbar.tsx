"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaBars } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "All Equipment" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "#contact", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : !href.includes("#") && pathname.startsWith(href);

  async function handleLogout() {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  }

  const navLinks = links.map((l) => (
    <li key={l.href}>
      <Link
        href={l.href}
        className={isActive(l.href) ? "font-semibold text-primary" : ""}
      >
        {l.label}
      </Link>
    </li>
  ));

  const userImage = session?.user.image;

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="navbar mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Left: mobile menu + logo */}
        <div className="navbar-start gap-1">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              aria-label="Open menu"
              className="btn btn-ghost btn-square lg:hidden"
            >
              <FaBars />
            </div>
            <ul
              tabIndex={0}
              onClick={() => (document.activeElement as HTMLElement)?.blur()}
              className="menu menu-sm dropdown-content z-50 mt-3 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
            >
              {navLinks}
              <li className="mt-2 border-t border-base-300 pt-2" />
              {isPending ? null : session ? (
                <>
                  <li>
                    <Link href="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login">Login</Link>
                  </li>
                  <li>
                    <Link href="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <Logo />
        </div>

        {/* Center: desktop links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">{navLinks}</ul>
        </div>

        {/* Right: desktop auth buttons */}
        <div className="navbar-end hidden gap-2 lg:flex">
          {isPending ? (
            <span className="loading loading-dots loading-sm" />
          ) : session ? (
            <>
              {userImage ? (
                <img
                  src={userImage}
                  alt={session.user.name}
                  className="h-9 w-9 rounded-full border border-base-300 object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary font-bold text-secondary-content">
                  {session.user.name.charAt(0).toUpperCase()}
                </span>
              )}
              <Link href="/dashboard" className="btn btn-primary btn-sm">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}