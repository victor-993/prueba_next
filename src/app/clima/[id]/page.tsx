"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ClimateChart from "@/components/ClimateChart";
import { obtenerNombreMes } from "@/utils/dateUtils";
import { ClimateData, HistoricalData } from "@/types/types";

export default function ClimatePage() {
  const { id } = useParams(); // Obtener parámetro dinámico en el cliente
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // Evita ejecutar si no hay un ID

    const fetchData = async () => {
      try {
        const climateRes = await fetch(
          `https://webapi.aclimate.org/api/Historical/Climatology/${id}/json`,
          { cache: "no-store" }
        );

        if (!climateRes.ok) throw new Error("Error en datos climáticos");

        const climateJson = await climateRes.json();
        setClimateData(climateJson[0]);

        const historicalRes = await fetch(
          `https://webapi.aclimate.org/api/Historical/HistoricalClimatic/${id}/json`,
          { cache: "no-store" }
        );

        if (!historicalRes.ok) throw new Error("Error en datos históricos");

        setHistoricalData(await historicalRes.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="p-6">Cargando datos...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clima de la estación {id}</h1>

      <div className="bg-white shadow-md rounded-lg p-4 mb-6 overflow-x-auto">
        <h2 className="text-xl font-bold mb-2">Datos Mensuales</h2>
        <table className="w-full min-w-max border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-sm md:text-base">
              <th className="border p-2">Mes</th>
              <th className="border p-2">Temp. Máx (°C)</th>
              <th className="border p-2">Temp. Mín (°C)</th>
              <th className="border p-2">Precipitación (mm)</th>
              <th className="border p-2">Radiación Solar</th>
            </tr>
          </thead>
          <tbody>
            {climateData?.monthly_data.map((monthData) => {
              const tMax = monthData.data.find((d) => d.measure === "t_max")?.value ?? "-";
              const tMin = monthData.data.find((d) => d.measure === "t_min")?.value ?? "-";
              const prec = monthData.data.find((d) => d.measure === "prec")?.value ?? "-";
              const solRad = monthData.data.find((d) => d.measure === "sol_rad")?.value ?? "-";

              return (
                <tr key={monthData.month} className="text-center text-sm md:text-base">
                  <td className="border p-2">{obtenerNombreMes(monthData.month)}</td>
                  <td className="border p-2">{tMax}</td>
                  <td className="border p-2">{tMin}</td>
                  <td className="border p-2">{prec}</td>
                  <td className="border p-2">{solRad}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {climateData && <ClimateChart climateData={climateData} historicalData={historicalData} />}
    </div>
  );
}
