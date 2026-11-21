"use client";
import { motion } from "framer-motion";
import {
  FaCalendarDays,
  FaCircleCheck,
  FaCreditCard,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import SectionHeading from "@/components/SectionHeading";
import { container, fadeUp } from "@/lib/motion";

const steps = [
  { icon: FaMagnifyingGlass, title: "Find Equipment", text: "Search and filter by category, location and price." },
  { icon: FaCalendarDays, title: "Choose Your Dates", text: "Pick the rental period and quantity you need." },
  { icon: FaCreditCard, title: "Pay Securely", text: "Confirm your booking and pay online with Stripe." },
  { icon: FaCircleCheck, title: "Pick Up and Use", text: "Collect or receive your equipment and get to work." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-base-200 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="How It Works"
          subtitle="Renting equipment takes just four simple steps."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="relative h-full rounded-box border border-base-300 bg-base-100 p-6 pt-10 text-center shadow-sm"
            >
              <span className="absolute -top-4 left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-primary font-bold text-primary-content">
                {index + 1}
              </span>
              <Icon className="mx-auto text-3xl text-secondary" />
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/70">
                {text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}