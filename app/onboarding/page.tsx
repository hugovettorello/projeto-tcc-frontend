import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { OnboardingChat } from "./_components/onboarding-chat";

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session?.data?.user) redirect("/auth");

  return <OnboardingChat />;
}
