"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OwnerCta() {
  return (
    <section className="pb-16 sm:pb-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6 rounded-box bg-secondary px-6 py-14 text-center text-secondary-content sm:px-12"
        >
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Own equipment that sits idle? Start earning from it.
          </h2>
          <p className="max-w-xl text-secondary-content/80">
            List your equipment for free, set your own price and rental period,
            and reach customers looking for exactly what you have.
          </p>
          <Link href="/register" className="btn btn-primary btn-lg">
            Become an Owner
          </Link>
        </motion.div>
      </div>
    </section>
  );
}