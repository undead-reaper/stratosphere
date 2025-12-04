import { getCurrentUser } from "@/appwrite/actions/user.actions";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuthPage = ["/login", "/sign-up"].includes(pathname);
  const user = await getCurrentUser();

  if (isAuthPage && user && user.data) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!isAuthPage && (!user || !user.data)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/",
    "/documents",
    "/images",
    "/media",
    "/others",
    "/login",
    "/sign-up",
  ],
};
