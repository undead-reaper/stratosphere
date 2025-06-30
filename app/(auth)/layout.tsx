import { getCurrentUser } from "@/appwrite/actions/user.actions";
import { Earth } from "lucide-react";
import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {

  const result = await getCurrentUser();

  if (result.data) {
    redirect("/", RedirectType.replace);
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Earth className="size-4" />
            </div>
            Stratosphere
          </a>
        </div>
        {children}
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/images/auth-hero.jpg"
          priority
          fill
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
