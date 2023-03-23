import "./planroute.css";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGl, { Marker, NavigationControl } from "react-map-gl";
import { useState } from "react";

const PlanRoute = () => {
  const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
  const [viewport, setViewport] = useState({
    latitude: 51.5072,
    longitude: 0.1276,
    zoom: 10,
  });

  const handleViewportChange = (viewport) => {
    // Update the viewport state immediately
    setViewport(viewport);

    // Wait for 500 milliseconds before executing the rest of the code
    setTimeout(() => {
      console.log("Viewport changed:", viewport);
    }, 500);
  };

  return (
    <ReactMapGl
      {...viewport}
      width="100vw"
      height="100vh"
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/hal888/clfl4vcde00eq01o4hy3yymbs"
      interactiveLayerIds={["my-layer-id"]}
      dragPan={true}
      scrollZoom={true}
      onViewportChange={handleViewportChange}
    >
      <NavigationControl />

      <Marker latitude={51.5072} longitude={0.1276}>
        <div>I'M HERE</div>
      </Marker>
    </ReactMapGl>
  );
};

export default PlanRoute;
