import Link from "next/link";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaLocationDot,
  FaPhone,
  FaXTwitter,
} from "react-icons/fa6";
import Logo from "./Logo";
import { SITE_NAME } from "@/lib/site";

const socials = [
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaXTwitter, href: "https://x.com", label: "X" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
];

const categories = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-neutral text-neutral-content">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed text-neutral-content/70">
            A trusted marketplace where equipment owners and customers meet.
            Rent what you need, for as long as you need it.
          </p>
          <div className="flex gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full bg-neutral-content/10 transition hover:bg-primary hover:text-primary-content"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm text-neutral-content/70">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/equipment" className="hover:text-primary">All Equipment</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-primary">How It Works</Link></li>
            <li><Link href="/login" className="hover:text-primary">Login</Link></li>
            <li><Link href="/register" className="hover:text-primary">Register</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">Categories</h3>
          <ul className="space-y-2 text-sm text-neutral-content/70">
            {categories.map((c) => (
              <li key={c}>
                <Link
                  href={`/equipment?category=${encodeURIComponent(c)}`}
                  className="hover:text-primary"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">Contact Us</h3>
          <ul className="space-y-3 text-sm text-neutral-content/70">
            <li className="flex items-start gap-3">
              <FaLocationDot className="mt-1 shrink-0 text-primary" />
              <span>House 12, Road 5, Gulshan, Dhaka 1212</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="shrink-0 text-primary" />
              <span>+880 1700 000000</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="shrink-0 text-primary" />
              <span>support@gearhive.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-content/10 py-5 text-center text-sm text-neutral-content/60">
      © 2026 {SITE_NAME}. All rights reserved.
    </footer>
  );
}