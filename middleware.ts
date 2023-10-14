import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  //product
  const cookie_session = request.cookies.get(
    "__Secure-next-auth.session-token"
  );
  //local
  // const cookie_session = request.cookies.get("next-auth.session-token");

  if (url.pathname == "/" && cookie_session == null) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (url.pathname == "/login" && cookie_session != null) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|favicon.ico).*)",
  ],
};
