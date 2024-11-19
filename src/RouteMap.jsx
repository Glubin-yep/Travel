import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useLocation } from "react-router-dom";
import { Polyline } from "react-leaflet";

const RouteMap = () => {
  const { state } = useLocation();
  const { startPoint, endPoint } = state;

  // Логіка для отримання координат точок (це умовні значення)
  const startCoordinates = [50.4501, 30.535]; // Київ
  const endCoordinates = [48.8584, 2.2945]; // Париж

  return (
    <div>
      <h2>
        Маршрут: {startPoint} - {endPoint}
      </h2>
      <MapContainer
        center={startCoordinates}
        zoom={5}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={startCoordinates}>
          <Popup>{startPoint}</Popup>
        </Marker>
        <Marker position={endCoordinates}>
          <Popup>{endPoint}</Popup>
        </Marker>
        <Polyline positions={[startCoordinates, endCoordinates]} color="blue" />
      </MapContainer>
    </div>
  );
};

export default RouteMap;
