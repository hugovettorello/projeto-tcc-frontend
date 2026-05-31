import { CalendarDays } from "lucide-react";

const weekDayLabels: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

interface DailyPlanCardProps {
  weekDay: string;
  tasksCount: number;
}

export function DailyPlanCard({ weekDay, tasksCount }: DailyPlanCardProps) {
  const weekDayLabel = weekDayLabels[weekDay] ?? weekDay;

  return (
    <div className="relative rounded-[24px] overflow-hidden h-[190px] bg-home-accent">
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        <div className="flex items-center gap-2 bg-home-hero rounded-full px-4 py-2 w-fit">
          <CalendarDays className="size-4 text-background" />
          <span className="font-bold text-background text-base">{weekDayLabel}</span>
        </div>
        <p className="font-bold text-background text-2xl">
          {tasksCount} {tasksCount === 1 ? "tarefa" : "tarefas"}
        </p>
      </div>
    </div>
  );
}
