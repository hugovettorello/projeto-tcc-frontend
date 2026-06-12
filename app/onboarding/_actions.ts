"use server";

import dayjs from "dayjs";
import { getMe, getHomeData } from "@/app/_lib/api/fetch-generated";

export async function checkOnboardingComplete(): Promise<boolean> {
  const [meResult, homeResult] = await Promise.all([
    getMe(),
    getHomeData(dayjs().format("YYYY-MM-DD")),
  ]);

  return (
    meResult.status === 200 &&
    meResult.data !== null &&
    homeResult.status === 200
  );
}
