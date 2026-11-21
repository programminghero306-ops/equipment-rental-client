// Reads ?redirect=/some/page from the URL, but only allows paths inside our own site
export function getRedirectPath(fallback = "/") {
  if (typeof window === "undefined") return fallback;
  const target = new URLSearchParams(window.location.search).get("redirect");
  return target && target.startsWith("/") && !target.startsWith("//")
    ? target
    : fallback;
}