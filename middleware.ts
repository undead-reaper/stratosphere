import { NextRequest, NextResponse } from "next/server";
import { AppwriteException } from "node-appwrite";
import { toast } from "sonner";
import { getAuthStatus } from "./appwrite/actions/user.actions";

export async function middleware(req: NextRequest) {
  const privateRoutes = ["/", "/:type"];
  const authRoutes = ["/login", "/sign-up"];
  const path = req.nextUrl.pathname;

  let isAuthenticated: boolean = false;
  try {
    isAuthenticated = await getAuthStatus({ req });
  } catch (error) {
    if (error instanceof AppwriteException) {
      toast.error("Authentication error", {
        description: error.message,
      });
    } else {
      toast.error("Authentication error", {
        description: "Please login again.",
      });
    }
  }

  if (authRoutes.some((route) => path.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url), {
        status: 302,
      });
    } else {
      return NextResponse.next();
    }
  } else if (privateRoutes.some((route) => path.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url), {
        status: 302,
      });
    } else {
      return NextResponse.next();
    }
  } else {
    return NextResponse.next();
  }
}

export const config = {
  runtime: "nodejs",
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
};
