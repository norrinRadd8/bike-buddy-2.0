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
      onMove={(evt) => setViewport(evt.viewport)}
    >
      <NavigationControl />

      <Marker latitude={51.5072} longitude={0.1276}>
        <div>I'M HERE</div>
      </Marker>
    </ReactMapGl>
  );
};

export default PlanRoute;
