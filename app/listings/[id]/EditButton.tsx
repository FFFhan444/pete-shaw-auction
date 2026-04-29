"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  listingId: string;
}

export default function EditButton({ listingId }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleVerify() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });
      if (res.ok) {
        router.push(`/listings/${listingId}/edit`);
      } else {
        setError("Incorrect password.");
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-xs text-ink/30 hover:text-green transition-colors"
      >
        Edit listing
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-ink mb-2">Edit listing</h3>
            <p className="text-sm text-ink/60 mb-4">
              Enter the admin password to edit this item.
            </p>

            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
              className="w-full border border-ink/20 rounded-md px-4 py-2.5 text-ink bg-white focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-base mb-3"
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            />

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <div className="flex gap-2">
              <button
                onClick={handleVerify}
                disabled={isPending || !adminPassword}
                className="flex-1 bg-green text-white rounded-md py-2.5 font-semibold hover:bg-green-dark transition-colors disabled:opacity-50"
              >
                {isPending ? "Checking…" : "Edit"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setAdminPassword("");
                  setError(null);
                }}
                className="flex-1 border border-ink/20 text-ink rounded-md py-2.5 font-semibold hover:bg-ink/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
