"use client";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"rentlight" | "rentdark">("rentlight");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "rentdark" ? "rentdark" : "rentlight");
  }, []);

  function toggle() {
    const next = theme === "rentdark" ? "rentlight" : "rentdark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage can be blocked, the theme still changes for this visit
    }
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="btn btn-ghost btn-circle btn-sm"
    >
      {theme === "rentdark" ? <FaSun /> : <FaMoon />}
    </button>
  );
}