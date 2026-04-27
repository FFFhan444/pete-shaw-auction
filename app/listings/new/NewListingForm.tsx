"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createListing } from "@/app/actions/listings";

export default function NewListingForm() {
  const [state, action, pending] = useActionState(createListing, null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
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
              Minimum bid <span className="text-ink/40 font-normal">(optional)</span>
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
            <label className="block text-sm font-semibold text-ink mb-1">
              Image <span className="text-ink/40 font-normal">(optional)</span>
            </label>
            {preview && (
              <div className="relative w-full h-48 rounded-md overflow-hidden mb-2 border border-ink/10">
                <Image src={preview} alt="Preview" fill className="object-cover" />
              </div>
            )}
            <input
              ref={fileRef}
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-ink/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-light file:text-green hover:file:bg-green/20 cursor-pointer"
            />
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
