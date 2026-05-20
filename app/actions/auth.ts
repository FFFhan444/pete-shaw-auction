"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function login(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();

  if (!firstName || !lastName) {
    return { error: "Please enter your first and last name." };
  }

  const session = await getSession();
  session.loggedIn = true;
  session.displayName = `${firstName} ${lastName}`;
  await session.save();

  redirect("/");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
