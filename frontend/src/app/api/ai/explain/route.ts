import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Clause explanation endpoint
  return NextResponse.json({ message: "AI explain endpoint" });
}

