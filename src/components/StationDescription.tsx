import { intlFormatDistance } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { Popup } from "leaflet";
import { useRef, useState } from "react";
import { Popup as PopupComponent, useMapEvents } from "react-leaflet";
import { twMerge } from "tailwind-merge";
import { TrainLineIds, type TrainLineId } from "~/lib/schemas/trains.schema";
import { trpc } from "~/lib/trpc";
import stations from "../../public/stations.json";

export const StationDescription = ({
  stationId,
  line,
}: {
  stationId: string;
  line: TrainLineId;
}) => {
  const popupRef = useRef<Popup | null>(null);
  const [isOpen, setisOpen] = useState(false);

  const {
    data: arrivals,
    isLoading,
    isFetching,
  } = trpc.arrivals.useQuery(
    {
      stationId,
      line,
      limit: 3,
    },
    {
      enabled: isOpen,
      gcTime: 0, // garbage collect as soon as the popup closes
      refetchInterval: 1e4, // while the popup is open, refetch every 10 seconds
    },
  );

  useMapEvents({
    popupopen: (e) => {
      if (e.popup === popupRef.current) setisOpen(true);
    },
    popupclose: (e) => {
      if (e.popup === popupRef.current) setisOpen(false);
    },
  });

  const station = stations.find((station) => station.map_id === stationId);

  return (
    <PopupComponent
      className="[&_.leaflet-popup-content-wrapper]:rounded-lg [&_.leaflet-popup-content-wrapper]:overflow-hidden [&_.leaflet-popup-content-wrapper]:p-0 [&_.leaflet-popup-content]:m-0"
      ref={popupRef}
      closeButton={false}
    >
      <div
        className={twMerge(
          "bg-gradient-to-r from-white from-50% p-2 shadow-lg font-semibold relative",
          line === TrainLineIds.Red && "to-red-500",
          line === TrainLineIds.Blue && "to-blue-500",
          line === TrainLineIds.Brown && "to-yellow-950",
          line === TrainLineIds.Green && "to-green-500",
          line === TrainLineIds.Orange && "to-orange-500",
          line === TrainLineIds.Purple && "to-purple-500",
          line === TrainLineIds.Pink && "to-pink-500",
          line === TrainLineIds.Yellow && "to-yellow-500",
          isFetching &&
            "before:absolute before:left-0 before:bottom-0 before:right-0 before:h-0.5 before:bg-blue-500 before:animate-pulse",
        )}
      >
        {station?.station_name}
      </div>
      <div className="min-w-36">
        {isLoading && (
          <div className="p-1 flex flex-col divide-y">
            <div className="w-full p-1">
              <div className="w-full h-4 bg-slate-300 rounded-md animate-pulse" />
            </div>
            <div className="w-full p-1">
              <div className="w-full h-4 bg-slate-300 rounded-md animate-pulse" />
            </div>
            <div className="w-full p-1">
              <div className="w-full h-4 bg-slate-300 rounded-md animate-pulse" />
            </div>
          </div>
        )}
        {!isLoading && (
          <ul className="p-1 flex flex-col divide-y">
            {arrivals?.ctatt.predictions.map((arrival) => {
              const estimatedTimeofArrival = fromZonedTime(
                new Date(arrival.estimatedTimeofArrival),
                "America/Chicago",
              );
              const predictionGeneratedAt = fromZonedTime(
                new Date(arrival.predictionGeneratedAt),
                "America/Chicago",
              );

              const calculatedEta = intlFormatDistance(
                estimatedTimeofArrival,
                predictionGeneratedAt,
                { style: "short" },
              );

              return (
                <li
                  key={`station-${stationId}-run-${arrival.runNumber}`}
                  className="flex justify-between py-1 gap-4"
                >
                  <span>{arrival.destinationStopName}</span>
                  <span>
                    {arrival.isApproaching ? "Approaching" : calculatedEta}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PopupComponent>
  );
};
