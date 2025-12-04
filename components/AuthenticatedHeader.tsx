import { getCurrentUser } from "@/appwrite/actions/user.actions";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { Suspense } from "react";

const AuthenticatedHeaderSuspense = async () => {
  const result = await getCurrentUser();

  return (
    <>
      <MobileNavigation
        userId={result.data!.$id}
        accountId={result.data!.accountId}
      />
      <Header userId={result.data!.$id} accountId={result.data!.accountId} />
    </>
  );
};

const AuthenticatedHeader = async () => {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <AuthenticatedHeaderSuspense />
    </Suspense>
  );
};

function HeaderSkeleton() {
  return (
    <header className="flex-row justify-end items-center gap-3 px-5 hidden md:flex py-5">
      <div className="h-10 w-64 bg-muted-foreground/20 rounded-md animate-pulse" />
      <div className="h-10 w-24 bg-muted-foreground/20 rounded-md animate-pulse" />
    </header>
  );
}

export default AuthenticatedHeader;
