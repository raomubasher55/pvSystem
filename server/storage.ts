
import * as db from './db';

export const storage = {
  async getWeatherData() {
    // For now returning static weather data since it's not in DB
    return {
      id: 'w1',
      location: 'Austin, TX',
      temperature: 25,
      condition: 'Sunny',
      humidity: 65,
      windSpeed: 12
    };
  },

  async getKpis() {
    const powerData = await db.getAllSourcesLatestData();
    const totalPower = powerData.reduce((sum, data) => sum + data.kwt, 0);
    
    return [
      { id: 'kpi1', title: 'Current Power', value: `${totalPower.toFixed(2)} kW`, change: 2.5 },
      { id: 'kpi2', title: 'Today\'s Energy', value: '58.8 kWh', change: -1.2 },
      { id: 'kpi3', title: 'Power Factor', value: '0.92', change: 0.02 }
    ];
  },

  async getSystemComponents() {
    const powerData = await db.getAllSourcesLatestData();
    
    return powerData.map((data, index) => ({
      id: `sc${index + 1}`,
      name: `${data.source_type.charAt(0).toUpperCase() + data.source_type.slice(1)} #${index + 1}`,
      details: `${data.kwt.toFixed(2)} kW`,
      status: data.kwt > 0 ? 'Online' : 'Offline',
      lastChecked: data.time
    }));
  },

  async getGeneratorGroups() {
    const generatorData = await db.getLatestPowerData('generator1');
    
    return [{
      id: 'gg1',
      name: 'Roof Array',
      generators: [{
        id: 'g1',
        name: 'Generator 1',
        output: `${generatorData.kwt.toFixed(1)} kW`,
        status: generatorData.kwt > 0 ? 'Running' : 'Stopped'
      }]
    }];
  },

  async getGeneratorTotalOutput() {
    const generatorData = await db.getLatestPowerData('generator1');
    return `${generatorData.kwt.toFixed(1)} kW`;
  },

  async getGeneratorPerformanceHourly() {
    return await db.getHistoricalPowerData('generator1', 24);
  },

  async getGeneratorTemperature() {
    return { current: 42, max: 80, min: 20 }; // Static data as temperature not in DB
  },

  async getGridStatus() {
    const gridData = await db.getLatestPowerData('grid1');
    return { 
      status: gridData.kwt > 0 ? "Connected" : "Disconnected", 
      lastChecked: gridData.time 
    };
  },

  async getGridVoltage() {
    return await db.getVoltageData('grid1');
  },

  async getGridFrequency() {
    return await db.getFrequencyData('grid1');
  },

  async getAlerts() {
    // Query alerts from database
    const { db: drizzleDb } = await import('./db');
    const { alerts } = await import('@shared/schema');
    const dbAlerts = await drizzleDb.select().from(alerts).orderBy(alerts.timestamp);
    return dbAlerts;
  },

  async getForecastDays() {
    // Query forecast days from database
    const { db: drizzleDb } = await import('./db');
    const { forecastDays } = await import('@shared/schema');
    const dbForecastDays = await drizzleDb.select().from(forecastDays);
    return dbForecastDays;
  },

  async getWeeklyForecast() {
    const historyData = await db.getHistoricalPowerData('generator1', 168); // Last 7 days
    const weeklyTotal = historyData.reduce((sum, data) => sum + data.total_power, 0);
    const prevWeekData = await db.getHistoricalPowerData('generator1', 336); // Previous 7 days
    const prevWeekTotal = prevWeekData.slice(0, 168).reduce((sum, data) => sum + data.total_power, 0);
    const weeklyChange = ((weeklyTotal - prevWeekTotal) / prevWeekTotal) * 100;
    
    return {
      weeklyTotal: weeklyTotal.toFixed(1),
      weeklyChange: weeklyChange.toFixed(1)
    };
  },

  async getEnergyHistoryDaily() {
    const historyData = await db.getHistoricalPowerData('generator1', 168); // Last 7 days
    
    const dailyData = historyData.reduce((acc: any[], data) => {
      const date = new Date(data.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existingDay = acc.find(d => d.date === date);
      
      if (existingDay) {
        existingDay.production += data.total_power;
        existingDay.consumption += data.kwh_import;
      } else {
        acc.push({
          date,
          production: data.total_power,
          consumption: data.kwh_import
        });
      }
      
      return acc;
    }, []);

    return dailyData.slice(-7);
  },

  async getEnergyHistoryMonthly() {
    return await db.getHistoricalPowerData('generator1', 720); // Last 30 days
  },

  async getEnergyHistoryYearly() {
    return await db.getHistoricalPowerData('generator1', 8760); // Last 365 days
  },

  async getEnergyDistribution() {
    return await db.getPowerSourceDistribution();
  },

  async getWeatherForecast() {
    // Static weather forecast as it's not in DB
    return [
      { time: "Now", temp: 25, condition: "Sunny" },
      { time: "1PM", temp: 27, condition: "Partly Cloudy" },
      { time: "2PM", temp: 26, condition: "Cloudy" }
    ];
  },

  async getSolarRadiation() {
    const inverterData = await db.getHistoricalPowerData('inverter1', 3);
    return inverterData.map(data => ({
      time: new Date(data.time).toLocaleTimeString('en-US', { hour: 'numeric' }),
      value: data.total_power * 100 // Convert kW to W/m²
    }));
  }
};
