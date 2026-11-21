"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCalendarCheck, FaShieldHalved, FaUserCheck } from "react-icons/fa6";
import { container, fadeUp } from "@/lib/motion";

const highlights = [
  { icon: FaUserCheck, title: "Verified owners", text: "Every listing is reviewed before it goes live." },
  { icon: FaShieldHalved, title: "Secure payments", text: "Pay safely online with Stripe." },
  { icon: FaCalendarCheck, title: "Flexible periods", text: "Rent by the day, week or month." },
];

export default function Banner() {
  return (
    <section className="relative isolate overflow-hidden bg-secondary text-secondary-content">
      <img
        src="/banner.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="badge badge-primary mb-5 py-3 font-semibold">
            Equipment rental marketplace
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Rent the right equipment, exactly when you need it
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-secondary-content/80">
            From excavators to cameras, find trusted equipment from verified
            owners near you. Book online, pay securely and get to work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/equipment" className="btn btn-primary btn-lg">
              Browse Equipment
            </Link>
            <Link
              href="/register"
              className="btn btn-lg border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              List Your Equipment
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4"
        >
          {highlights.map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="flex items-center gap-4 rounded-box border border-white/15 bg-white/10 p-5 backdrop-blur"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary text-xl text-primary-content">
                <Icon />
              </span>
              <div>
                <h3 className="font-bold">{title}</h3>
                <p className="text-sm text-secondary-content/70">{text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}