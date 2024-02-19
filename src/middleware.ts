import NextAuth from "next-auth";
import authConfig from "./lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  console.log("ROUTE: ", nextUrl.pathname);
  if (nextUrl.pathname === "/register")
    return Response.redirect(new URL("/auth/register", nextUrl));

  if (nextUrl.pathname === "/login" || nextUrl.pathname === "/signin")
    return Response.redirect(new URL("/auth/login", nextUrl));

  return null;
});

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api)(.*)"],
};
