"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green text-white rounded-full px-8 py-4 text-center mb-4">
            <p className="text-xs tracking-widest uppercase font-semibold opacity-80">
              The
            </p>
            <h1 className="text-3xl font-semibold leading-tight">Pete Shaw</h1>
            <p className="text-sm tracking-wide">Memorial Golf Day 2026</p>
          </div>
          <p className="text-ink/60 text-base mt-4">Charity Auction</p>
        </div>

        <form action={action} className="space-y-4">
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-semibold text-ink mb-1"
            >
              Your name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              required
              placeholder="e.g. John Smith"
              className="w-full border border-ink/20 rounded-md px-4 py-2.5 text-ink bg-white focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-base"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-ink mb-1"
            >
              Event password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter event password"
              className="w-full border border-ink/20 rounded-md px-4 py-2.5 text-ink bg-white focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-base"
            />
          </div>

          {state?.error && (
            <p className="text-red-600 text-sm">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-green text-white rounded-md py-2.5 text-base font-semibold hover:bg-green-dark transition-colors disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Enter auction"}
          </button>
        </form>

        <p className="text-center text-xs text-ink/40 mt-6">
          Raising funds for Woking Hospice
        </p>
      </div>
    </div>
  );
}
