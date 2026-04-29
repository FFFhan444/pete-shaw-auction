"use client";

import { useState, useTransition } from "react";
import type { Bid } from "@/app/generated/prisma/client";

interface Props {
  bids: Bid[];
}

export default function BidHistory({ bids }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (bids.length === 0) return null;

  function handleVerify() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setUnlocked(true);
        setShowInput(false);
        setPassword("");
      } else {
        setError("Incorrect password.");
      }
    });
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-ink">
          {bids.length} {bids.length === 1 ? "bid" : "bids"} placed
        </h2>
        {!unlocked && (
          <button
            onClick={() => setShowInput(!showInput)}
            className="text-xs font-semibold text-green border border-green/30 rounded-full px-3 py-1 hover:bg-green-light transition-colors"
          >
            View bids
          </button>
        )}
      </div>

      {!unlocked && showInput && (
        <div className="mb-3">
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              className="flex-1 border border-ink/20 rounded-md px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            />
            <button
              onClick={handleVerify}
              disabled={isPending || !password}
              className="bg-green text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-green-dark transition-colors disabled:opacity-50"
            >
              {isPending ? "…" : "Unlock"}
            </button>
          </div>
          {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
        </div>
      )}

      {unlocked && (
        <div className="space-y-2">
          {bids.map((bid, index) => (
            <div
              key={bid.id}
              className={`flex items-center justify-between py-2.5 px-3 rounded-md ${
                index === 0 ? "bg-green text-white" : "bg-white border border-ink/10"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {index === 0 && <span className="text-xs">🏆</span>}
                  <span className={`text-sm font-semibold ${index === 0 ? "text-white" : "text-ink"}`}>
                    {bid.bidderName}
                  </span>
                </div>
                {bid.note && (
                  <p className={`text-xs mt-0.5 italic truncate ${index === 0 ? "text-white/70" : "text-ink/50"}`}>
                    "{bid.note}"
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className={`font-semibold ${index === 0 ? "text-white" : "text-green"}`}>
                  £{bid.amount.toFixed(2)}
                </span>
                <p className={`text-xs mt-0.5 ${index === 0 ? "text-white/70" : "text-ink/40"}`}>
                  {new Date(bid.createdAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
