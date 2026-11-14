'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';

const LocationMarker = ({ setLatLng }: { setLatLng: (lat: number, lng: number) => void }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      setLatLng(lat, lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png' })} />
  );
};

const MapSelector = ({ setLatitude, setLongitude }: { setLatitude: Function; setLongitude: Function }) => {
  const setLatLng = (lat: number, lng: number) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };

  return (
    <MapContainer center={[25.276987, 55.296249]} zoom={10} style={{ height: '300px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker setLatLng={setLatLng} />
    </MapContainer>
  );
};

export default MapSelector;
