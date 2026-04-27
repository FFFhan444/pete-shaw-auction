"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function placeBid(
  listingId: string,
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getSession();
  if (!session.loggedIn) return { error: "Not authenticated." };

  const amountStr = formData.get("amount") as string;
  const amount = parseFloat(amountStr);
  const note = (formData.get("note") as string)?.trim() || null;

  if (isNaN(amount) || amount <= 0) {
    return { error: "Please enter a valid bid amount." };
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      bids: { orderBy: { amount: "desc" }, take: 1 },
    },
  });

  if (!listing) return { error: "Listing not found." };

  const highestBid = listing.bids[0]?.amount ?? 0;
  const floor = Math.max(highestBid, listing.minimumBid);

  if (amount <= floor) {
    if (highestBid > 0) {
      return {
        error: `Your bid must be higher than the current highest bid of £${highestBid.toFixed(2)}.`,
      };
    }
    return {
      error: `Your bid must be at least £${listing.minimumBid.toFixed(2)}.`,
    };
  }

  await prisma.bid.create({
    data: {
      listingId,
      bidderName: session.displayName!,
      amount,
      note,
    },
  });

  revalidatePath(`/listings/${listingId}`);
  return { success: true };
}
