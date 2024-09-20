import { Circle, Popup } from "react-leaflet";
import { Train } from "~/lib/schemas/trains.schema";
import { trpc } from "~/lib/trpc";
import markers from "../../public/markers.json";

export const StationMonitor = () => {
  const { data: trains } = trpc.train.positions.useQuery(undefined, {
    refetchInterval: 1e4, // 10 seconds
  });
  const { data: stations } = trpc.train.stations.useQuery();

  if (!trains || !stations) return null;

  return (
    <>
      {markers.map((marker, i) => {
        const stopParentIds = Array.from(
          marker.stopIds.reduce<Set<string>>((parentIds, stopId) => {
            const stop = stations.find(
              (station) => station.stop_id === stopId
            )?.map_id;
            if (stop) parentIds.add(stop);

            return parentIds;
          }, new Set())
        );

        const trainsApproaching = stopParentIds
          .map((parentId) =>
            trains.ctatt.routes
              .find((route) => route.name === marker.line)
              ?.trains.filter(
                (train) =>
                  train.nextStationId === parentId && train.isApproaching
              )
          )
          .filter((trains): trains is Train[] => (trains?.length || 0) > 0)
          .reduce<Train[]>((t, c) => [...t, ...c], []);

        const hasTrains = trainsApproaching.length > 0;

        return (
          <Circle
            key={`stationMarker-${i}-${hasTrains}`}
            center={marker}
            radius={6}
            color={hasTrains ? "#FF0000" : "#0000FF"}
            fillOpacity={hasTrains ? 1 : 0.2}
          >
            {trainsApproaching.length > 0 && (
              <Popup>
                Trains Approaching:
                {trainsApproaching.map((train) => train.runId).join(", ")}
              </Popup>
            )}
          </Circle>
        );
      })}
    </>
  );
};
