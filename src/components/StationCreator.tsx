import { Circle, Popup, useMapEvents } from "react-leaflet";
import { z } from "zod";
import { EditingMarkerSchema } from "~/lib/schemas/stations.schema";
import { TrainLineId, TrainLineIds } from "~/lib/schemas/trains.schema";
import { roundToNearestQuarter, useLocalStorage } from "~/lib/utils";
import stations from "../../public/stations.json";

export const StationCreator = () => {
  const [markers, setMarkers] = useLocalStorage(
    "stations",
    z.array(EditingMarkerSchema),
    [],
  );
  useMapEvents({
    click({ latlng: { lat, lng } }) {
      setMarkers((prev) => [
        ...prev,
        {
          lat: roundToNearestQuarter(lat),
          lng: roundToNearestQuarter(lng),
          stopIds: [],
        },
      ]);
    },
  });

  const updateObjectValueAtIndex = <
    TObj extends object,
    TKey extends keyof TObj,
  >(
    array: TObj[],
    index: number,
    key: TKey,
    newValue: TObj[TKey],
  ) => {
    return array.map((prevValue, i) =>
      index === i ? { ...prevValue, [key]: newValue } : prevValue,
    );
  };

  const getArrayUpdater =
    <TObj extends object>(
      array: TObj[],
      updater: (newValues: TObj[]) => void,
    ) =>
    <TKey extends keyof TObj>(i: number, key: TKey, newValue: TObj[TKey]) =>
      updater(updateObjectValueAtIndex(array, i, key, newValue));

  const updateMarker = getArrayUpdater(markers, setMarkers);

  return (
    <>
      {markers.map((marker, i) => (
        <Circle
          key={`marker-${i}`}
          center={marker}
          radius={6}
          eventHandlers={{
            dblclick() {
              setMarkers((prev) => prev.filter((_, index) => index !== i));
            },
          }}
        >
          <Popup>
            <div className="flex flex-col gap-4 divide-y">
              <div className="flex flex-col gap-2">
                What stops are here?
                {marker.stopIds.map((stop, stopIndex) => (
                  <div
                    className="flex gap-2"
                    key={`marker-${i}-stopInput-${stopIndex}`}
                  >
                    <input
                      className="border rounded-md"
                      list="stations"
                      value={stop}
                      onChange={(e) =>
                        updateMarker(
                          i,
                          "stopIds",
                          marker.stopIds.map((prevStop, ind) =>
                            ind === stopIndex ? e.target.value : prevStop,
                          ),
                        )
                      }
                    />
                    <button
                      onClick={() =>
                        updateMarker(
                          i,
                          "stopIds",
                          marker.stopIds.filter((_, ind) => ind !== stopIndex),
                        )
                      }
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    updateMarker(i, "stopIds", [...marker.stopIds, ""])
                  }
                >
                  + Add Stop
                </button>
                <datalist id="stations">
                  {stations?.map((station) => (
                    <option key={station.stop_id} value={station.stop_id}>
                      {station.station_descriptive_name} - {station.stop_name}
                    </option>
                  ))}
                </datalist>
              </div>

              <div className="flex flex-col gap-2">
                What Line is this?
                <select
                  value={marker.line}
                  onChange={(e) =>
                    updateMarker(i, "line", e.target.value as TrainLineId)
                  }
                >
                  <option>Line...</option>
                  {(
                    Object.keys(TrainLineIds) as Array<
                      keyof typeof TrainLineIds
                    >
                  ).map((id) => (
                    <option key={`trainOption-${id}`} value={TrainLineIds[id]}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                Coordinates
                <input
                  type="number"
                  step={0.25}
                  value={marker.lat}
                  onChange={(e) =>
                    updateMarker(i, "lat", Number(e.target.value))
                  }
                />
                <input
                  type="number"
                  step={0.25}
                  value={marker.lng}
                  onChange={(e) =>
                    updateMarker(i, "lng", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </Popup>
        </Circle>
      ))}
    </>
  );
};
