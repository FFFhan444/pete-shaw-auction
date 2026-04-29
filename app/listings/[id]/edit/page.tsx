import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import EditListingForm from "./EditListingForm";

export default async function EditListingPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const session = await getSession();

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <EditListingForm listing={listing} />
      <Footer displayName={session.displayName} />
    </div>
  );
}
