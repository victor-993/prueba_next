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

