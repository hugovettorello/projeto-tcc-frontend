import Link from "next/link";
import { CircleUser, Home, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-home-nav rounded-t-[30px] z-50">
      <div className="flex items-center justify-between px-10 h-[70px]">
        <Link href="/" aria-label="Início">
          <Home className="size-7 text-background stroke-[1.5]" />
        </Link>
        <div className="bg-home-hero rounded-full p-3.5">
          <Sparkles className="size-7 text-background" />
        </div>
        <Link href="/profile" aria-label="Perfil">
          <CircleUser className="size-7 text-background/70 stroke-[1.5]" />
        </Link>
      </div>
    </nav>
  );
}
