"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function login(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const password = formData.get("password") as string;
  const displayName = (formData.get("displayName") as string)?.trim();

  if (!password || !displayName) {
    return { error: "Please enter both your name and the event password." };
  }

  if (password !== process.env.AUCTION_PASSWORD) {
    return { error: "Incorrect password. Please try again." };
  }

  const session = await getSession();
  session.loggedIn = true;
  session.displayName = displayName;
  await session.save();

  redirect("/");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
