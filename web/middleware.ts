import { NextRequest, NextResponse } from "next/server"

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/settings", "/ide"]

// Routes only accessible to unauthenticated users (redirect to /problems if already logged in)
const authRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // If user is accessing protected route without a token -> redirect to /login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user already logged in visits /login or /register -> redirect to /problems
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/problems", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/ide/:path*",
    "/login",
    "/register",
  ],
}
