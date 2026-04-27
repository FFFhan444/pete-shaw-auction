import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Bid } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import NavBar from "@/app/components/NavBar";
import BidForm from "./BidForm";
import DeleteButton from "./DeleteButton";

export default async function ListingPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const session = await getSession();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      bids: { orderBy: { amount: "desc" } },
    },
  });

  if (!listing) notFound();

  const highestBid = listing.bids[0];

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar
        displayName={session.displayName}
        right={
          <Link href="/" className="text-white/70 text-sm hover:text-white transition-colors">
            ← All items
          </Link>
        }
      />

      <main className="max-w-5xl mx-auto px-4 pt-14 pb-8 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column: listing details */}
          <div>
            {listing.imageUrl && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-ink/10 mb-6">
                <Image
                  src={listing.imageUrl}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <h1 className="text-3xl font-semibold text-ink leading-snug">
              {listing.title}
            </h1>

            <p className="text-ink/60 text-sm mt-1 mb-4">
              Added by {listing.createdBy}
            </p>

            <p className="text-base text-ink leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>

            {listing.externalLink && (
              <a
                href={listing.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-green font-semibold text-sm border border-green rounded-full px-4 py-1.5 hover:bg-green hover:text-white transition-colors"
              >
                Learn more ↗
              </a>
            )}

            <div className="mt-6">
              <DeleteButton listingId={id} />
            </div>
          </div>

          {/* Right column: bids */}
          <div>
            {/* Highest bid */}
            <div className="bg-green-light border border-green/20 rounded-lg p-5 mb-6">
              {highestBid ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-green/70 mb-1">
                    Current highest bid
                  </p>
                  <p className="text-4xl font-semibold text-green">
                    £{highestBid.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-ink/60 mt-1">
                    by {highestBid.bidderName}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-green/70 mb-1">
                    No bids yet
                  </p>
                  {listing.minimumBid > 0 ? (
                    <p className="text-lg text-ink/70">
                      Starting from{" "}
                      <span className="font-semibold text-green">
                        £{listing.minimumBid.toFixed(2)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-lg text-ink/50">Be the first to bid!</p>
                  )}
                </>
              )}
            </div>

            {/* Bid form */}
            <BidForm
              listingId={id}
              displayName={session.displayName!}
              minimumBid={Math.max(highestBid?.amount ?? 0, listing.minimumBid)}
            />

            {/* Bid history */}
            {listing.bids.length > 0 && (
              <div className="mt-6">
                <h2 className="text-base font-semibold text-ink mb-3">
                  All bids
                </h2>
                <div className="space-y-2">
                  {listing.bids.map((bid: Bid, index: number) => (
                    <div
                      key={bid.id}
                      className={`flex items-center justify-between py-2.5 px-3 rounded-md ${
                        index === 0
                          ? "bg-green text-white"
                          : "bg-white border border-ink/10"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {index === 0 && (
                            <span className="text-xs">🏆</span>
                          )}
                          <span
                            className={`text-sm font-semibold ${
                              index === 0 ? "text-white" : "text-ink"
                            }`}
                          >
                            {bid.bidderName}
                          </span>
                        </div>
                        {bid.note && (
                          <p
                            className={`text-xs mt-0.5 italic truncate ${
                              index === 0 ? "text-white/70" : "text-ink/50"
                            }`}
                          >
                            "{bid.note}"
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`font-semibold ${
                            index === 0 ? "text-white" : "text-green"
                          }`}
                        >
                          £{bid.amount.toFixed(2)}
                        </span>
                        <p
                          className={`text-xs mt-0.5 ${
                            index === 0 ? "text-white/70" : "text-ink/40"
                          }`}
                        >
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
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-ink/10 py-4">
        <p className="text-center text-xs text-ink/30">
          Pete Shaw Memorial Golf Day 2026 · Raising funds for Woking Hospice
        </p>
      </footer>
    </div>
  );
}
