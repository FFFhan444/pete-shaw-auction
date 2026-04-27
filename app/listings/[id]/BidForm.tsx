"use client";

import { useActionState } from "react";
import { placeBid } from "@/app/actions/bids";

interface Props {
  listingId: string;
  displayName: string;
  minimumBid: number;
}

export default function BidForm({ listingId, displayName, minimumBid }: Props) {
  const action = placeBid.bind(null, listingId);
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <div className="bg-white border border-ink/10 rounded-lg p-5">
      <h2 className="text-base font-semibold text-ink mb-3">Place a bid</h2>
      <p className="text-sm text-ink/50 mb-4">
        Bidding as <span className="font-semibold text-ink">{displayName}</span>
        {minimumBid > 0 && (
          <> · must exceed £{minimumBid.toFixed(2)}</>
        )}
      </p>

      <form action={formAction} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/50 font-semibold">
              £
            </span>
            <input
              name="amount"
              type="number"
              step="0.01"
              min={minimumBid + 0.01}
              required
              placeholder={minimumBid > 0 ? `> ${minimumBid.toFixed(2)}` : "0.00"}
              className="w-full border border-ink/20 rounded-md pl-7 pr-4 py-2.5 text-ink bg-white focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-base"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="bg-green text-white rounded-md px-5 py-2.5 font-semibold hover:bg-green-dark transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {pending ? "Bidding…" : "Place bid"}
          </button>
        </div>
        <textarea
          name="note"
          rows={2}
          placeholder="Add a note to your bid (optional)…"
          className="w-full border border-ink/20 rounded-md px-4 py-2.5 text-ink bg-white focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-sm resize-none"
        />
      </form>

      {state?.error && (
        <p className="text-red-600 text-sm mt-2">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-green font-semibold text-sm mt-2">
          Your bid has been placed!
        </p>
      )}
    </div>
  );
}
