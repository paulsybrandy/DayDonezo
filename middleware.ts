import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "./lib/config";
import { isAuthenticated } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const path = url.pathname;
  const isAuth = await isAuthenticated();
  // Redirect logic for login and register routes
  if ((path === "/login" || path === "/register") && isAuth) {
    url.pathname = "/dashboard"; // Redirect to dashboard if already logged in
    return NextResponse.redirect(url);
  }

  // Redirect logic for protected routes (like dashboard) if user is not authenticated
  if (path === "/dashboard" && !isAuth) {
    url.pathname = "/login"; // Redirect to login if not logged in
    return NextResponse.redirect(url);
  }

  // Default authentication logic
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount,
  });
}

export const config = {
  matcher: [
    "/",
    "/((?!_next|api|.*\\.).*)",
    "/api/login",
    "/api/logout",
    "/login",
    "/register",
    "/dashboard",
  ],
};
