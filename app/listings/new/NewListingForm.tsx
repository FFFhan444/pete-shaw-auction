"use client";

import { useActionState, useState, useRef } from "react";
import Image from "next/image";
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setImageUrl(data.url);
    setUploading(false);
  }

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
            Item name
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
            Description
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
            Reserve
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/50 font-semibold">£</span>
            <input
              id="minimumBid"
              name="minimumBid"
              type="number"
              step="0.01"
              min="0"
              required
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
            Photo <span className="text-ink/40 font-normal">(optional)</span>
          </label>
          <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />
          {imageUrl ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-ink/10">
              <Image src={imageUrl} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => { setImageUrl(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="absolute top-2 right-2 bg-black/50 text-white text-xs rounded-full px-2 py-1 hover:bg-black/70 transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-ink/20 rounded-lg cursor-pointer hover:border-green/50 hover:bg-green-light/30 transition-all">
              <span className="text-ink/40 text-sm">
                {uploading ? "Uploading…" : "Click to upload a photo"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={uploading}
              />
            </label>
          )}
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
            disabled={pending || uploading}
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
