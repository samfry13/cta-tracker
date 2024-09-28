import { z } from "zod";

const ArrivalsErrorCodes = {
  None: "0",
  RequiredParameter: "100",
  InvalidApiKey: "101",
  MaximumApiUsageExceeded: "102",
  InvalidMapId: "103",
  InvalidMapType: "104",
  MaximumNumberOfMapIdsExceeded: "106",
  MaximumNumberOfRoutesExceeded: "107",
  InvalidStpId: "108",
  MaximumNumberOfStpIdsExceeded: "109",
  InvalidMax: "110",
  InvalidMaxType: "111",
  InvalidStpIdType: "112",
  InvalidParameter: "500",
  ServerError: "900",
} as const;
const ArrivalsErrorCodeSchema = z.nativeEnum(ArrivalsErrorCodes);

export const PredictionSchema = z
  .object({
    // Numeric GTFS parent station ID which this prediction is for (five digits in 4xxxx range) (matches “mapid” specified by requestor in query)
    staId: z.string(),

    // Numeric GTFS unique stop ID within station which this prediction is for (five digits in 3xxxx range)
    stpId: z.string(),

    // Textual proper name of parent station
    staNm: z.string(),

    // Textual description of platform for which this prediction applies
    stpDe: z.string(),

    // Run number of train being predicted for
    rn: z.string(),

    // Textual, abbreviated route name of train being predicted for (matches GTFS routes)
    rt: z.string(),

    // GTFS unique stop ID where this train is expected to ultimately end its service run (experimental and supplemental only—see note below)
    destSt: z.string(),

    // Friendly destination description (see note below)
    destNm: z.string(),

    // Numeric train route direction code (see appendices)
    trDr: z.string(),

    // Date-time format stamp for when the prediction was generated:
    // yyyyMMdd HH:mm:ss (24-hour format, time local to Chicago)
    prdt: z.string(),

    // Date-time format stamp for when a train is expected to arrive/depart:
    // yyyyMMdd HH:mm:ss (24-hour format, time local to Chicago)
    arrT: z.string(),

    // Indicates that Train Tracker is now declaring “Approaching” or “Due” on site for this train
    isApp: z.coerce.number().transform(Boolean),

    // Boolean flag to indicate whether this is a live prediction or based on schedule in lieu of live data
    isSch: z.coerce.number().transform(Boolean),

    // Boolean flag to indicate whether a potential fault has been detected (see note below)
    isFlt: z.coerce.number().transform(Boolean),

    // Boolean flag to indicate whether a train is considered “delayed” in Train Tracker
    isDly: z.coerce.number().transform(Boolean),

    // Train flags (not presently in use)
    // flags: z.string().nullable(),

    // Latitude position of the train in decimal degrees
    // lat: z.string().nullable(),

    // Longitude position of the train in decimal degrees
    // lon: z.string().nullable(),

    // Heading, expressed in standard bearing degrees (0 = North, 90 = East, 180 = South, and 270 = West; range is 0 to 359, progressing clockwise)
    // heading: z.string().nullable(),
  })
  .transform((arg) => ({
    stationId: arg.staId,
    stopId: arg.stpId,
    stationName: arg.staNm,
    stopDescription: arg.stpDe,
    runNumber: arg.rn,
    route: arg.rt,
    destinationStopId: arg.destSt,
    destinationStopName: arg.destNm,
    trainDirection: arg.trDr,
    predictionGeneratedAt: arg.prdt,
    estimatedTimeofArrival: arg.arrT,
    isApproaching: arg.isApp,
    isBasedOnSchedule: arg.isSch,
    faultDetected: arg.isFlt,
    isDelayed: arg.isDly,
  }));
export type Prediction = z.infer<typeof PredictionSchema>;

export const ArrivalsSchema = z.object({
  // Root element
  ctatt: z
    .object({
      // Shows time when response was generated in format:
      // yyyyMMdd HH:mm:ss (24-hour format, time local to Chicago)
      tmst: z.string(),

      // Numeric error code (see appendices)
      errCd: ArrivalsErrorCodeSchema,

      // Textual error description/message (see appendices)
      errNm: z.string().nullable(),

      // Container element (one per individual prediction)
      eta: PredictionSchema.or(z.array(PredictionSchema))
        .optional()
        .transform((arg) => (arg ? (Array.isArray(arg) ? arg : [arg]) : [])),
    })
    .transform((arg) => ({
      timeStamp: arg.tmst,
      errorCode: arg.errCd,
      errorName: arg.errNm,
      predictions: arg.eta,
    })),
});
