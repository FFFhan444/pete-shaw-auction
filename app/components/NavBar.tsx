import Image from "next/image";
import Link from "next/link";

interface Props {
  right?: React.ReactNode;
}

export default function NavBar({ right }: Props) {
  return (
    <header className="bg-green text-white overflow-visible relative z-10">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 items-end pb-2 pt-3">
        {/* Left: empty or reserved */}
        <div />

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
