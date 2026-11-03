import {
  MiddlewareConfig,
  NextRequest,
  NextResponse as res,
} from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  const appPanel = pathname.startsWith("/app");
  const authPanel = pathname.startsWith("/auth");

  // Not authenticated → redirect to login
  if (!token && appPanel) {
    return res.redirect(new URL("/auth/login", req.url));
  }

  // Already authenticated → redirect to app
  if (token && authPanel) {
    return res.redirect(new URL("/app", req.url));
  }

  return res.next();
}

export const config: MiddlewareConfig = {
  matcher: ["/auth/:path*", "/app/:path*"],
};
