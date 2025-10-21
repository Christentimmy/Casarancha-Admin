import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Pass-through: no auth gating
  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
