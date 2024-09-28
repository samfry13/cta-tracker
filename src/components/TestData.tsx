"use client";

import { intlFormatDistance } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { trpc } from "~/lib/trpc";

const DetailRow = ({ label, data }: { label: string; data?: string }) => (
  <div className="flex justify-between">
    <dt>{label}</dt>
    <dd>{data ?? "Unknown"}</dd>
  </div>
);

const Indicator = ({
  delayed,
  arriving,
}: {
  delayed: boolean;
  arriving: boolean;
}) => (
  <span className="relative flex h-3 w-3">
    {arriving && (
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
          delayed ? "bg-red-400" : "bg-sky-400"
        } opacity-75`}
      />
    )}
    <span
      className={`relative inline-flex rounded-full h-3 w-3 ${
        delayed ? "bg-red-500" : "bg-sky-500"
      }`}
    ></span>
  </span>
);

export const TestData = () => {
  const { data: positions } = trpc.trains.useQuery(undefined, {
    refetchInterval: 1e4, // 10 seconds
  });

  return (
    <div className="max-w-md m-auto space-y-2">
      {!positions && <div>Loading...</div>}
      {positions?.ctatt.routes.map((route) => (
        <>
          <details
            key={`route-${route.name}`}
            className="cursor-pointer space-y-2"
          >
            <summary>Route: {route.name}</summary>
            {route.trains.map((train) => {
              const eta = fromZonedTime(
                new Date(train.estimatedTimeOfArrival),
                "America/Chicago",
              );

              return (
                <details
                  key={`train-${train.runId}`}
                  className="pl-3 cursor-pointer"
                >
                  <summary className="flex gap-2 items-center">
                    Train: #{train.runId}
                    <Indicator
                      arriving={train.isApproaching}
                      delayed={train.isDelayed}
                    />
                  </summary>
                  <dl className="divide-y space-y-2 pl-3">
                    <DetailRow
                      label="Destination"
                      data={`${train.destinationName} (${train.destinationStopId})`}
                    />

                    <DetailRow
                      label="Next Station"
                      data={`${train.nextStationName} (${train.nextStationId})`}
                    />

                    <DetailRow
                      label="Expected Arrival"
                      data={`${intlFormatDistance(
                        eta,
                        new Date(),
                      )} (${eta.toLocaleTimeString()})`}
                    />

                    <DetailRow
                      label="Is Approaching"
                      data={train.isApproaching ? "yes" : "no"}
                    />

                    <DetailRow
                      label="Is Delayed"
                      data={train.isDelayed ? "yes" : "no"}
                    />
                  </dl>
                </details>
              );
            })}
          </details>
        </>
      ))}
    </div>
  );
};
