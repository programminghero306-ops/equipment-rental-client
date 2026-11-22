// Reads ?redirect=/some/page from the URL, but only allows paths inside our own site
export function getRedirectPath(fallback = "/") {
  if (typeof window === "undefined") return fallback;
  const target = new URLSearchParams(window.location.search).get("redirect");
  return target && target.startsWith("/") && !target.startsWith("//")
    ? target
    : fallback;
}
export function formatDate(value?: string, utc = false) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(utc ? { timeZone: "UTC" } : {}),
  });
}

export const formatMoney = (amount: number) =>
  `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;