import Link from "next/link";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { SITE_NAME } from "@/lib/site";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-content">
        <FaScrewdriverWrench />
      </span>
      <span className={light ? "text-neutral-content" : "text-base-content"}>
        {SITE_NAME}
      </span>
    </Link>
  );
}