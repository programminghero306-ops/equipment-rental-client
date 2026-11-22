"use client";
import { useRouter } from "next/navigation";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function HeroSearch() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("search") || "").trim();
    router.push(q ? `/equipment?search=${encodeURIComponent(q)}` : "/equipment");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 flex max-w-xl items-center gap-2 rounded-box bg-base-100 p-1.5 shadow-lg"
    >
      <input
        name="search"
        placeholder="Search excavator, camera, generator..."
        className="min-w-0 flex-1 bg-transparent px-4 text-base-content outline-none placeholder:text-base-content/50"
      />
      <button type="submit" className="btn btn-primary">
        <FaMagnifyingGlass /> Search
      </button>
    </form>
  );
}