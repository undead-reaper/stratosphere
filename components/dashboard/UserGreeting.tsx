import { getCurrentUser } from "@/appwrite/actions/user.actions";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Suspense } from "react";

const UserGreetingSuspense = async () => {
  const userResult = await getCurrentUser();
  const now = new Date();
  const date = format(now, "EEEE, MMMM d, yyyy");

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle>👋 Hello, {userResult.data!.fullName}!</CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
    </Card>
  );
};

const UserGreeting = () => {
  return (
    <Suspense fallback={<UserGreetingSkeleton />}>
      <UserGreetingSuspense />
    </Suspense>
  );
};

const UserGreetingSkeleton = () => {
  return (
    <Card className="mb-5">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
    </Card>
  );
};

export default UserGreeting;
