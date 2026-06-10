import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import { authClient } from "./_lib/auth-client";
import { getHomeData } from "./_lib/api/fetch-generated";
import { redirectIfOnboardingRequired } from "./_lib/check-onboarding";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/navbar";
import { DailyPlanCard } from "./_components/daily-plan-card";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session?.data?.user) redirect("/auth");

  await redirectIfOnboardingRequired();

  const homeData = await getHomeData(dayjs().format("YYYY-MM-DD"));

  const firstName = session.data.user.name?.split(" ")[0] ?? "Usuário";
  const planning = homeData.status === 200 ? homeData.data.todayPlanning : null;
  const totalTasks = planning
    ? planning.completedTasks.length + planning.uncompletedTasks.length
    : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-home-hero rounded-b-[40px] h-[300px] flex flex-col justify-end">
        <div className="flex items-end justify-between p-6 pb-8">
          <div>
            <h1 className="font-space-grotesk font-bold text-5xl text-background leading-tight">
              Olá, {firstName}
            </h1>
            <p className="text-background/80 text-lg mt-1">
              Bora organizar sua rotina?
            </p>
          </div>
          <Button className="rounded-full bg-auth-brand text-background font-bold hover:bg-auth-brand/90 shrink-0">
            Bora!
          </Button>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5 pb-24 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-space-grotesk font-bold text-2xl text-foreground">
            Planejamento de Hoje
          </h2>
          {planning ? (
            <Button variant="link" className="p-0 h-auto text-sm font-normal underline" asChild>
              <Link href={`/weekly-plans/${planning.planningId}`}>
                ver planejamento semanal
              </Link>
            </Button>
          ) : (
            <Button variant="link" className="p-0 h-auto text-sm font-normal underline" disabled>
              ver planejamento semanal
            </Button>
          )}
        </div>

        {planning ? (
          <Link href={`/weekly-plans/${planning.planningId}/days/${planning.id}`}>
            <DailyPlanCard weekDay={planning.weekDay} tasksCount={totalTasks} />
          </Link>
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhum planejamento para hoje.
          </p>
        )}

        {planning && (
          <div className="flex gap-4">
            <div className="flex-1">
              <h3 className="font-space-grotesk font-bold text-lg text-foreground mb-3">
                Pendentes
              </h3>
              <div className="flex flex-col gap-4">
                {planning.uncompletedTasks.map((task, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Checkbox className="size-5 border-foreground mt-0.5" />
                    <span className="font-bold text-sm text-foreground leading-tight">
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {planning.completedTasks.length > 0 && (
              <div className="w-[45%]">
                <div className="border border-border bg-background rounded-tr-[20px] px-4 py-3">
                  <h3 className="font-space-grotesk font-bold text-lg text-foreground">
                    Concluídos
                  </h3>
                </div>
                <div className="bg-home-hero px-4 py-4 flex flex-col gap-3">
                  {planning.completedTasks.map((task, i) => (
                    <p
                      key={i}
                      className="font-bold text-background text-sm leading-tight"
                    >
                      {task.title}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
}
