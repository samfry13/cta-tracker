import { z } from "zod";
import { TrainLineIdSchema } from "./trains.schema";

export const StationSchema = z.object({
  stop_id: z.string(),
  direction_id: z.string(),
  stop_name: z.string(),
  station_name: z.string(),
  station_descriptive_name: z.string(),
  map_id: z.string(),
  ada: z.boolean(),
  red: z.boolean(),
  blue: z.boolean(),
  g: z.boolean(),
  brn: z.boolean(),
  p: z.boolean(),
  pexp: z.boolean(),
  y: z.boolean(),
  pnk: z.boolean(),
  o: z.boolean(),
});
export type Station = z.infer<typeof StationSchema>;

export const MarkerSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  stopIds: z.array(z.string()),
  mapId: z.string(),
  line: TrainLineIdSchema,
});
export type Marker = z.infer<typeof MarkerSchema>;
