
import * as db from './db';

export const storage = {
  async getWeatherData() {
    try {
      // For now returning static weather data since it's not in DB
      return {
        id: 'w1',
        location: 'Austin, TX',
        temperature: 25,
        condition: 'Sunny',
        humidity: 65,
        windSpeed: 12
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },

  async getKpis() {
    try {
      const powerData = await db.getAllSourcesLatestData();
      const totalPower = powerData.reduce((sum, data) => sum + Number(data.kwt), 0);
      
      return [
        { id: 'kpi1', title: 'Current Power', value: `${totalPower.toFixed(2)} kW`, change: 2.5 },
        { id: 'kpi2', title: 'Today\'s Energy', value: '58.8 kWh', change: -1.2 },
        { id: 'kpi3', title: 'Power Factor', value: '0.92', change: 0.02 }
      ];
    } catch (error) {
      console.error('Error fetching KPI data:', error);
      throw error;
    }
  },

  async getSystemComponents() {
    try {
      const powerData = await db.getAllSourcesLatestData();
      
      return powerData.map((data, index) => ({
        id: `sc${index + 1}`,
        name: `${data.source_type.charAt(0).toUpperCase() + data.source_type.slice(1)} #${index + 1}`,
        details: `${Number(data.kwt).toFixed(2)} kW`,
        status: Number(data.kwt) > 0 ? 'Online' : 'Offline',
        lastChecked: data.time
      }));
    } catch (error) {
      console.error('Error fetching system components:', error);
      throw error;
    }
  },

  async getGeneratorGroups() {
    const generator1Data = await db.getLatestPowerData('generator1');
    const generator2Data = await db.getLatestPowerData('generator2');
    
    return [{
      id: 'gg1',
      name: 'Generator Array',
      generators: [
        {
          id: 'g1',
          name: 'Generator 1',
          output: `${Number(generator1Data.kwt).toFixed(1)} kW`,
          status: Number(generator1Data.kwt) > 0 ? 'Running' : 'Stopped'
        },
        {
          id: 'g2',
          name: 'Generator 2', 
          output: `${Number(generator2Data.kwt).toFixed(1)} kW`,
          status: Number(generator2Data.kwt) > 0 ? 'Running' : 'Stopped'
        }
      ]
    }];
  },

  async getGeneratorTotalOutput() {
    const [generator1Data, generator2Data] = await Promise.all([
      db.getLatestPowerData('generator1'),
      db.getLatestPowerData('generator2')
    ]);
    const total = Number(generator1Data.kwt) + Number(generator2Data.kwt);
    return `${total.toFixed(1)} kW`;
  },

  async getGeneratorPerformanceHourly() {
    const data = await db.getHistoricalPowerData('generator1', 24);
    return data.map(record => ({
      time: new Date(record.time).toLocaleTimeString('en-US', { hour: 'numeric' }),
      value: Number(record.total_power)
    }));
  },

  async getGeneratorTemperature() {
    // This would require additional sensors - using static data for now
    return { current: 42, max: 80, min: 20 };
  },

  async getGridStatus() {
    const gridData = await db.getLatestPowerData('grid1');
    return { 
      status: Number(gridData.kwt) > 0 ? "Connected" : "Disconnected", 
      lastChecked: gridData.time 
    };
  },

  async getGridVoltage() {
    const data = await db.getVoltageData('grid1');
    return data.map(record => ({
      time: new Date(record.time).toLocaleTimeString('en-US', { hour: 'numeric' }),
      v1: Number(record.v1),
      v2: Number(record.v2),
      v3: Number(record.v3)
    }));
  },

  async getAlerts() {
    const { db: drizzleDb } = await import('./db');
    const { alerts } = await import('@shared/schema');
    const dbAlerts = await drizzleDb.select().from(alerts).orderBy(alerts.timestamp);
    return dbAlerts;
  },

  async getForecastDays() {
    const { db: drizzleDb } = await import('./db');
    const { forecastDays } = await import('@shared/schema');
    const dbForecastDays = await drizzleDb.select().from(forecastDays);
    return dbForecastDays;
  },

  async getWeeklyForecast() {
    const historyData = await db.getHistoricalPowerData('generator1', 168);
    const weeklyTotal = historyData.reduce((sum, data) => sum + Number(data.total_power), 0);
    const prevWeekData = await db.getHistoricalPowerData('generator1', 336);
    const prevWeekTotal = prevWeekData.slice(0, 168).reduce((sum, data) => sum + Number(data.total_power), 0);
    const weeklyChange = ((weeklyTotal - prevWeekTotal) / prevWeekTotal) * 100;
    
    return {
      weeklyTotal: weeklyTotal.toFixed(1),
      weeklyChange: weeklyChange.toFixed(1)
    };
  },

  async getEnergyHistoryDaily() {
    const data = await db.getHistoricalPowerData('generator1', 168);
    
    const dailyData = data.reduce((acc: any[], record) => {
      const date = new Date(record.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existingDay = acc.find(d => d.date === date);
      
      if (existingDay) {
        existingDay.production += Number(record.total_power);
        existingDay.consumption += Number(record.kwh_import);
      } else {
        acc.push({
          date,
          production: Number(record.total_power),
          consumption: Number(record.kwh_import)
        });
      }
      
      return acc;
    }, []);

    return dailyData.slice(-7);
  },

  async getEnergyHistoryMonthly() {
    return await db.getHistoricalPowerData('generator1', 720);
  },

  async getEnergyHistoryYearly() {
    return await db.getHistoricalPowerData('generator1', 8760);
  },

  async getEnergyDistribution() {
    return await db.getPowerSourceDistribution();
  }
};
