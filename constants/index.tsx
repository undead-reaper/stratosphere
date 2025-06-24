import { NavItem } from "@/types/NavItem";
import { ChartPie, File, Film, Image, LayoutDashboard } from "lucide-react";

export const NavItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: File,
  },
  {
    name: "Images",
    href: "/images",
    icon: Image,
  },
  {
    name: "Media",
    href: "/media",
    icon: Film,
  },
  {
    name: "Others",
    href: "/others",
    icon: ChartPie,
  },
];
