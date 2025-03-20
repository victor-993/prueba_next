export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  department: string;
  municipality: string;
  crops: {crop_id: string, crop_name: string }[];
}

export interface ClimateData {
  weather_station: string;
  monthly_data: {
    month: number;
    data: {
      measure: string;
      value: number;
    }[];
  }[];
}

export interface HistoricalData {
  weather_station: string;
  year: number;
  monthly_data: {
    month: number;
    data: { measure: string; value: number }[];
  }[];
}

export type CropRange = {
  crop_id: string;
  crop_name: string;
  label: string;
  lower: number;
  upper: number;
};

export type WeatherStation = {
  id: string;
  ext_id: string;
  name: string;
  origin: string;
  latitude: number;
  longitude: number;
  ranges: CropRange[];
};

export type Municipality = {
  id: string;
  name: string;
  weather_stations: WeatherStation[];
};

export type Department = {
  id: string;
  name: string;
  country: {
    id: string;
    iso2: string;
    name: string;
  };
  municipalities: Municipality[];
};

export type StationDataCrop = {
  country: string;
  state: string;
  municipality: string;
  station: string;
  id: string;
  ext_id: string;
  name: string;
  origin: string;
  latitude: number;
  longitude: number;
  ranges: CropRange[];
}

export interface YieldMeasure {
  measure: string;
  median: number;
  avg: number;
  min: number;
  max: number;
  quar_1: number;
  quar_2: number;
  quar_3: number;
  conf_lower: number;
  conf_upper: number;
  sd: number;
  perc_5: number;
  perc_95: number;
  coef_var: number;
}

export interface YieldEntry {
  cultivar: string;
  soil: string;
  start: string; // Fecha en formato ISO (ej. "2025-03-01T00:00:00Z")
  end: string; // Fecha en formato ISO (ej. "2025-03-01T00:00:00Z")
  data: YieldMeasure[]; // Datos de rendimiento y clima
}

export interface YieldData {
  weather_station: string; // ID de la estación meteorológica
  yield: YieldEntry[]; // Lista de datos de rendimiento
}

export interface YieldResponse {
  forecast: string; // ID del pronóstico relacionado
  confidence: number; // Nivel de confianza
  yield: YieldData[]; // Lista de datos de rendimiento por estación
}

export interface Soil {
  id: string;
  name: string;
  country_id: string;
}

export interface Cultivar {
  id: string;
  name: string;
  rainfed: boolean;
  national: boolean;
  country_id: string;
}

export interface AgronomicData {
  cp_id: string; 
  cp_name: string; 
  soils: Soil[]; 
  cultivars: Cultivar[]; 
}

export type AgronomicResponse = AgronomicData[];