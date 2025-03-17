// Weather data
export const weatherData = {
  id: "w1",
  location: "Austin, TX",
  temperature: 86,
  condition: "Partly Cloudy",
  humidity: 65,
  wind: 8,
  uvIndex: 7,
  visibility: 10,
  solarIntensity: "Excellent",
  lastUpdated: "5 min ago"
};

// KPI data
export const kpis = [
  {
    id: "kpi1",
    title: "Current Power",
    value: "8.42 kW",
    change: 12,
    type: "power"
  },
  {
    id: "kpi2",
    title: "Energy Today",
    value: "42.7 kWh",
    change: 8,
    type: "energy"
  },
  {
    id: "kpi3",
    title: "Grid Import",
    value: "3.8 kWh",
    change: -5,
    type: "grid"
  },
  {
    id: "kpi4",
    title: "CO₂ Avoided",
    value: "18.6 kg",
    change: 10,
    type: "co2"
  }
];

// System components
export const systemComponents = [
  {
    id: "sc1",
    name: "Solar Array #1",
    details: "20 panels, roof-mounted",
    status: "Operational",
    output: "4.6 kW",
    type: "solar"
  },
  {
    id: "sc2",
    name: "Inverter",
    details: "SolarEdge SE10000H",
    status: "Needs Attention",
    output: "8.2 kW",
    type: "inverter"
  },
  {
    id: "sc3",
    name: "Battery Storage",
    details: "Tesla Powerwall 2",
    status: "Charging",
    output: "78%",
    type: "battery"
  },
  {
    id: "sc4",
    name: "Grid Connection",
    details: "Two-way meter",
    status: "Connected",
    output: "Exporting",
    type: "grid"
  }
];

// Generator groups
export const generatorGroups = [
  {
    id: "gg1",
    name: "Roof East",
    output: "2.4 kW",
    efficiency: 96
  },
  {
    id: "gg2",
    name: "Roof West",
    output: "3.2 kW",
    efficiency: 98
  },
  {
    id: "gg3",
    name: "Garage",
    output: "1.8 kW",
    efficiency: 87
  },
  {
    id: "gg4",
    name: "Ground Array",
    output: "0.9 kW",
    efficiency: 72
  }
];

// Alerts
export const alerts = [
  {
    id: "a1",
    status: "Warning",
    description: "Inverter temperature high",
    component: "Inverter",
    time: "10:32 AM"
  },
  {
    id: "a2",
    status: "Info",
    description: "Battery charging completed",
    component: "Battery Storage",
    time: "09:47 AM"
  },
  {
    id: "a3",
    status: "Alert",
    description: "Ground array shading detected",
    component: "Ground Array",
    time: "08:15 AM"
  }
];

// Forecast days
export const forecastDays = [
  {
    id: "fd1",
    date: "Today",
    weather: "Sunny",
    forecast: "45.2 kWh",
    comparison: 8
  },
  {
    id: "fd2",
    date: "Tomorrow",
    weather: "Partly Cloudy",
    forecast: "39.8 kWh",
    comparison: -5
  },
  {
    id: "fd3",
    date: "Wednesday",
    weather: "Cloudy",
    forecast: "32.5 kWh",
    comparison: -18
  },
  {
    id: "fd4",
    date: "Thursday",
    weather: "Sunny",
    forecast: "44.7 kWh",
    comparison: 6
  }
];
