// Weather Data Types
export interface WeatherData {
  id: string;
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind: number;
  uvIndex: number;
  visibility: number;
  solarIntensity: string;
  lastUpdated: string;
}

// KPI Data Types
export interface Kpi {
  id: string;
  title: string;
  value: string;
  change: number;
  type: string;
}

// Energy Data Types
export interface EnergyData {
  time: string;
  production: number;
  consumption: number;
  grid: number;
}

export interface EnergyDistribution {
  name: string;
  value: number;
}

// System Component Types
export interface SystemComponent {
  id: string;
  name: string;
  details: string;
  status: string;
  output: string;
  type: string;
}

// Generator Group Types
export interface GeneratorGroup {
  id: string;
  name: string;
  output: string;
  efficiency: number;
}

// Grid Data Types
export interface GridChartData {
  time: string;
  import: number;
  export: number;
}

export interface GridData {
  import: string;
  importChange: number;
  export: string;
  exportChange: number;
  netBalance: string;
  voltage: string;
  frequency: string;
  chartData: GridChartData[];
}

// Alert Types
export interface Alert {
  id: string;
  status: string;
  description: string;
  component: string;
  time: string;
}

// Forecast Types
export interface ForecastDay {
  id: string;
  date: string;
  weather: string;
  forecast: string;
  comparison: number;
}
