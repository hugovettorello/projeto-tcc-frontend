import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { getMe, getHomeData } from "./api/fetch-generated";

export async function redirectIfOnboardingRequired() {
  const [meResult, homeResult] = await Promise.all([
    getMe(),
    getHomeData(dayjs().format("YYYY-MM-DD")),
  ]);

  const hasReasonForProcrastination = meResult.status === 200 && meResult.data !== null;
  const hasActiveWeeklyPlan = homeResult.status === 200;

  console.log("Onboarding check:", { hasReasonForProcrastination, hasActiveWeeklyPlan });
  if (!hasReasonForProcrastination || !hasActiveWeeklyPlan) {
    redirect("/onboarding");
  }
}
