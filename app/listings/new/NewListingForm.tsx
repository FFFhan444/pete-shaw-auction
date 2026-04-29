"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createListing } from "@/app/actions/listings";

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

const EMOJIS = [
  "⛳", "🏌️", "🏆", "🎁", "🍾", "🥂", "🍷", "🎶",
  "🌿", "🎨", "🏖️", "✈️", "🏠", "🚗", "🎭", "🎿",
  "⚽", "🎸", "🌟", "🎪", "🍕", "🛥️", "🎯", "🎲",
];

export default function NewListingForm() {
  const [state, action, pending] = useActionState(createListing, null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  return (
    <main className="max-w-3xl mx-auto px-4 pt-14 pb-8 w-full flex-1">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-ink/50 hover:text-green transition-colors mb-4"
      >
        <ChevronLeft />
        Back to auction
      </Link>

      <h1 className="text-2xl font-semibold text-ink mb-6">Add auction item</h1>

      <form action={action} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-ink mb-1">
            Item name <span className="text-green">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Round of Golf at Sunningdale"
            className="w-full border border-ink/20 rounded-md px-4 py-2.5 text-ink bg-white focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-base"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-ink mb-1">
            Description <span className="text-green">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Describe the item, its value, or any conditions…"
            className="w-full border border-ink/20 rounded-md px-4 py-2.5 text-ink bg-white focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-base resize-none"
          />
        </div>

        <div>
          <label htmlFor="minimumBid" className="block text-sm font-semibold text-ink mb-1">
            Reserve <span className="text-ink/40 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/50 font-semibold">£</span>
            <input
              id="minimumBid"
              name="minimumBid"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full border border-ink/20 rounded-md pl-7 pr-4 py-2.5 text-ink bg-white focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-base"
            />
          </div>
        </div>

        <div>
          <label htmlFor="externalLink" className="block text-sm font-semibold text-ink mb-1">
            Link <span className="text-ink/40 font-normal">(optional)</span>
          </label>
          <input
            id="externalLink"
            name="externalLink"
            type="url"
            placeholder="https://…"
            className="w-full border border-ink/20 rounded-md px-4 py-2.5 text-ink bg-white focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            Icon <span className="text-ink/40 font-normal">(optional)</span>
          </label>
          <input type="hidden" name="emoji" value={selectedEmoji ?? ""} />
          <div className="grid grid-cols-8 gap-1.5">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji === selectedEmoji ? null : emoji)}
                className={`text-2xl rounded-md py-2 transition-all ${
                  selectedEmoji === emoji
                    ? "bg-green-light ring-2 ring-green"
                    : "bg-white border border-ink/10 hover:border-green/40 hover:bg-green-light/50"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {state?.error && (
          <p className="text-red-600 text-sm">{state.error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="bg-green text-white rounded-full px-6 py-2.5 font-semibold hover:bg-green-dark transition-colors disabled:opacity-60"
          >
            {pending ? "Adding item…" : "Add item"}
          </button>
          <Link
            href="/"
            className="text-ink/50 text-sm hover:text-ink transition-colors flex items-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
