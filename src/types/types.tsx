export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  department: string;
  municipality: string;
  crops: string[];
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
