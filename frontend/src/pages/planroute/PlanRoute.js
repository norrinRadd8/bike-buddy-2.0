import "./planroute.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import Instructions from "../../components/Instructions";

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function PlanRoute() {
  const [data, setData] = useState(null); // add state for the data object

  useEffect(() => {
    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/hal888/clfl4vcde00eq01o4hy3yymbs",
      center: [-0.118092, 51.509865],
      zoom: 15,
    });
    const start = [-0.118092, 51.509865];

    // create a function to make a directions request

    async function getRoute(end) {
      if (!end) {
        return;
      }

      console.log(end);
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: "GET" }
      );
      const json = await query.json();

      if (!json || !json.routes || json.routes.length === 0) {
        console.error("Invalid response from API");
        return;
      }

      const data = json.routes[0];
      setData(data);
      const route = data.geometry.coordinates;
      const geojson = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: route,
        },
      };

      if (map.getSource("route")) {
        map.getSource("route").setData(geojson);
      } else {
        map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: geojson,
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }
    }

    map.on("load", () => {
      // make an initial directions request that
      // starts and ends at the same location
      getRoute(start);

      // Add starting point to the map
      map.addLayer({
        id: "point",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: start,
                },
              },
            ],
          },
        },
        layout: {
          "icon-image": "marker",
          "icon-size": 1.5,
          "icon-allow-overlap": true,
        },
      });

      map.on("click", (event) => {
        const coords = Object.keys(event.lngLat).map(
          (key) => event.lngLat[key]
        );
        const end = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: coords,
              },
            },
          ],
        };
        if (map.getLayer("end")) {
          map.getSource("end").setData(end);
        } else {
          map.addLayer({
            id: "end",
            type: "circle",
            source: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "Point",
                      coordinates: coords,
                    },
                  },
                ],
              },
            },
            paint: {
              "circle-radius": 10,
              "circle-color": "#f30",
            },
          });
        }
        getRoute(coords);
      });
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
    <>
      <div
        id="map"
        style={{ position: "absolute", top: 80, bottom: 0, width: "100%" }}
      />
      <Instructions data={data} />
    </>
  );
}

export default PlanRoute;
