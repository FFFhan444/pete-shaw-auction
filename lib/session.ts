import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  loggedIn?: boolean;
  displayName?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "pete-shaw-auction-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  // cookies() in Next.js 15+ returns a Promise; iron-session v8 accepts the
  // resolved ReadonlyRequestCookies store even though its types say CookieStore.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getIronSession<SessionData>((await cookies()) as any, sessionOptions);
}
