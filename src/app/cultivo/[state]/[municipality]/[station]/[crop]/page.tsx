import {notFound} from 'next/navigation';
import {
  CropRange,
  StationDataCrop,
  YieldEntry,
  AgronomicResponse,
  AgronomicData,
  Cultivar,
  Soil,
} from '@/types/types';

const API_URL =
  'https://webapi.aclimate.org/api/Geographic/61e59d829d5d2486e18d2ea8/json';

interface APIState {
  name: string;
  country: {id: string};
  municipalities: {
    id: string;
    name: string;
    weather_stations: {
      id: string;
      ext_id: string;
      name: string;
      origin: string;
      latitude: number;
      longitude: number;
      ranges: CropRange[];
    }[];
  }[];
}

/**
 * Página que renderiza los datos de una estación con el cultivo seleccionado.
 */
export default async function CropStationPage({
  params,
}: {
  params: Promise<{
    state: string;
    municipality: string;
    station: string;
    crop: string;
  }>;
}) {
  const resolvedParams = await params; // Resolvemos la promesa
  const {state, municipality, station, crop} = resolvedParams;
  let stationDataCrop: StationDataCrop | null = null;

  const decodedParams = {
    state: decodeURIComponent(state),
    municipality: decodeURIComponent(municipality),
    station: decodeURIComponent(station),
    crop: decodeURIComponent(crop),
  };

  let yieldData: YieldEntry[] = [];
  let agronomicData: AgronomicData | null = null;
  let yieldExceeData: YieldEntry[] = [];

  const cultivarIds = new Set<string>();
  const soilIds = new Set<string>();

  let cultivars: Cultivar[] = [];
  let soils: Soil[]  = [];

  console.log(resolvedParams);

  try {
    const response = await fetch(API_URL, {cache: 'no-store'});
    if (!response.ok) throw new Error('Error al obtener los datos');

    const dataState: APIState[] = await response.json();

    for (const stateData of dataState) {
      if (stateData.name.toLowerCase() === decodedParams.state.toLowerCase()) {
        for (const municipalityData of stateData.municipalities) {
          if (
            municipalityData.name.toLowerCase() === decodedParams.municipality.toLowerCase()
          ) {
            for (const stationData of municipalityData.weather_stations) {
              if (stationData.name.toLowerCase() === decodedParams.station.toLowerCase()) {
                stationDataCrop = {
                  country: stateData.country.id,
                  state: stateData.name,
                  municipality: municipalityData.name,
                  station: stationData.name,
                  ...stationData,
                  ranges: stationData.ranges
                    .filter((range: CropRange) => range.crop_name.toLowerCase() === decodedParams.crop.toLowerCase())
                };
              }
            }
          }
        }
      }
    }
    if (!stationDataCrop) return notFound();

    const yieldExceeResponse = await fetch(
      `https://webapi.aclimate.org/api/Forecast/YieldExceedance/${stationDataCrop.id}/json`,
      {cache: 'no-store'},
    );
    if (!yieldExceeResponse.ok)
      throw new Error('Error al obtener los datos de rendimiento excee');

    const yieldResponse = await fetch(
      `https://webapi.aclimate.org/api/Forecast/Yield/${stationDataCrop.id}/json`,
      {cache: 'no-store'},
    );
    if (!yieldResponse.ok)
      throw new Error('Error al obtener los datos de rendimiento');

    const agronomicResponse = await fetch(
      `https://webapi.aclimate.org/api/Agronomic/true/json`,
      {cache: 'no-store'},
    );
    if (!agronomicResponse.ok)
      throw new Error('Error al obtener los datos de agronomicos');

    const yieldJson = await yieldResponse.json();
    yieldData = yieldJson.yield[0].yield || [];

    const yieldExceeJson = await yieldExceeResponse.json();
    yieldExceeData = yieldExceeJson.yield[0].yield || [];

    const dataAgronomic: AgronomicResponse = await agronomicResponse.json();
    agronomicData = dataAgronomic.find((cp) => cp.cp_name === decodedParams.crop) || null;

    yieldData.forEach((entry) => {
      cultivarIds.add(entry.cultivar);
      soilIds.add(entry.soil);
    });

    cultivars = agronomicData
      ? agronomicData.cultivars.filter((c) => cultivarIds.has(c.id))
      : [];
    soils = agronomicData
      ? agronomicData.soils.filter((s) => soilIds.has(s.id))
      : [];

    console.log('yield ', yieldData);
    console.log('yield_Exceedance ', yieldExceeData);
    console.log('agronomic', agronomicData);
    console.log('weather station', stationDataCrop);
    console.log('cultivares', cultivars);
    console.log('suelos', soils);
  } catch (error) {
    console.error('Error al cargar la estación:', error);
  }

  if (!stationDataCrop) return notFound();

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>
        Estación: {stationDataCrop?.name}
      </h1>
      <p>
        <strong>Departamento:</strong> {stationDataCrop?.state}
      </p>
      <p>
        <strong>Municipio:</strong> {stationDataCrop?.municipality}
      </p>
      <p>
        <strong>Origen:</strong> {stationDataCrop?.origin}
      </p>
      <p>
        <strong>Ubicación:</strong> {stationDataCrop?.latitude},{' '}
        {stationDataCrop?.longitude}
      </p>

      <h2 className='text-xl font-semibold mt-4'>Rangos de {crop}</h2>
      {stationDataCrop?.ranges && stationDataCrop?.ranges?.length > 0 ? (
        <ul className='list-disc list-inside'>
          {stationDataCrop?.ranges.map((range, index) => (
            <li key={`${range.crop_id}-${index}`}>
              {range.label} ({range.lower} - {range.upper} kg/ha)
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay información de rangos para este cultivo en esta estación.</p>
      )}

      <h2 className='text-xl font-semibold mt-4'>Cultivares en Yield</h2>
      {cultivars?.length > 0 ? (
        <ul className='list-disc list-inside'>
          {cultivars?.map((cultivar) => (
            <li key={cultivar.id}>{cultivar.name}</li>
          ))}
        </ul>
      ) : (
        <p>No hay cultivares encontrados en Yield.</p>
      )}

      <h2 className='text-xl font-semibold mt-4'>Suelos en Yield</h2>
      {soils?.length > 0 ? (
        <ul className='list-disc list-inside'>
          {soils?.map((soil) => (
            <li key={soil.id}>{soil.name}</li>
          ))}
        </ul>
      ) : (
        <p>No hay suelos encontrados en Yield.</p>
      )}
    </div>
  );
}
