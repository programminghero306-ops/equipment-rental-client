"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import EquipmentCard from "@/components/EquipmentCard";
import SectionHeading from "@/components/SectionHeading";
import { container, fadeUp } from "@/lib/motion";
import type { Equipment } from "@/lib/types";

export default function FeaturedEquipment({ items }: { items: Equipment[] }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured Equipment"
          subtitle="Hand-picked, approved equipment ready to rent right now."
        />

        {items.length === 0 ? (
          <p className="text-center text-base-content/60">
            No equipment is available right now. Please check back soon.
          </p>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item) => (
              <motion.div key={item._id} variants={fadeUp} className="h-full">
                <EquipmentCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <Link href="/equipment" className="btn btn-primary">
            View All Equipment
          </Link>
        </div>
      </div>
    </section>
  );
}