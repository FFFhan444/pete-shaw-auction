import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.loggedIn) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { adminPassword } = await request.json();

  if (adminPassword !== process.env.ADMIN_PASSWORD?.trim()) {
    return NextResponse.json(
      { error: "Incorrect admin password." },
      { status: 403 }
    );
  }

  const { id } = await params;

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  await prisma.listing.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
