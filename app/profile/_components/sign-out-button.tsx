"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const { error } = await authClient.signOut();
    if (!error) router.push("/auth");
  }

  return (
    <Button
      variant="ghost"
      className="flex items-center gap-3 text-foreground font-bold text-xl h-auto py-3"
      onClick={handleSignOut}
    >
      Sair da conta
      <LogOut className="size-6" />
    </Button>
  );
}
