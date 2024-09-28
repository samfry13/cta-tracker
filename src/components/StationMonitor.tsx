import { Circle } from "react-leaflet";
import { trpc } from "~/lib/trpc";
import markers from "../../public/markers.json";
import stations from "../../public/stations.json";
import { StationDescription } from "./StationDescription";
import { MarkerSchema } from "~/lib/schemas/stations.schema";
import { z } from "zod";

const parsedMarkers = z.array(MarkerSchema).parse(markers);

export const StationMonitor = () => {
  const { data: trains } = trpc.trains.useQuery(undefined, {
    refetchInterval: 1e4, // 10 seconds
  });

  if (!trains || !stations) return null;

  return (
    <>
      {parsedMarkers.map((marker, i) => {
        const stopParentId = marker.mapId;

        const trainsApproaching = trains.ctatt.routes
          .find((route) => route.name === marker.line)
          ?.trains.filter(
            (train) =>
              train.nextStationId === stopParentId && train.isApproaching,
          );

        const hasTrains = trainsApproaching && trainsApproaching.length > 0;

        return (
          <Circle
            key={`stationMarker-${i}-${hasTrains}`}
            center={marker}
            radius={6}
            color={hasTrains ? "#ef4444" : "#3b82f6"}
          >
            <StationDescription stationId={marker.mapId} line={marker.line} />
          </Circle>
        );
      })}
    </>
  );
};
