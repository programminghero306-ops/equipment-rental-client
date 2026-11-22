import SectionHeading from "@/components/SectionHeading";

const faqs = [
  {
    q: "How do I rent equipment?",
    a: "Find equipment on the All Equipment page, open its details, click Book Now, choose your dates and quantity, and pay securely online. Your booking is confirmed as soon as the payment goes through.",
  },
  {
    q: "How is the price calculated?",
    a: "The price depends on the rental type of each item: per day, per week or per month. We multiply the rate by the number of rental periods and the quantity you choose, and you see the total before you pay.",
  },
  {
    q: "Is my payment secure?",
    a: "Yes. Payments are handled by Stripe, a trusted payment provider. We never see or store your card details.",
  },
  {
    q: "Can I cancel a booking?",
    a: "You can cancel any booking that has not been paid yet from My Rentals in your dashboard. If you leave the payment page without paying, you can come back and pay later or cancel it.",
  },
  {
    q: "How do I list my own equipment?",
    a: "Register an account, ask for the Owner role, and add your equipment from the Owner dashboard. Every listing is reviewed by our team before it appears for customers.",
  },
  {
    q: "What if the equipment is already booked?",
    a: "We check availability for your exact dates before payment. If the quantity you need is not free, you will see how many units are available for those dates.",
  },
];

export default function Faq() {
  return (
    <section className="bg-base-200 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Quick answers to the things people ask us most."
        />
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <div
              key={item.q}
              className="collapse collapse-arrow rounded-box border border-base-300 bg-base-100"
            >
              <input type="radio" name="faq" defaultChecked={i === 0} />
              <div className="collapse-title font-semibold">{item.q}</div>
              <div className="collapse-content text-sm leading-relaxed text-base-content/70">
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}