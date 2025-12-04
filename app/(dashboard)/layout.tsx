import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import AuthenticatedSidebar from "@/components/AuthenticatedSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <SidebarProvider className="flex h-screen">
      <AuthenticatedSidebar />
      <section className="flex h-full w-full flex-1 flex-col">
        <AuthenticatedHeader />
        <div className="w-full max-w-full h-full">{children}</div>
      </section>
    </SidebarProvider>
  );
};

export default DashboardLayout;
