import { getSession } from "@/lib/session";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import NewListingForm from "./NewListingForm";

export default async function NewListingPage() {
  const session = await getSession();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <NewListingForm />
      <Footer displayName={session.displayName} />
    </div>
  );
}
