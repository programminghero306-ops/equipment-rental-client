export function calcBooking(
  price: number,
  rentalType: string,
  start: string,
  end: string,
  quantity: number
) {
  if (!start || !end || !(quantity >= 1)) return null;
  const s = new Date(`${start}T00:00:00Z`).getTime();
  const e = new Date(`${end}T00:00:00Z`).getTime();
  const days = Math.round((e - s) / 86400000) + 1;
  if (!(days >= 1)) return null;

  const periods =
    rentalType === "Weekly"
      ? Math.ceil(days / 7)
      : rentalType === "Monthly"
      ? Math.ceil(days / 30)
      : days;

  return {
    days,
    periods,
    total: Math.round(price * periods * quantity * 100) / 100,
  };
}