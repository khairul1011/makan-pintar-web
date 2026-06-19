import { NextResponse } from "next/server";

export async function middleware(request) {
  // Auth checking dilakukan di client-side (AppProvider)
  // Middleware hanya untuk refresh cookies jika perlu di masa depan
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
