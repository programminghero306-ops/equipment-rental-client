import Link from "next/link";
import { FaCircleXmark } from "react-icons/fa6";

export default function PaymentCancelPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <FaCircleXmark className="text-6xl text-warning" />
      <h1 className="mt-4 text-3xl font-extrabold">Payment cancelled</h1>
      <p className="mt-2 text-base-content/70">
        No money was taken. Your booking is saved as unpaid, so you can pay for
        it later from My Rentals.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard/my-rentals" className="btn btn-primary">
          Go to My Rentals
        </Link>
        <Link href="/equipment" className="btn btn-outline">
          Browse equipment
        </Link>
      </div>
    </section>
  );
}