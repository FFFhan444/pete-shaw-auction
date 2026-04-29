import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (password?.trim() === process.env.ADMIN_PASSWORD?.trim()) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
}
