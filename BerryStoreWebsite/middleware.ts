import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const needAuth = process.env.SITE_USER && process.env.SITE_PASS;
  if (!needAuth) return NextResponse.next();

  const { pathname } = new URL(req.url);
  const protect = pathname.startsWith("/admin") || (pathname.startsWith("/api/products") && req.method !== "GET");
  if (!protect) return NextResponse.next();

  const auth = req.headers.get("authorization");
  const USER = process.env.SITE_USER!;
  const PASS = process.env.SITE_PASS!;

  if (!auth || !auth.startsWith("Basic ")) {
    return new NextResponse("Auth required.", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' } });
  }
  const [, base64] = auth.split(" ");
  const [user, pass] = Buffer.from(base64, "base64").toString().split(":");
  if (user !== USER || pass !== PASS) return new NextResponse("Access denied.", { status: 401 });
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next|favicon.ico).*)"] };
