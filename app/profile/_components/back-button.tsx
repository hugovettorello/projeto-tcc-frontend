"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.back()}
      className="absolute left-5 top-5 z-20 text-background hover:bg-background/10 hover:text-background"
    >
      <ChevronLeft className="size-7" />
    </Button>
  );
}
