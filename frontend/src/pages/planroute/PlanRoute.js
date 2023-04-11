import "./planroute.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import Instructions from "../../components/Instructions";

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
      // add turn instructions here at the end
    }

    map.on("load", () => {
      // make an initial directions request that
      // starts and ends at the same location
      getRoute(start);

      // Add starting point to the map
      map.addLayer({
        id: "point",
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
                  coordinates: start,
                },
              },
            ],
          },
        },
        paint: {
          "circle-radius": 10,
          "circle-color": "#3887be",
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
      <Instructions />
    </>
  );
}

export default PlanRoute;

// import "./planroute.css";
// import "mapbox-gl/dist/mapbox-gl.css";
// import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import React, { useEffect } from "react";
// import mapboxgl from "mapbox-gl";

// const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

// // create a function to make a directions request
// async function getRoute(map, start, end) {
//   // make a directions request using cycling profile
//   // an arbitrary start will always be the same
//   // only the end or destination will change

//   const query = await fetch(
//     `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
//     { method: "GET" }
//   );
//   const json = await query.json();
//   const data = json.routes[0];
//   const route = data.geometry.coordinates;
//   const geojson = {
//     type: "Feature",
//     properties: {},
//     geometry: {
//       type: "LineString",
//       coordinates: route,
//     },
//   };
//   // if the route already exists on the map, we'll reset it using setData
//   if (map.getSource("route")) {
//     map.getSource("route").setData(geojson);
//   }
//   // otherwise, we'll make a new request
//   else {
//     map.addLayer({
//       id: "route",
//       type: "line",
//       source: {
//         type: "geojson",
//         data: geojson,
//       },
//       layout: {
//         "line-join": "round",
//         "line-cap": "round",
//       },
//       paint: {
//         "line-color": "#3887be",
//         "line-width": 5,
//         "line-opacity": 0.75,
//       },
//     });
//   }
//   // add turn instructions here at the end
// }

// function PlanRoute() {
//   useEffect(() => {
//     mapboxgl.accessToken = accessToken;

//     const map = new mapboxgl.Map({
//       container: "map",
//       // style: "mapbox://styles/mapbox/streets-v12",
//       style: "mapbox://styles/hal888/clfl4vcde00eq01o4hy3yymbs",
//       center: [-0.118092, 51.509865],
//       zoom: 13,
//     });
//     const start = [-122.662323, 45.523751];

//     // CREATED GEOCODER SEARCH BAR
//     const geocoderContainer = document.createElement("div");
//     geocoderContainer.className = "geocoder-container";

//     const mapContainer = map.getContainer();
//     mapContainer.insertBefore(geocoderContainer, mapContainer.firstChild);

//     // GEOCODER CONTROL IN THE CONTAINER
//     const geocoder = new MapboxGeocoder({
//       accessToken: mapboxgl.accessToken,
//       mapboxgl: mapboxgl,
//       placeholder: "Search for a location",
//     });
//     geocoderContainer.appendChild(geocoder.onAdd(map));

//     map.on("load", () => {
//       // make an initial directions request that
//       // starts and ends at the same location
//       getRoute(map, start);

//       // Add starting point to the map
//       map.addLayer({
//         id: "point",
//         type: "circle",
//         source: {
//           type: "geojson",
//           data: {
//             type: "FeatureCollection",
//             features: [
//               {
//                 type: "Feature",
//                 properties: {},
//                 geometry: {
//                   type: "Point",
//                   coordinates: start,
//                 },
//               },
//             ],
//           },
//         },
//         paint: {
//           "circle-radius": 10,
//           "circle-color": "#3887be",
//         },
//       });
//       // listen for the `result` event from the Geocoder
//       // `result` event is triggered when a user makes a selection
//       // Add the coordinates of the location to the `end` array
//       // and make a directions request to get route from start to end point
//       geocoder.on("result", (e) => {
//         const end = e.result.center;
//         getRoute(map, start, end);
//       });
//     });

