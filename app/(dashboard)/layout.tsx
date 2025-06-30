import { getCurrentUser } from "@/appwrite/actions/user.actions";
import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect, RedirectType } from "next/navigation";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

const DashboardLayout = async ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const result = await getCurrentUser();

  if (result.error || !result.data) {
    redirect("/login", RedirectType.replace);
  }

  return (
    <SidebarProvider className="flex h-screen">
      <AppSidebar {...result.data} />
      <section className="flex h-full w-full flex-1 flex-col">
        <MobileNavigation
          userId={result.data.$id}
          accountId={result.data.documents}
        />
        <Header userId={result.data.$id} accountId={result.data.accountId} />
        <div className="w-full max-w-full h-full">{children}</div>
      </section>
    </SidebarProvider>
  );
};

export default DashboardLayout;
