import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition, onLocationChange }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const newPos = marker.getLatLng();
          setPosition(newPos);
          onLocationChange(newPos.lat, newPos.lng);
        },
      }}
    />
  );
};

const MapPicker = ({ lat, lng, onChangeLocation }) => {
  const [position, setPosition] = useState(
    lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null
  );

  useEffect(() => {
    if (lat && lng) {
      setPosition({ lat: parseFloat(lat), lng: parseFloat(lng) });
    }
  }, [lat, lng]);

  const defaultCenter = position || { lat: 20.5937, lng: 78.9629 }; // India center

  return (
    <div style={{ marginTop: '15px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
      <MapContainer
        center={defaultCenter}
        zoom={position ? 15 : 5}
        style={{ height: '300px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationChange={onChangeLocation}
        />
      </MapContainer>
      <div style={{ padding: '10px', fontSize: '0.85rem', backgroundColor: '#f8f9fa', color: '#555' }}>
        💡 Map par click karein ya pin ko drag karein apni exact location set karne ke liye.
      </div>
    </div>
  );
};

export default MapPicker;