"use client";

import Link from "next/link";
import { CircleUser, Home, Sparkles } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [, setIsOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-home-nav rounded-t-[30px] z-50">
      <div className="flex items-center justify-between px-10 h-[70px]">
        <Link href="/" aria-label="Início">
          <Home className="size-7 text-background stroke-[1.5]" />
        </Link>
        <Button
          variant="ghost"
          className="bg-home-hero hover:bg-home-hero/90 rounded-full p-3.5 h-auto w-auto"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir assistente IA"
        >
          <Sparkles className="size-7 text-background" />
        </Button>
        <Link href="/profile" aria-label="Perfil">
          <CircleUser className="size-7 text-background/70 stroke-[1.5]" />
        </Link>
      </div>
    </nav>
  );
}
