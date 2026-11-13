import {
  MiddlewareConfig,
  NextRequest,
  NextResponse as res,
} from "next/server";

export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const { pathname } = req.nextUrl;

  const appPanel = pathname.startsWith("/app");
  const authPanel = pathname.startsWith("/auth");

  // Not authenticated → redirect to login
  if (!accessToken && !refreshToken && appPanel) {
    return res.redirect(new URL("/auth/login", req.url));
  }

  return res.next();
}

export const config: MiddlewareConfig = {
  matcher: ["/auth/:path*", "/app/:path*"],
};
