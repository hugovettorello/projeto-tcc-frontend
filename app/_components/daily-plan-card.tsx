import Image from "next/image";
import { CalendarDays, CheckCheck, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  tasksCount?: number;
  title?: string;
  backgroundImage?: string;
  isRest?: boolean;
  allTasksCompleted?: boolean;
}

export function DailyPlanCard({ weekDay, tasksCount, title, backgroundImage, isRest, allTasksCompleted }: DailyPlanCardProps) {
  const weekDayLabel = weekDayLabels[weekDay] ?? weekDay;
  const showCompleted = allTasksCompleted && !isRest && (tasksCount ?? 0) > 0;

  return (
    <div className={cn(
      "relative rounded-[24px] overflow-hidden h-[190px]",
      isRest ? "bg-secondary" : "bg-home-accent",
    )}>
      {!isRest && backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover opacity-60"
        />
      )}
      <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
        <div className="flex items-center justify-between">
          <div className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 w-fit",
            isRest ? "bg-muted" : "bg-home-hero",
          )}>
            {isRest
              ? <Moon className="size-4 text-muted-foreground" />
              : <CalendarDays className="size-4 text-background" />
            }
            <span className={cn(
              "font-bold text-base",
              isRest ? "text-muted-foreground" : "text-background",
            )}>
              {weekDayLabel}
            </span>
          </div>
          {showCompleted && (
            <div className="flex items-center gap-1.5 bg-background/20 rounded-full px-3 py-1.5">
              <CheckCheck className="size-3.5 text-background" />
              <span className="text-background text-xs font-semibold">Concluído</span>
            </div>
          )}
        </div>
        {isRest ? (
          <p className="font-bold text-secondary-foreground text-2xl">Dia de descanso</p>
        ) : title ? (
          <p className="font-bold text-background text-xl">{title}</p>
        ) : (
          <p className="font-bold text-background text-2xl">
            {tasksCount ?? 0} {(tasksCount ?? 0) === 1 ? "tarefa" : "tarefas"}
          </p>
        )}
      </div>
    </div>
  );
}
