import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authClient } from "@/app/_lib/auth-client";
import {
  getDailyPlan,
  completeAllDailyPlanTask,
} from "@/app/_lib/api/fetch-generated";
import { DailyPlanCard } from "@/app/_components/daily-plan-card";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { BackButton } from "./_components/back-button";
import { TaskCard } from "./_components/task-card";

interface Props {
  params: Promise<{ weeklyPlanId: string; dailyPlanId: string }>;
}

export default async function DailyPlanPage({ params }: Props) {
  const { weeklyPlanId, dailyPlanId } = await params;

  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session?.data?.user) redirect("/auth");

  const result = await getDailyPlan(weeklyPlanId, dailyPlanId);

  if (result.status !== 200) redirect("/");

  const dailyPlan = result.data;

  async function completeAllTasks() {
    "use server";
    await completeAllDailyPlanTask(dailyPlanId);
    revalidatePath(`/weekly-plans/${weeklyPlanId}/days/${dailyPlanId}`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="relative flex items-center justify-center px-5 pt-5 pb-3 min-h-[60px]">
        <BackButton />
        <h1 className="font-space-grotesk font-bold text-xl text-foreground">
          Planejamento de Hoje
        </h1>
      </div>

      <div className="flex-1 px-5 pb-24 flex flex-col gap-4">
        <DailyPlanCard weekDay={dailyPlan.weekDay} title={dailyPlan.title} />

        {dailyPlan.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            weeklyPlanId={weeklyPlanId}
            dailyPlanId={dailyPlanId}
          />
        ))}

        <div className="flex justify-center pt-2">
          <form action={completeAllTasks}>
            <Button
              type="submit"
              variant="outline"
              className="rounded-[15px] border-foreground font-normal px-8"
            >
              Marcar todas como concluídas
            </Button>
          </form>
        </div>
      </div>

      <Navbar />
    </div>
  );
}
