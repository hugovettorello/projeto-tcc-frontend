"use client";

import { useTransition } from "react";
import { Check, Sparkles } from "lucide-react";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GetDailyPlan200TasksItem } from "@/app/_lib/api/fetch-generated";
import { completeTaskAction, uncompleteTaskAction } from "../actions";

function formatDuration(seconds: number): string {
  if (seconds === 0) return "Todo o dia";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m}`;
}

interface TaskCardProps {
  task: GetDailyPlan200TasksItem;
  weeklyPlanId: string;
  dailyPlanId: string;
}

export function TaskCard({ task, weeklyPlanId, dailyPlanId }: TaskCardProps) {
  const [isPending, startTransition] = useTransition();
  const [, setIsOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [, setTaskId] = useQueryState(
    "chat_task_id",
    parseAsString.withDefault(""),
  );
  const [, setInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault(""),
  );

  const toggleComplete = () => {
    startTransition(async () => {
      if (task.isCompleted) {
        await uncompleteTaskAction(task.id, weeklyPlanId, dailyPlanId);
      } else {
        await completeTaskAction(task.id, weeklyPlanId, dailyPlanId);
      }
    });
  };

  const handleAiClick = () => {
    setTaskId(task.id);
    setInitialMessage(
      `Quais as melhores formas de otimizar a execução da tarefa ${task.title}?`,
    );
    setIsOpen(true);
  };

  return (
    <div
      className={cn(
        "rounded-[20px] border border-foreground p-5 flex flex-col gap-4",
        task.isCompleted ? "bg-auth-brand" : "bg-background",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p
            className={cn(
              "font-bold text-lg text-foreground leading-tight",
              task.isCompleted && "line-through",
            )}
          >
            {task.title}
          </p>
          <p className="text-sm text-foreground/60">Descrição adicional</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleComplete}
          disabled={isPending}
          className={cn(
            "shrink-0 rounded-full size-8 border border-foreground p-0",
            task.isCompleted
              ? "bg-home-hero hover:bg-home-hero/90"
              : "bg-task-unchecked hover:bg-task-unchecked/90",
          )}
        >
          {task.isCompleted && <Check className="size-4 text-background" />}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="bg-home-hero rounded-full px-5 py-2 w-fit">
          <span className="font-bold text-background text-sm">
            {formatDuration(task.expectedDurationTimeInSeconds)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="bg-home-hero hover:bg-home-hero/90 rounded-full size-12 p-0"
          onClick={handleAiClick}
        >
          <Sparkles className="size-5 text-background" />
        </Button>
      </div>
    </div>
  );
}
