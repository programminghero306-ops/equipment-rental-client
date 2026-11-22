import type { Booking } from "./types";

export const paymentClass: Record<Booking["paymentStatus"], string> = {
  paid: "badge-success",
  unpaid: "badge-warning",
};

export const bookingClass: Record<Booking["bookingStatus"], string> = {
  pending: "badge-warning",
  confirmed: "badge-info",
  completed: "badge-success",
  cancelled: "badge-error",
};
