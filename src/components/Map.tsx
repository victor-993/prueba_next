'use client';

import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import {LatLngExpression, LatLngTuple} from 'leaflet';
import {Station} from '@/types/types';
//import Link from "next/link";

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

interface MapProps {
  posix?: LatLngExpression | LatLngTuple;
  zoom?: number;
  stations?: Station[];
}

const defaults = {
  zoom: 6,
  posix: [4.5709, -74.2973] as LatLngTuple,
};

const Map = (Map: MapProps) => {
  const {zoom = defaults.zoom, posix, stations} = Map;

  return (
    <MapContainer center={posix} zoom={zoom} className='h-[80vh] w-full'>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {stations?.map((station) => (
        <Marker
          key={station.id}
          position={[station.latitude, station.longitude]}
        >
          <Popup>
            <div>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href={`/clima/${station.id}`}
                className='text-blue-600 underline'
              >
                <strong>
                  📍 {station.department}, {station.municipality},{' '}
                  {station.name}
                </strong>
              </a>
              <br />
              🌱 Cultivos:{' '}
              {station.crops.length > 0 ? (
                <ul>
                  {station.crops.map((crop) => (
                     <li key={crop.crop_id}>
                     <a href={`/cultivo/${station.department}/${station.municipality}/${station.name}/${crop.crop_name}`} className="text-blue-600 underline">
                       {crop.crop_name}
                     </a>
                   </li>
                  ))}
                </ul>
              ) : (
                'No disponible'
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
