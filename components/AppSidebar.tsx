"use client";

import SidebarUserFooter from "@/components/SidebarUserFooter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavItems } from "@/constants";
import { Earth } from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AppSidebarProps {
  fullName: string;
  email: string;
  avatar: string;
}

const AppSidebar = ({ ...props }: AppSidebarProps) => {
  const currentPath = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="px-5 py-7 font-bold flex flex-row items-center gap-2">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <Earth className="size-4" />
        </div>
        <h1>Stratosphere</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {NavItems.map((item) => {
            const isActive = currentPath === item.href;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton isActive={isActive} asChild>
                  <Link href={item.href as Route}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserFooter {...props} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
