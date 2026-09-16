import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message:
      "Use the NextAuth signOut endpoint to terminate the authenticated session.",
  });
}