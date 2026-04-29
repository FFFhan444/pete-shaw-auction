"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function createListing(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession();
  if (!session.loggedIn) return { error: "Not authenticated." };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const externalLink = (formData.get("externalLink") as string)?.trim() || null;
  const minimumBid = parseFloat(formData.get("minimumBid") as string) || 0;
  const emoji = (formData.get("emoji") as string)?.trim() || null;

  if (!title || !description) {
    return { error: "Title and description are required." };
  }

  if (!formData.get("minimumBid") || isNaN(minimumBid) || minimumBid < 0) {
    return { error: "A reserve amount is required." };
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      externalLink,
      emoji,
      minimumBid,
      createdBy: session.displayName!,
    },
  });

  revalidatePath("/");
  redirect(`/listings/${listing.id}`);
}

export async function updateListing(
  id: string,
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession();
  if (!session.loggedIn) return { error: "Not authenticated." };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const externalLink = (formData.get("externalLink") as string)?.trim() || null;
  const minimumBid = parseFloat(formData.get("minimumBid") as string);
  const emoji = (formData.get("emoji") as string)?.trim() || null;

  if (!title || !description) {
    return { error: "Title and description are required." };
  }

  if (isNaN(minimumBid) || minimumBid < 0) {
    return { error: "A reserve amount is required." };
  }

  await prisma.listing.update({
    where: { id },
    data: { title, description, externalLink, emoji, minimumBid },
  });

  revalidatePath("/");
  revalidatePath(`/listings/${id}`);
  redirect(`/listings/${id}`);
}
