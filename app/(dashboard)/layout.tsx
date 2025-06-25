import { getCurrentUser } from "@/appwrite/actions/user.actions";
import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const DashboardLayout = async ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/login");

  return (
    <SidebarProvider className="flex h-screen">
      <AppSidebar {...currentUser} />
      <section className="flex h-full w-full flex-1 flex-col">
        <MobileNavigation
          userId={currentUser.$id}
          accountId={currentUser.documents}
        />
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="w-full max-w-full h-full">{children}</div>
      </section>
    </SidebarProvider>
  );
};

export default DashboardLayout;
