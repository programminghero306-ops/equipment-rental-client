"use client";
import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaShieldHalved,
  FaTags,
  FaUserCheck,
} from "react-icons/fa6";
import SectionHeading from "@/components/SectionHeading";
import { container, fadeUp } from "@/lib/motion";

const benefits = [
  { icon: FaTags, title: "Affordable Prices", text: "Competitive daily, weekly and monthly rates with no hidden fees." },
  { icon: FaUserCheck, title: "Verified Owners", text: "Every equipment owner and listing is reviewed by our team." },
  { icon: FaCalendarCheck, title: "Flexible Rental Periods", text: "Rent for a day, a week or a month, whatever your project needs." },
  { icon: FaShieldHalved, title: "Secure Payments", text: "Pay safely online with Stripe. Your payment details stay protected." },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Why Choose Us"
          subtitle="A rental marketplace built to be simple, transparent and safe."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {benefits.map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="h-full rounded-box border border-base-300 bg-base-100 p-6 text-center shadow-sm"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-2xl text-secondary-content">
                <Icon />
              </span>
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