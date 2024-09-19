import { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { TrainLineIds, TrainPositionSchema } from "~/lib/trainsSchema";

export const trainRouter = {
  positions: publicProcedure.output(TrainPositionSchema).query(async () => {
    if (!process.env.CTA_API_KEY) throw new Error("API Key is required");

    const url = new URL(
      "/api/1.0/ttpositions.aspx",
      "https://lapi.transitchicago.com"
    );
    url.searchParams.set("outputType", "JSON");
    url.searchParams.set("key", process.env.CTA_API_KEY);
    url.searchParams.set("rt", Object.values(TrainLineIds).join(","));

    const response = await fetch(url);
    return await response.json();
  }),
} satisfies TRPCRouterRecord;
