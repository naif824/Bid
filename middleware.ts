import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/auth(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/items(.*)',
  '/api/realtime(.*)',
  '/api/admin(.*)',  // Admin API routes (has own auth)
  '/mgt(.*)',        // Admin pages
  '/:id',
]);

export default clerkMiddleware(async (auth, request) => {
  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
