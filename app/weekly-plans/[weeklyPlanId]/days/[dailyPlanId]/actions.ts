"use server";

import { revalidatePath } from "next/cache";
import {
  completeTask,
  uncompleteTask,
} from "@/app/_lib/api/fetch-generated";

export async function completeTaskAction(
  taskId: string,
  weeklyPlanId: string,
  dailyPlanId: string
) {
  await completeTask(taskId);
  revalidatePath(`/weekly-plans/${weeklyPlanId}/days/${dailyPlanId}`);
}

export async function uncompleteTaskAction(
  taskId: string,
  weeklyPlanId: string,
  dailyPlanId: string
) {
  await uncompleteTask(taskId);
  revalidatePath(`/weekly-plans/${weeklyPlanId}/days/${dailyPlanId}`);
}
