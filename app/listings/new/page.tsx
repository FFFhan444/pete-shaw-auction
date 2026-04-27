import Link from "next/link";
import { getSession } from "@/lib/session";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import NewListingForm from "./NewListingForm";

export default async function NewListingPage() {
  const session = await getSession();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar
        right={
          <Link href="/" className="text-white/70 text-sm hover:text-white transition-colors">
            ← Back to auction
          </Link>
        }
      />
      <NewListingForm />
      <Footer displayName={session.displayName} />
    </div>
  );
}
