import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/actions/auth";

interface Props {
  displayName?: string;
  right?: React.ReactNode;
}

export default function NavBar({ displayName, right }: Props) {
  return (
    <header className="bg-green text-white overflow-visible relative z-10">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 items-end pb-2 pt-3">
        {/* Left: username + sign out */}
        <div className="flex items-center gap-3 pb-1">
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

        {/* Centre: logo — oversized, overflows below nav */}
        <div className="flex justify-center">
          <Link href="/" className="block translate-y-6">
            <Image
              src="/logo.svg"
              alt="Pete Shaw Memorial Golf Day"
              width={182}
              height={96}
              priority
            />
          </Link>
        </div>

        {/* Right: slot for page-specific action */}
        <div className="flex justify-end pb-1">
          {right}
        </div>
      </div>
    </header>
  );
}
