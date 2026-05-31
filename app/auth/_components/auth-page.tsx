"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "./google-icon";

export function AuthPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.replace("/");
    }
  }, [isPending, session, router]);

  if (isPending || session) return null;

  const handleGoogleSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });
    if (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-auth-surface overflow-hidden">
      <div className="flex items-center justify-center gap-2 flex-[1] px-8">
        <h1 className="font-space-grotesk font-bold text-7xl leading-none">
          <span className="text-auth-text">Planej</span>
          <span className="text-auth-brand">AI</span>
        </h1>
        <div className="bg-auth-icon-bg rounded-full p-4 ml-1">
          <Sparkles className="size-8 text-auth-brand" />
        </div>
      </div>

      <div className="flex-[3] bg-gradient-to-b from-auth-card-from to-auth-card-to rounded-t-[50px] border-2 border-auth-text/20 flex flex-col justify-between px-8 pt-12 pb-10">
        <p className="text-auth-text-dark font-bold text-5xl leading-[1.15]">
          O seu companheiro na rotina!
        </p>

        <Button
          onClick={handleGoogleSignIn}
          className="w-full h-16 rounded-full text-lg font-semibold text-auth-text gap-3 bg-auth-surface hover:bg-auth-surface/90 border-0"
        >
          <GoogleIcon />
          Fazer login com o Google
        </Button>
      </div>
    </div>
  );
}
