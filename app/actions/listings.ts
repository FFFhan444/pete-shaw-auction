"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
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
  const imageFile = formData.get("image") as File | null;

  if (!title || !description) {
    return { error: "Title and description are required." };
  }

  if (minimumBid < 0) {
    return { error: "Minimum bid cannot be negative." };
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const blob = await put(imageFile.name, imageFile, { access: "public" });
    imageUrl = blob.url;
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      externalLink,
      imageUrl,
      minimumBid,
      createdBy: session.displayName!,
    },
  });

  revalidatePath("/");
  redirect(`/listings/${listing.id}`);
}
