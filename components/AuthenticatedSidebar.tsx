import { getCurrentUser } from "@/appwrite/actions/user.actions";
import AppSidebar from "@/components/AppSidebar";
import { Suspense } from "react";

const AuthenticatedSidebarSuspense = async () => {
  const result = await getCurrentUser();

  return <AppSidebar {...result.data!} />;
};

const AuthenticatedSidebar = async () => {
  return (
    <Suspense fallback={<SidebarSkeleton />}>
      <AuthenticatedSidebarSuspense />
    </Suspense>
  );
};

const SidebarSkeleton = () => {
  return (
    <div className="w-64 border-r bg-muted/40 animate-pulse">
      <div className="h-16 px-5 py-7 flex items-center gap-2">
        <div className="size-6 bg-muted-foreground/20 rounded-md" />
        <div className="h-4 w-24 bg-muted-foreground/20 rounded" />
      </div>
      <div className="px-2 space-y-2 mt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 bg-muted-foreground/20 rounded-md" />
        ))}
      </div>
    </div>
  );
};

export default AuthenticatedSidebar;
