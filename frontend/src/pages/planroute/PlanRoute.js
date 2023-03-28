import "./planroute.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function PlanRoute() {
  useEffect(() => {
    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/hal888/clfl4vcde00eq01o4hy3yymbs",
      center: [-0.118092, 51.509865],
      zoom: 13,
    });

    // CREATED GEOCODER SEARCH BAR
    const geocoderContainer = document.createElement("div");
    geocoderContainer.className = "geocoder-container";

    const mapContainer = map.getContainer();
    mapContainer.insertBefore(geocoderContainer, mapContainer.firstChild);

    // GEOCODER CONTROL IN THE CONTAINER
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Search for a location",
    });
    geocoderContainer.appendChild(geocoder.onAdd(map));

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      id="map"
      style={{ position: "absolute", top: 80, bottom: 0, width: "100%" }}
    />
  );
}

export default PlanRoute;
