import { logout } from "@/app/actions/auth";

interface Props {
  displayName?: string;
}

export default function Footer({ displayName }: Props) {
  return (
    <footer className="mt-auto border-t border-ink/10 py-4">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        <p className="text-xs text-ink/30">
          Pete Shaw Memorial Golf Day 2026 · Raising funds for Woking Hospice
        </p>
        {displayName && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink/40 hidden sm:block">{displayName}</span>
            <form action={logout}>
              <button className="text-xs text-ink/40 hover:text-ink transition-colors">
                Sign out
              </button>
            </form>
          </div>
        )}
      </div>
    </footer>
  );
}
