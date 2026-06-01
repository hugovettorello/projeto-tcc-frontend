import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/app/_lib/auth-client";
import { getWeeklyPlan } from "@/app/_lib/api/fetch-generated";
import { DailyPlanCard } from "@/app/_components/daily-plan-card";
import { Navbar } from "@/components/navbar";
import { BackButton } from "./_components/back-button";

interface Props {
  params: Promise<{ weeklyPlanId: string }>;
}

export default async function WeeklyPlanPage({ params }: Props) {
  const { weeklyPlanId } = await params;

  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session?.data?.user) redirect("/auth");

  const result = await getWeeklyPlan(weeklyPlanId);

  if (result.status !== 200) redirect("/");

  const weeklyPlan = result.data;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="relative flex items-center justify-center px-5 pt-5 pb-3 min-h-[60px]">
        <BackButton />
        <h1 className="font-space-grotesk font-bold text-xl text-foreground">
          Planejamento semanal
        </h1>
      </div>

      <div className="flex-1 px-5 pb-24 flex flex-col gap-4 pt-2">
        {weeklyPlan.dailyPlans.map((dailyPlan) => (
          <Link
            key={dailyPlan.id}
            href={`/weekly-plans/${weeklyPlanId}/days/${dailyPlan.id}`}
          >
            <DailyPlanCard
              weekDay={dailyPlan.weekDay}
              tasksCount={dailyPlan.tasksCount}
              backgroundImage="/plan-background.jpg"
            />
          </Link>
        ))}
      </div>

      <Navbar />
    </div>
  );
}
