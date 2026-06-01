import Image from "next/image";
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
  tasksCount?: number;
  title?: string;
  backgroundImage?: string;
}

export function DailyPlanCard({ weekDay, tasksCount, title, backgroundImage }: DailyPlanCardProps) {
  const weekDayLabel = weekDayLabels[weekDay] ?? weekDay;

  return (
    <div className="relative rounded-[24px] overflow-hidden h-[190px] bg-home-accent">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover opacity-60"
        />
      )}
      <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
        <div className="flex items-center gap-2 bg-home-hero rounded-full px-4 py-2 w-fit">
          <CalendarDays className="size-4 text-background" />
          <span className="font-bold text-background text-base">{weekDayLabel}</span>
        </div>
        {title ? (
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
