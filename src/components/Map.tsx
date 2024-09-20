"use client";

import "leaflet/dist/leaflet.css";
import { ImageOverlay, MapContainer } from "react-leaflet";
import { CRS } from "leaflet";
// import { StationCreator } from "./StationCreator";
import { StationMonitor } from "./StationMonitor";

export default function Map() {
  return (
    <MapContainer
      crs={CRS.Simple}
      center={[303, 640]}
      zoom={0}
      zoomSnap={0.1}
      zoomDelta={0.1}
      scrollWheelZoom
      doubleClickZoom={false}
      style={{ height: "100%" }}
    >
      <ImageOverlay
        url="map.png"
        bounds={[
          [0, 0],
          [607, 2560],
        ]}
      />

      {/* <StationCreator /> */}
      <StationMonitor />
    </MapContainer>
  );
}
