import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/actions/auth";

interface Props {
  displayName?: string;
  right?: React.ReactNode;
}

export default function NavBar({ displayName, right }: Props) {
  return (
    <header className="bg-green text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 grid grid-cols-3 items-center">
        {/* Left: username + sign out */}
        <div className="flex items-center gap-3">
          {displayName && (
            <>
              <span className="text-sm opacity-80 hidden sm:block truncate max-w-[140px]">
                {displayName}
              </span>
              <form action={logout}>
                <button className="text-white/60 text-sm hover:text-white transition-colors whitespace-nowrap">
                  Sign out
                </button>
              </form>
            </>
          )}
        </div>

        {/* Centre: logo */}
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Pete Shaw Memorial Golf Day"
              width={91}
              height={48}
              priority
            />
          </Link>
        </div>

        {/* Right: slot for page-specific action */}
        <div className="flex justify-end">
          {right}
        </div>
      </div>
    </header>
  );
}
