import {
  TrainLineIds,
  TrainLineIdSchema,
  TrainPositionSchema,
} from "~/lib/schemas/trains.schema";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { ArrivalsSchema } from "~/lib/schemas/arrivals.schema";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),

  trains: publicProcedure.output(TrainPositionSchema).query(async () => {
    if (!process.env.CTA_API_KEY) throw new Error("API Key is required");

    const url = new URL(
      "/api/1.0/ttpositions.aspx",
      "https://lapi.transitchicago.com",
    );
    url.searchParams.set("outputType", "JSON");
    url.searchParams.set("key", process.env.CTA_API_KEY);
    url.searchParams.set("rt", Object.values(TrainLineIds).join(","));

    const response = await fetch(url);
    return await response.json();
  }),

  arrivals: publicProcedure
    .input(
      z.object({
        stationId: z.string(),
        line: TrainLineIdSchema,
        limit: z.number().optional(),
      }),
    )
    .output(ArrivalsSchema)
    .query(async ({ input: { stationId, line, limit = 2 } }) => {
      if (!process.env.CTA_API_KEY) throw new Error("API Key is required");

      const url = new URL(
        "/api/1.0/ttarrivals.aspx",
        "https://lapi.transitchicago.com",
      );
      url.searchParams.set("outputType", "JSON");
      url.searchParams.set("key", process.env.CTA_API_KEY);
      url.searchParams.set("mapid", stationId);
      url.searchParams.set("rt", line);
      url.searchParams.set("max", limit.toString());

      const response = await fetch(url);
      return await response.json();
    }),
});

export type AppRouter = typeof appRouter;
