import { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { TrainLineIds, TrainPositionSchema } from "~/lib/schemas/trains.schema";
import { z } from "zod";
import { StationSchema } from "~/lib/schemas/stations.schema";
import stationsData from "../../../public/stations.json";

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
  stations: publicProcedure.output(z.array(StationSchema)).query(async () => {
    return stationsData;
  }),
} satisfies TRPCRouterRecord;
