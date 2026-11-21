"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCamera,
  FaHelmetSafety,
  FaMicrochip,
  FaMusic,
  FaTractor,
  FaTruck,
} from "react-icons/fa6";
import SectionHeading from "@/components/SectionHeading";
import { container, fadeUp } from "@/lib/motion";

const categories = [
  { name: "Construction Equipment", icon: FaHelmetSafety, text: "Excavators, mixers and heavy tools" },
  { name: "Photography Equipment", icon: FaCamera, text: "Cameras, drones and lighting" },
  { name: "Vehicles & Transportation", icon: FaTruck, text: "Vans, bikes and transport" },
  { name: "Agriculture Equipment", icon: FaTractor, text: "Tractors, tillers and farm tools" },
  { name: "Electronics", icon: FaMicrochip, text: "Projectors, generators and more" },
  { name: "Event Equipment", icon: FaMusic, text: "Sound systems, tents and staging" },
];

export default function Categories() {
  return (
    <section className="bg-base-200 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Popular Categories"
          subtitle="Explore equipment by category and find exactly what your project needs."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map(({ name, icon: Icon, text }) => (
            <motion.div
              key={name}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="h-full"
            >
              <Link
                href={`/equipment?category=${encodeURIComponent(name)}`}
                className="flex h-full items-center gap-5 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm transition hover:border-primary hover:shadow-md"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/15 text-2xl text-primary">
                  <Icon />
                </span>
                <div>
                  <h3 className="font-bold">{name}</h3>
                  <p className="text-sm text-base-content/70">{text}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}