//     // listen for the `route` event from the Directions API
//     // `route` event is triggered when a route is generated
//     // Display turn-by-turn directions on the map
//     map.on("route", (e) => {
//       const data = e.route[0];
//       buildRouteInstructions(data, map);
//     });
//   });

//   // create a function to build and display the turn-by-turn directions
//   function buildRouteInstructions(data) {
//     const instructions = document.getElementById("instructions");
//     instructions.innerHTML = "";

//     const steps = data.legs[0].steps;

//     for (let i = 0; i < steps.length; i++) {
//       const instruction = document.createElement("p");
//       instruction.innerHTML = `${i + 1}. ${steps[i].maneuver.instruction}`;
//       instructions.appendChild(instruction);
//     }
//   }

//   return (
//     <div>
//       <div
//         id="map"
//         style={{ position: "absolute", top: 80, bottom: 0, width: "100%" }}
//       />
//       <div id="instructions" className="instructions"></div>
//     </div>
//   );
// }
// export default PlanRoute;

// // create a function to make a directions request
// async function getRoute(end) {
//   // make a directions request using cycling profile
//   // an arbitrary start will always be the same
//   // only the end or destination will change

//   const query = await fetch(
//     `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
//     { method: "GET" }
//   );
//   const json = await query.json();
//   const data = json.routes[0];
//   const route = data.geometry.coordinates;
//   const geojson = {
//     type: "Feature",
//     properties: {},
//     geometry: {
//       type: "LineString",
//       coordinates: route,
//     },
//   };
//   // if the route already exists on the map, we'll reset it using setData
//   if (map.getSource("route")) {
//     map.getSource("route").setData(geojson);
//   }
//   // otherwise, we'll make a new request
//   else {
//     map.addLayer({
//       id: "route",
//       type: "line",
//       source: {
//         type: "geojson",
//         data: geojson,
//       },
//       layout: {
//         "line-join": "round",
//         "line-cap": "round",
//       },
//       paint: {
//         "line-color": "#3887be",
//         "line-width": 5,
//         "line-opacity": 0.75,
//       },
//     });
//   }
//   // add turn instructions here at the end
//   map.on("load", () => {
//     // make an initial directions request that
//     // starts and ends at the same location
//     getRoute(start);

//     // Add starting point to the map
//     map.addLayer({
//       id: "point",
//       type: "circle",
//       source: {
//         type: "geojson",
//         data: {
//           type: "FeatureCollection",
//           features: [
//             {
//               type: "Feature",
//               properties: {},
//               geometry: {
//                 type: "Point",
//                 coordinates: start,
//               },
//             },
//           ],
//         },
//       },
//       paint: {
//         "circle-radius": 10,
//         "circle-color": "#3887be",
//       },
//     });
//     // this is where the code from the next step will go
//   });
// }

// async function getRoute(end) {
//   console.log(end);
//   // make a directions request using cycling profile
//   // an arbitrary start will always be the same
//   // only the end or destination will change
//   const query = await fetch(
//     `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
//     { method: "GET" }
//   );
//   const json = await query.json();
//   console.log(json);
//   const data = json.routes[0];
//   const route = data.geometry.coordinates;
//   const geojson = {
//     type: "Feature",
//     properties: {},
//     geometry: {
//       type: "LineString",
//       coordinates: route,
//     },
//   };
//   // if the route already exists on the map, we'll reset it using setData
//   if (map.getSource("route")) {
//     map.getSource("route").setData(geojson);
//   }
//   // otherwise, we'll make a new request
//   else {
//     map.addLayer({
//       id: "route",
//       type: "line",
//       source: {
//         type: "geojson",
//         data: geojson,
//       },
//       layout: {
//         "line-join": "round",
//         "line-cap": "round",
//       },
//       paint: {
//         "line-color": "#3887be",
//         "line-width": 5,
//         "line-opacity": 0.75,
//       },
//     });
//   }

// import "./planroute.css";
// import "mapbox-gl/dist/mapbox-gl.css";
// import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import React, { useEffect } from "react";
// import mapboxgl from "mapbox-gl";
// import Instructions from "../../components/Instructions";

// const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

