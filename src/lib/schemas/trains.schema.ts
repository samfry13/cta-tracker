import { z } from "zod";
import { ValueOf } from "../utils";

export const TrainDirection = {
  Northbound: "1",
  Southbound: "5",
} as const;
const TrainDirectionSchema = z.nativeEnum(TrainDirection);

export const TrainLineIds = {
  Red: "red",
  Blue: "blue",
  Brown: "brn",
  Green: "g",
  Orange: "org",
  Purple: "p",
  Pink: "pink",
  Yellow: "y",
} as const;
export const TrainLineIdSchema = z.nativeEnum(TrainLineIds);
export type TrainLineId = ValueOf<typeof TrainLineIds>;

const LocationsErrorCodes = {
  None: "0",
  RequiredParameter: "100",
  InvalidApiKey: "101",
  MaximumApiUsageExceeded: "102",
  InvalidRouteIdentifier: "106",
  MaximumNumberOfRoutesExceeded: "107",
  InvalidParameter: "500",
} as const;
const LocationsErrorCodeSchema = z.nativeEnum(LocationsErrorCodes);

const TrainSchema = z
  .object({
    // Run number
    rn: z.coerce.number(),

    //GTFS unique stop ID where this train is expected to ultimately end its service run (experimental and supplemental only—see note below)
    destSt: z.any(), // TODO: create enum

    // Friendly destination description (see note below)
    destNm: z.string(),

    // Numeric train route direction code (see appendices)
    trDr: TrainDirectionSchema,

    // Next station ID (parent station ID matching GTFS)
    nextStaId: z.any(), // TODO: create enum

    // Next stop ID (stop ID matching GTFS)
    nextStpId: z.any(), // TODO: create enum

    // Proper name of next station
    nextStaNm: z.string(),

    // Date-time format stamp for when the prediction was generated
    prdt: z.string(),

    // Date-time format stamp for when a train is expected to arrive/depart
    arrT: z.string(),

    // Indicates that Train Tracker is now declaring “Approaching” or “Due” on site for this train
    isApp: z.coerce.number().transform(Boolean),

    // Boolean flag to indicate whether a train is considered “delayed” in Train Tracker
    isDly: z.coerce.number().transform(Boolean),

    // Train flags (not presently in use)
    // flags: z.any().nullable(),

    // Latitude position of the train in decimal degrees
    // lat: z.coerce.number(),

    // Longitude position of the train in decimal degrees
    // long: z.coerce.number(),

    // Heading, expressed in standard bearing degrees (0 = North, 90 = East, 180 = South, and 270 = West; range is 0 to 359, progressing clockwise)
    // heading: z.coerce.number(),
  })
  .transform((arg) => ({
    runId: arg.rn,
    destinationStopId: arg.destSt,
    destinationName: arg.destNm,
    direction: arg.trDr,
    nextStationId: arg.nextStaId,
    nextStopId: arg.nextStpId,
    nextStationName: arg.nextStaNm,
    predictionGeneratedAt: arg.prdt,
    estimatedTimeOfArrival: arg.arrT,
    isApproaching: arg.isApp,
    isDelayed: arg.isDly,
  }));
export type Train = z.infer<typeof TrainSchema>;

const RouteSchema = z
  .object({
    // indicates route per GTFS-matching route identifiers
    "@name": TrainLineIdSchema,

    // Container element (one per train in response)
    train: TrainSchema.or(z.array(TrainSchema))
      .optional()
      .transform((arg) => (arg ? (Array.isArray(arg) ? arg : [arg]) : [])),
  })
  .transform((arg) => ({
    name: arg["@name"],
    trains: arg.train,
  }));

export const TrainPositionSchema = z.object({
  // Root element
  ctatt: z
    .object({
      // Shows time when response was generated
      tmst: z.coerce.date(),

      // Numeric error code
      errCd: LocationsErrorCodeSchema,

      // Textual error description/message
      errNm: z.string().nullable(),

      // Container element (one per route in response)
      route: z.array(RouteSchema),
    })
    .transform((arg) => ({
      timeStamp: arg.tmst,
      errorCode: arg.errCd,
      errorName: arg.errNm,
      routes: arg.route,
    })),
});
export type TrainPositions = z.infer<typeof TrainPositionSchema>;
