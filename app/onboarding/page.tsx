import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { authClient } from "@/app/_lib/auth-client";
import { getMe, getHomeData } from "@/app/_lib/api/fetch-generated";
import { OnboardingChat } from "./_components/onboarding-chat";

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session?.data?.user) redirect("/auth");

  const [meResult, homeResult] = await Promise.all([
    getMe(),
    getHomeData(dayjs().format("YYYY-MM-DD")),
  ]);

  const initialIsComplete =
    meResult.status === 200 &&
    meResult.data !== null &&
    homeResult.status === 200;

  return <OnboardingChat initialIsComplete={initialIsComplete} />;
}