// function PlanRoute() {
//   useEffect(() => {
//     mapboxgl.accessToken = accessToken;

//     const map = new mapboxgl.Map({
//       container: "map",
//       style: "mapbox://styles/hal888/clfl4vcde00eq01o4hy3yymbs",
//       center: [-0.118092, 51.509865],
//       zoom: 13,
//     });
//     const start = [-122.662323, 45.523751];

//     // create a function to make a directions request

//     async function getRoute(end) {
//       if (!end) {
//         return;
//       }

//       console.log(end);
//       const query = await fetch(
//         `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
//         { method: "GET" }
//       );
//       const json = await query.json();

//       if (!json || !json.routes || json.routes.length === 0) {
//         console.error("Invalid response from API");
//         return;
//       }

//       const data = json.routes[0];
//       const route = data.geometry.coordinates;
//       const geojson = {
//         type: "Feature",
//         properties: {},
//         geometry: {
//           type: "LineString",
//           coordinates: route,
//         },
//       };

//       if (map.getSource("route")) {
//         map.getSource("route").setData(geojson);
//       } else {
//         map.addLayer({
//           id: "route",
//           type: "line",
//           source: {
//             type: "geojson",
//             data: geojson,
//           },
//           layout: {
//             "line-join": "round",
//             "line-cap": "round",
//           },
//           paint: {
//             "line-color": "#3887be",
//             "line-width": 5,
//             "line-opacity": 0.75,
//           },
//         });
//       }
//       // add turn instructions here at the end
//     }

//     map.on("load", () => {
//       // make an initial directions request that
//       // starts and ends at the same location
//       getRoute(start);

//       // Add starting point to the map
//       map.addLayer({
//         id: "point",
//         type: "circle",
//         source: {
//           type: "geojson",
//           data: {
//             type: "FeatureCollection",
//             features: [
//               {
//                 type: "Feature",
//                 properties: {},
//                 geometry: {
//                   type: "Point",
//                   coordinates: start,
//                 },
//               },
//             ],
//           },
//         },
//         paint: {
//           "circle-radius": 10,
//           "circle-color": "#3887be",
//         },
//       });
//       map.on("click", (event) => {
//         const coords = Object.keys(event.lngLat).map(
//           (key) => event.lngLat[key]
//         );
//         const end = {
//           type: "FeatureCollection",
//           features: [
//             {
//               type: "Feature",
//               properties: {},
//               geometry: {
//                 type: "Point",
//                 coordinates: coords,
//               },
//             },
//           ],
//         };
//         if (map.getLayer("end")) {
//           map.getSource("end").setData(end);
//         } else {
//           map.addLayer({
//             id: "end",
//             type: "circle",
//             source: {
//               type: "geojson",
//               data: {
//                 type: "FeatureCollection",
//                 features: [
//                   {
//                     type: "Feature",
//                     properties: {},
//                     geometry: {
//                       type: "Point",
//                       coordinates: coords,
//                     },
//                   },
//                 ],
//               },
//             },
//             paint: {
//               "circle-radius": 10,
//               "circle-color": "#f30",
//             },
//           });
//         }
//         getRoute(coords);
//       });
//     });

//     // CREATED GEOCODER SEARCH BAR
//     const geocoderContainer = document.createElement("div");
//     geocoderContainer.className = "geocoder-container";

//     const mapContainer = map.getContainer();
//     mapContainer.insertBefore(geocoderContainer, mapContainer.firstChild);

//     // GEOCODER CONTROL IN THE CONTAINER
//     const geocoder = new MapboxGeocoder({
//       accessToken: mapboxgl.accessToken,
//       mapboxgl: mapboxgl,
//       placeholder: "Search for a location",
//     });
//     geocoderContainer.appendChild(geocoder.onAdd(map));

//     return () => {
//       map.remove();
//     };
//   }, []);

//   return (
//     <>
//       <div
//         id="map"
//         style={{ position: "absolute", top: 80, bottom: 0, width: "100%" }}
//       />
//       <Instructions />
//     </>
//   );
// }

// export default PlanRoute;
