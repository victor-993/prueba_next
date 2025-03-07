"use client";

import dynamic from 'next/dynamic';
import {useMemo, useEffect, useState } from 'react';
import { Station } from '@/types/types';

const API_URL = "https://webapi.aclimate.org/api/Geographic/61e59d829d5d2486e18d2ea8/json";

export default function Home() {
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/Map'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  );


  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const data = await response.json();
        
        // 🔹 Extraer estaciones del JSON
        const extractedStations: Station[] = data.flatMap((department: any) =>
          department.municipalities.flatMap((municipality: any) =>
            municipality.weather_stations.map((station: any) => ({
              id: station.id,
              name: station.name,
              latitude: station.latitude,
              longitude: station.longitude,
              department: department.name,
              municipality: municipality.name,
              crops: [...new Set(station.ranges.map((r: any) => r.crop_name))],
            }))
          )
        );

        setStations(extractedStations);
      } catch (error) {
        console.error("Error al cargar estaciones:", error);
      }
    };

    fetchStations();
  }, []);


  return (
    <div>
      <Map posix={[4.5709, -74.2973]} stations={stations} />
    </div>
  );
}
