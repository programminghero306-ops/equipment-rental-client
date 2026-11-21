import type { IconType } from "react-icons";
import {
  FaBoxesStacked,
  FaCalendarCheck,
  FaChartPie,
  FaCirclePlus,
  FaClipboardList,
  FaHeart,
  FaUser,
  FaUsers,
} from "react-icons/fa6";

export type MenuItem = { href: string; label: string; icon: IconType };

const overview: MenuItem = { href: "/dashboard", label: "Overview", icon: FaChartPie };

const customerMenu: MenuItem[] = [
  overview,
  { href: "/dashboard/my-rentals", label: "My Rentals", icon: FaClipboardList },
  { href: "/dashboard/favorites", label: "Favorites", icon: FaHeart },
  { href: "/dashboard/profile", label: "Profile", icon: FaUser },
];

const ownerMenu: MenuItem[] = [
  overview,
  { href: "/dashboard/add-equipment", label: "Add Equipment", icon: FaCirclePlus },
  { href: "/dashboard/my-equipment", label: "My Equipment", icon: FaBoxesStacked },
  { href: "/dashboard/equipment-rentals", label: "My Equipment Rental", icon: FaCalendarCheck },
  { href: "/dashboard/profile", label: "My Profile", icon: FaUser },
];

const adminMenu: MenuItem[] = [
  overview,
  { href: "/dashboard/users", label: "All Users", icon: FaUsers },
  { href: "/dashboard/all-equipment", label: "All Equipment", icon: FaBoxesStacked },
  { href: "/dashboard/all-rentals", label: "All Rentals", icon: FaClipboardList },
  { href: "/dashboard/profile", label: "My Profile", icon: FaUser },
];

export function getMenu(role: string): MenuItem[] {
  if (role === "admin") return adminMenu;
  if (role === "owner") return ownerMenu;
  return customerMenu;
}