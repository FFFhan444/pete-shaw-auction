import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export default async function HomePage() {
  const session = await getSession();
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      bids: { orderBy: { amount: "desc" }, take: 1 },
      _count: { select: { bids: true } },
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      {/* Hero label */}
      <div className="bg-green-light border-b border-green/20 pt-7">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col items-center text-center gap-0.5">
          <p className="text-green font-semibold text-base">
            Charity Auction — Raising funds for Woking Hospice
          </p>
          <p className="text-ink/50 text-sm">
            Thursday 4th June · Tyrrells Wood Golf Club
          </p>
        </div>
      </div>

      {/* Listings */}
      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing: Listing & { bids: { amount: number }[]; _count: { bids: number } }) => {
            const highestBid = listing.bids[0]?.amount;
            return (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="group bg-white rounded-lg border border-ink/10 overflow-hidden hover:border-green/40 hover:shadow-md transition-all flex flex-col"
              >
                {listing.imageUrl ? (
                  <div className="relative h-44 w-full bg-ink/5">
                    <Image
                      src={listing.imageUrl}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-44 w-full bg-green-light flex items-center justify-center">
                    <span className="text-green/40 text-4xl">⛳</span>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-lg font-semibold text-ink leading-snug group-hover:text-green transition-colors">
                    {listing.title}
                  </h2>
                  <p className="text-ink/60 text-sm mt-1 line-clamp-2 flex-1">
                    {listing.description}
                  </p>
                  <div className="mt-3 pt-3 border-t border-ink/10 flex items-center justify-between">
                    {highestBid != null ? (
                      <span className="text-green font-semibold text-base">
                        £{highestBid.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-ink/40 text-sm">No bids yet</span>
                    )}
                    <span className="text-xs text-ink/40">
                      {listing._count.bids}{" "}
                      {listing._count.bids === 1 ? "bid" : "bids"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Add item card — always last */}
          <Link
            href="/listings/new"
            className="group rounded-lg border-2 border-dashed border-ink/20 hover:border-green/50 hover:bg-green-light/40 transition-all flex flex-col items-center justify-center min-h-[220px] text-center"
          >
            <span className="text-3xl text-ink/20 group-hover:text-green/50 transition-colors mb-2">+</span>
            <span className="text-sm font-semibold text-ink/40 group-hover:text-green transition-colors">Add item</span>
          </Link>
        </div>
      </main>

      <Footer displayName={session.displayName} />
    </div>
  );
}
