import React, { useRef, useCallback } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./App.module.scss";
import logo from "./dubai.png";

const UAE_CITIES = [
  { city: "Dubai", state: "Dubai", longitude: 55.274288, latitude: 25.197525 },
  {
    city: "Hatta",
    state: "Hatta",
    longitude: 56.11501308985721,
    latitude: 24.8049103414456,
  },
  {
    city: "Al mormoom",
    state: "Al mormoom",
    longitude: 55.36163,
    latitude: 24.707199,
  },
  {
    city: "Jabel Ali Expo area",
    state: "Jabel Ali Expo area",
    longitude: 55.06116,
    latitude: 25.01126,
  },
  // Add more cities here
];
const TOKEN =
  "pk.eyJ1IjoibWltaW8iLCJhIjoiY2l6ZjJoenBvMDA4eDJxbWVkd2IzZjR0ZCJ9.ppwGNP_-LS2K4jUvgXG2pA";

function ControlPanel(props) {
  return (
    <div className={styles.controlpanel}>
      {UAE_CITIES.map((city, index) => (
        <div key={`btn-${index}`} style={{ marginBottom: "10px" }}>
          <input
            type="radio"
            name="city"
            id={`city-${index}`}
            defaultChecked={city.city === "Dubai"}
            onClick={() => props.onSelectCity(city)}
          />
          <label className={styles.label} htmlFor={`city-${index}`}>
            {city.city}
          </label>
        </div>
      ))}
    </div>
  );
}

// export default React.memo(ControlPanel);

// Existing layers
const skyLayer = {
  id: "sky",
  type: "sky",
  paint: {
    "sky-type": "atmosphere",
    "sky-atmosphere-sun": [0.5, 5.0],
    "sky-atmosphere-sun-intensity": 15,
  },
};

const buildingLayer = {
  id: "3d-buildings",
  type: "fill-extrusion",
  source: "composite",
  "source-layer": "building",
  filter: ["==", "extrude", "true"],
  minzoom: 15,
  paint: {
    "fill-extrusion-color": "blue",
    "fill-extrusion-height": ["get", "height"],
    "fill-extrusion-base": ["get", "min_height"],
    "fill-extrusion-opacity": 0.6,
  },
};

// New heatmap layer
const heatMapLayer = {
  id: "heatmap-layer",
  type: "heatmap",
  source: "heatmap-source",
  maxzoom: 15,
  paint: {
    "heatmap-radius": 30,
    "heatmap-weight": ["get", "weight"],
  },
};

const mapD = {
  id: "add-3d-buildings",
  source: "composite",
  "source-layer": "building",
  filter: ["==", "extrude", "true"],
  type: "fill-extrusion",
  minzoom: 15,
  paint: {
    "fill-extrusion-color": "#a58a65",

    // Use an 'interpolate' expression to
    // add a smooth transition effect to
    // the buildings as the user zooms in.
    "fill-extrusion-height": [
      "interpolate",
      ["linear"],
      ["zoom"],
      15,
      0,
      15.05,
      ["get", "height"],
    ],
    "fill-extrusion-base": [
      "interpolate",
      ["linear"],
      ["zoom"],
      15,
      0,
      15.05,
      ["get", "min_height"],
    ],
    "fill-extrusion-opacity": 0.9,
  },
};

// Sample heatmap data
const heatMapData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [55.1562243, 25.091525] },
      properties: { weight: 5 },
    },
    // Add more heatmap points here
  ],
};

// Sports-related markers
const sportsMarkers = [
  { latitude: 25.091525, longitude: 55.1562243, name: "Dubai Sports City" },
  { latitude: 25.040857, longitude: 55.2184, name: "Zabeel Stadium" },
  // Add more sports locations here
];

const initialViewState = {
  latitude: 25.197525,
  longitude: 55.274288,
  zoom: 15.5,
  pitch: 60,
  bearing: 0.6,
  container: "map",
  antialias: true,
};

function App() {
  const mapRef = useRef(null);

  const onSelectCity = useCallback(({ longitude, latitude }) => {
    mapRef.current?.flyTo({ center: [longitude, latitude], duration: 5000 });
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={logo} alt="Dubai logo" className={styles.logo} />
      </header>
      <div className={styles.map}>
        <Map
          ref={mapRef}
          initialViewState={initialViewState}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          mapboxAccessToken={TOKEN}
        >
          <Source id="heatmap-source" type="geojson" data={heatMapData} />
          <Layer {...skyLayer} />
          <Layer {...mapD} />

          <Layer {...heatMapLayer} />

          {sportsMarkers.map((marker, index) => (
            <Marker
              key={index}
              latitude={marker.latitude}
              longitude={marker.longitude}
            >
              <div style={{ color: "gold" }}>{marker.name}</div>
            </Marker>
          ))}
          <ControlPanel onSelectCity={onSelectCity} />
        </Map>
      </div>
    </div>
  );
}

export default App;
