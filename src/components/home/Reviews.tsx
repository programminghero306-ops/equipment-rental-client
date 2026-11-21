"use client";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa6";
import SectionHeading from "@/components/SectionHeading";
import { container, fadeUp } from "@/lib/motion";
import type { Review } from "@/lib/types";

export default function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="What Our Customers Say"
          subtitle="Real feedback from people who rented equipment through our platform."
        />

        {reviews.length === 0 ? (
          <p className="text-center text-base-content/60">No reviews yet.</p>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {reviews.slice(0, 4).map((review) => (
              <motion.div
                key={review._id}
                variants={fadeUp}
                className="flex h-full flex-col rounded-box border border-base-300 bg-base-100 p-6 shadow-sm"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < review.rating ? "text-warning" : "text-base-300"}
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-base-content/80">
                  “{review.comment}”
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-base-300 pt-4">
                  {review.customerImage ? (
                    <img
                      src={review.customerImage}
                      alt={review.customerName}
                      className="h-10 w-10 rounded-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary font-bold text-secondary-content">
                      {review.customerName.charAt(0)}
                    </span>
                  )}
                  <div>
                    <p className="font-semibold">{review.customerName}</p>
                    <p className="text-xs text-base-content/60">
                      {review.rating} / 5 rating
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}