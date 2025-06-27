import {
  ChartPie,
  File,
  Film,
  Image,
  LayoutDashboard,
  LucideIcon,
} from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

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

type SortType = {
  label: string;
  value: string;
};

export const sortTypes: SortType[] = [
  {
    label: "Date created (newest)",
    value: "$createdAt-desc",
  },
  {
    label: "Created Date (oldest)",
    value: "$createdAt-asc",
  },
  {
    label: "Date modified (newest)",
    value: "$updatedAt-desc",
  },
  {
    label: "Date modified (oldest)",
    value: "$updatedAt-asc",
  },
  {
    label: "Name (A-Z)",
    value: "name-asc",
  },
  {
    label: "Name (Z-A)",
    value: "name-desc",
  },
  {
    label: "Size (Highest)",
    value: "size-desc",
  },
  {
    label: "Size (Lowest)",
    value: "size-asc",
  },
];
