import { notFound } from "next/navigation";
import Link from "next/link";
import type { Bid } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import BidForm from "./BidForm";
import BidHistory from "./BidHistory";
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
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 pt-14 pb-8 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column: listing details */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-ink/50 hover:text-green transition-colors mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              All items
            </Link>

            {listing.emoji && (
              <div className="w-full h-40 bg-green-light rounded-lg flex items-center justify-center mb-6 text-7xl">
                {listing.emoji}
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
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-green/70 mb-1">
                    No bids yet
                  </p>
                  {listing.minimumBid > 0 ? (
                    <p className="text-lg text-ink/70">
                      Reserve{" "}
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
              minimumBid={Math.max(highestBid?.amount ?? 0, listing.minimumBid ?? 0)}
            />

            {/* Bid history — locked behind admin password */}
            <BidHistory bids={listing.bids as Bid[]} />
          </div>
        </div>
      </main>

      <Footer displayName={session.displayName} />
    </div>
  );
}
