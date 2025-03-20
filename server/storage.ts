
import { db } from './db';
import * as schema from '@shared/schema';
import { desc, eq, sql, and, gte, lte } from 'drizzle-orm';

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
        wind: 12,
        uvIndex: 4,
        visibility: 10,
        solarIntensity: 'High',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },

  async getKpis() {
    try {
      // Get latest data from each power source
      const [grid1Data] = await db.select().from(schema.grid1).orderBy(desc(schema.grid1.time)).limit(1);
      const [grid2Data] = await db.select().from(schema.grid2).orderBy(desc(schema.grid2.time)).limit(1);
      const [generator1Data] = await db.select().from(schema.generator1).orderBy(desc(schema.generator1.time)).limit(1);
      const [generator2Data] = await db.select().from(schema.generator2).orderBy(desc(schema.generator2.time)).limit(1);
      const [inverter1Data] = await db.select().from(schema.inverter1).orderBy(desc(schema.inverter1.time)).limit(1);
      const [inverter2Data] = await db.select().from(schema.inverter2).orderBy(desc(schema.inverter2.time)).limit(1);
      
      // Calculate total power from all sources
      const allData = [grid1Data, grid2Data, generator1Data, generator2Data, inverter1Data, inverter2Data].filter(Boolean);
      const totalPower = allData.reduce((sum, data) => sum + Number(data?.kwt || 0), 0);
      
      // Calculate average power factor
      const avgPowerFactor = allData.reduce((sum, data) => sum + Number(data?.pft || 0), 0) / (allData.length || 1);
      
      // Calculate total energy for today from generators
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const todayGenerator1Data = await db.select({
        total: sql<string>`sum(${schema.generator1.kwh_export})`,
      }).from(schema.generator1)
        .where(gte(schema.generator1.time, todayStart));
      
      const todayGenerator2Data = await db.select({
        total: sql<string>`sum(${schema.generator2.kwh_export})`,
      }).from(schema.generator2)
        .where(gte(schema.generator2.time, todayStart));
      
      const todayEnergy = Number(todayGenerator1Data[0]?.total || 0) + Number(todayGenerator2Data[0]?.total || 0);
      
      return [
        { id: 'kpi1', title: 'Current Power', value: `${totalPower.toFixed(2)} kW`, change: 2.5, type: 'power' },
        { id: 'kpi2', title: 'Today\'s Energy', value: `${todayEnergy.toFixed(1)} kWh`, change: -1.2, type: 'energy' },
        { id: 'kpi3', title: 'Power Factor', value: avgPowerFactor.toFixed(2), change: 0.02, type: 'factor' },
        { id: 'kpi4', title: 'Grid Balance', value: `${(Number(grid1Data?.kwh_export || 0) - Number(grid1Data?.kwh_import || 0)).toFixed(1)} kWh`, change: 1.5, type: 'grid' }
      ];
    } catch (error) {
      console.error('Error fetching KPI data:', error);
      throw new Error('Failed to fetch KPI data');
    }
  },

  async getSystemComponents() {
    try {
      const [grid1Data] = await db.select().from(schema.grid1).orderBy(desc(schema.grid1.time)).limit(1);
      const [grid2Data] = await db.select().from(schema.grid2).orderBy(desc(schema.grid2.time)).limit(1);
      const [generator1Data] = await db.select().from(schema.generator1).orderBy(desc(schema.generator1.time)).limit(1);
      const [generator2Data] = await db.select().from(schema.generator2).orderBy(desc(schema.generator2.time)).limit(1);
      const [inverter1Data] = await db.select().from(schema.inverter1).orderBy(desc(schema.inverter1.time)).limit(1);
      const [inverter2Data] = await db.select().from(schema.inverter2).orderBy(desc(schema.inverter2.time)).limit(1);
      
      const components = [];
      
      if (grid1Data) {
        components.push({
          id: 'sc1',
          name: 'Grid 1',
          details: 'Main grid connection',
          status: Number(grid1Data.kwt) > 0 ? 'Online' : 'Offline',
          output: `${Number(grid1Data.kwt).toFixed(2)} kW`,
          type: 'grid'
        });
      }
      
      if (grid2Data) {
        components.push({
          id: 'sc2',
          name: 'Grid 2',
          details: 'Secondary grid connection',
          status: Number(grid2Data.kwt) > 0 ? 'Online' : 'Offline',
          output: `${Number(grid2Data.kwt).toFixed(2)} kW`,
          type: 'grid'
        });
      }
      
      if (generator1Data) {
        components.push({
          id: 'sc3',
          name: 'Generator 1',
          details: 'Primary generator',
          status: Number(generator1Data.kwt) > 0 ? 'Online' : 'Offline',
          output: `${Number(generator1Data.kwt).toFixed(2)} kW`,
          type: 'generator'
        });
      }
      
      if (generator2Data) {
        components.push({
          id: 'sc4',
          name: 'Generator 2',
          details: 'Secondary generator',
          status: Number(generator2Data.kwt) > 0 ? 'Online' : 'Offline',
          output: `${Number(generator2Data.kwt).toFixed(2)} kW`,
          type: 'generator'
        });
      }
      
      if (inverter1Data) {
        components.push({
          id: 'sc5',
          name: 'Inverter 1',
          details: 'DC/AC conversion',
          status: Number(inverter1Data.kwt) > 0 ? 'Online' : 'Offline',
          output: `${Number(inverter1Data.kwt).toFixed(2)} kW`,
          type: 'inverter'
        });
      }
      
      if (inverter2Data) {
        components.push({
          id: 'sc6',
          name: 'Inverter 2',
          details: 'DC/AC conversion backup',
          status: Number(inverter2Data.kwt) > 0 ? 'Online' : 'Offline',
          output: `${Number(inverter2Data.kwt).toFixed(2)} kW`,
          type: 'inverter'
        });
      }
      
      return components;
    } catch (error) {
      console.error('Error fetching system components:', error);
      throw new Error('Failed to fetch system components');
    }
  },

  async getGeneratorGroups() {
    try {
      const [generator1Data] = await db.select().from(schema.generator1).orderBy(desc(schema.generator1.time)).limit(1);
      const [generator2Data] = await db.select().from(schema.generator2).orderBy(desc(schema.generator2.time)).limit(1);
      
      return [{
        id: 'gg1',
        name: 'Generator Array',
        output: `${(Number(generator1Data?.kwt || 0) + Number(generator2Data?.kwt || 0)).toFixed(1)} kW`,
        efficiency: 92.7
      }];
    } catch (error) {
      console.error('Error fetching generator groups:', error);
      throw new Error('Failed to fetch generator groups');
    }
  },

  async getGeneratorTotalOutput() {
    try {
      const [generator1Data] = await db.select().from(schema.generator1).orderBy(desc(schema.generator1.time)).limit(1);
      const [generator2Data] = await db.select().from(schema.generator2).orderBy(desc(schema.generator2.time)).limit(1);
      
      const total = Number(generator1Data?.kwt || 0) + Number(generator2Data?.kwt || 0);
      return `${total.toFixed(1)} kW`;
    } catch (error) {
      console.error('Error fetching generator total output:', error);
      throw new Error('Failed to fetch generator total output');
    }
  },

  async getGeneratorPerformanceHourly(timeRange = 'last-24h') {
    try {
      // Determine time range for historical data
      const startDate = new Date();
      switch (timeRange) {
        case 'last-7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'last-30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case 'last-24h':
        default:
          startDate.setHours(startDate.getHours() - 24);
          break;
      }
      
      const generator1Data = await db.select().from(schema.generator1)
        .where(gte(schema.generator1.time, startDate))
        .orderBy(schema.generator1.time);
      
      // Group by hour and calculate average power
      const hourlyData: Record<string, { sum: number, count: number }> = {};
      
      generator1Data.forEach(record => {
        const hour = new Date(record.time).toLocaleTimeString('en-US', { hour: 'numeric' });
        
        if (!hourlyData[hour]) {
          hourlyData[hour] = { sum: 0, count: 0 };
        }
        
        hourlyData[hour].sum += Number(record.kwt);
        hourlyData[hour].count += 1;
      });
      
      return Object.entries(hourlyData).map(([hour, data]) => ({
        time: hour,
        value: (data.sum / data.count)
      }));
    } catch (error) {
      console.error('Error fetching generator performance hourly:', error);
      throw new Error('Failed to fetch generator performance data');
    }
  },

  async getGeneratorTemperature() {
    // This would require additional sensors - using static data for now
    return { current: 42, max: 80, min: 20 };
  },

  async getGridStatus(timeRange = 'last-24h') {
    try {
      // Get the latest grid data for status
      const [grid1Data] = await db.select().from(schema.grid1).orderBy(desc(schema.grid1.time)).limit(1);
      
      if (!grid1Data) {
        throw new Error('No grid data available');
      }
      
      // Determine time range for historical data
      const startDate = new Date();
      switch (timeRange) {
        case 'last-7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'last-30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case 'last-24h':
        default:
          startDate.setHours(startDate.getHours() - 24);
          break;
      }
      
      // Get historical data for chart
      const historicalData = await db.select().from(schema.grid1)
        .where(gte(schema.grid1.time, startDate))
        .orderBy(schema.grid1.time);
      
      // Calculate daily totals
      const dailyImport = historicalData.reduce((sum, record) => sum + Number(record.kwh_import || 0), 0);
      const dailyExport = historicalData.reduce((sum, record) => sum + Number(record.kwh_export || 0), 0);
      const netBalance = dailyExport - dailyImport;
      
      // Format chart data
      let chartData = [];
      if (timeRange === 'last-24h') {
        // Group by hour for 24h view
        const hourlyData: Record<string, { import: number, export: number, count: number }> = {};
        
        historicalData.forEach(record => {
          const hour = new Date(record.time).toLocaleTimeString('en-US', { hour: 'numeric' });
          
          if (!hourlyData[hour]) {
            hourlyData[hour] = { import: 0, export: 0, count: 0 };
          }
          
          hourlyData[hour].import += Number(record.kwh_import || 0);
          hourlyData[hour].export += Number(record.kwh_export || 0);
          hourlyData[hour].count += 1;
        });
        
        chartData = Object.entries(hourlyData).map(([time, data]) => ({
          time,
          import: data.import,
          export: data.export
        }));
      } else {
        // Group by day for 7d or 30d view
        const dailyData: Record<string, { import: number, export: number }> = {};
        
        historicalData.forEach(record => {
          const day = new Date(record.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          if (!dailyData[day]) {
            dailyData[day] = { import: 0, export: 0 };
          }
          
          dailyData[day].import += Number(record.kwh_import || 0);
          dailyData[day].export += Number(record.kwh_export || 0);
        });
        
        chartData = Object.entries(dailyData).map(([time, data]) => ({
          time,
          import: data.import,
          export: data.export
        }));
      }
      
      // Calculate percentage changes (mock values for demonstration)
      const importChange = 5.2;
      const exportChange = 3.8;
      
      return { 
        status: Number(grid1Data.kwt) > 0 ? "Connected" : "Disconnected", 
        lastChecked: grid1Data.time.toISOString(),
        import: dailyImport.toFixed(2),
        export: dailyExport.toFixed(2),
        importChange,
        exportChange,
        netBalance: netBalance.toFixed(2),
        voltage: (Number(grid1Data.v1) + Number(grid1Data.v2) + Number(grid1Data.v3)) / 3 + " V",
        frequency: "50.1 Hz",
        chartData
      };
    } catch (error) {
      console.error('Error fetching grid status:', error);
      throw new Error('Failed to fetch grid status');
    }
  },

  async getGridVoltage() {
    try {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      
      const grid1Data = await db.select().from(schema.grid1)
        .where(gte(schema.grid1.time, twentyFourHoursAgo))
        .orderBy(schema.grid1.time);
      
      // Group by hour to reduce data points
      const hourlyData: Record<string, { v1Sum: number, v2Sum: number, v3Sum: number, count: number }> = {};
      
      grid1Data.forEach(record => {
        const hour = new Date(record.time).toLocaleTimeString('en-US', { hour: 'numeric' });
        
        if (!hourlyData[hour]) {
          hourlyData[hour] = { v1Sum: 0, v2Sum: 0, v3Sum: 0, count: 0 };
        }
        
        hourlyData[hour].v1Sum += Number(record.v1);
        hourlyData[hour].v2Sum += Number(record.v2);
        hourlyData[hour].v3Sum += Number(record.v3);
        hourlyData[hour].count += 1;
      });
      
      return Object.entries(hourlyData).map(([hour, data]) => ({
        time: hour,
        v1: data.v1Sum / data.count,
        v2: data.v2Sum / data.count,
        v3: data.v3Sum / data.count
      }));
    } catch (error) {
      console.error('Error fetching grid voltage:', error);
      throw new Error('Failed to fetch grid voltage data');
    }
  },
  
  async getEnergyChartData(timeRange = 'last-24h') {
    try {
      // Determine time range for historical data
      const startDate = new Date();
      switch (timeRange) {
        case 'last-7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'last-30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case 'last-24h':
        default:
          startDate.setHours(startDate.getHours() - 24);
          break;
      }
      
      // Get grid and generator data from the last 24 hours
      const grid1Data = await db.select().from(schema.grid1)
        .where(gte(schema.grid1.time, twentyFourHoursAgo))
        .orderBy(schema.grid1.time);
      
      const generator1Data = await db.select().from(schema.generator1)
        .where(gte(schema.generator1.time, twentyFourHoursAgo))
        .orderBy(schema.generator1.time);
      
      // Group by hour for more readable charts
      const hourlyData: Record<string, { 
        time: string, 
        production: number, 
        consumption: number, 
        grid: number,
        count: number 
      }> = {};
      
      // Process generator data for production values
      generator1Data.forEach(record => {
        const date = new Date(record.time);
        const hourKey = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:00`;
        
        if (!hourlyData[hourKey]) {
          hourlyData[hourKey] = { 
            time: hourKey, 
            production: 0, 
            consumption: 0, 
            grid: 0,
            count: 0 
          };
        }
        
        hourlyData[hourKey].production += Number(record.kwt || 0);
        hourlyData[hourKey].count += 1;
      });
      
      // Process grid data for consumption and export values
      grid1Data.forEach(record => {
        const date = new Date(record.time);
        const hourKey = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:00`;
        
        if (!hourlyData[hourKey]) {
          hourlyData[hourKey] = { 
            time: hourKey, 
            production: 0, 
            consumption: 0, 
            grid: 0,
            count: 0 
          };
        }
        
        hourlyData[hourKey].consumption += Number(record.kwh_import || 0);
        hourlyData[hourKey].grid += Number(record.kwh_export || 0);
        hourlyData[hourKey].count += 1;
      });
      
      // Calculate average values per hour to smooth the data
      const result = Object.entries(hourlyData).map(([hourKey, data]) => {
        // If we don't have enough data points, make values slightly higher than zero to be visible
        const productionValue = data.production / (data.count || 1);
        const consumptionValue = data.consumption / (data.count || 1) || 0.2;
        const gridValue = data.grid / (data.count || 1) || 0.1;
        
        return {
          time: hourKey,
          production: productionValue,
          consumption: consumptionValue, 
          grid: gridValue
        };
      });
      
      // Sort by time
      return result.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    } catch (error) {
      console.error('Error fetching energy chart data:', error);
      throw new Error('Failed to fetch energy chart data');
    }
  },

  async getAlerts() {
    try {
      const alertData = await db.select().from(schema.alerts).orderBy(desc(schema.alerts.timestamp));
      return alertData;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw new Error('Failed to fetch alerts');
    }
  },

  async getForecastDays() {
    try {
      const forecastData = await db.select().from(schema.forecastDays);
      return forecastData;
    } catch (error) {
      console.error('Error fetching forecast days:', error);
      throw new Error('Failed to fetch forecast data');
    }
  },

  async getWeeklyForecast() {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      
      // Get this week's total generation
      const thisWeekData = await db.select({
        total: sql<string>`sum(${schema.generator1.kwt})`,
      }).from(schema.generator1)
        .where(gte(schema.generator1.time, oneWeekAgo));
      
      // Get previous week's total generation
      const prevWeekData = await db.select({
        total: sql<string>`sum(${schema.generator1.kwt})`,
      }).from(schema.generator1)
        .where(and(
          gte(schema.generator1.time, twoWeeksAgo),
          lte(schema.generator1.time, oneWeekAgo)
        ));
      
      const weeklyTotal = Number(thisWeekData[0]?.total || 0);
      const prevWeekTotal = Number(prevWeekData[0]?.total || 0);
      
      // Calculate percentage change
      const weeklyChange = prevWeekTotal > 0 
        ? ((weeklyTotal - prevWeekTotal) / prevWeekTotal) * 100 
        : 0;
      
      return {
        weeklyTotal: weeklyTotal.toFixed(1),
        weeklyChange: weeklyChange.toFixed(1)
      };
    } catch (error) {
      console.error('Error fetching weekly forecast:', error);
      throw new Error('Failed to fetch weekly forecast data');
    }
  },

  async getEnergyHistoryDaily() {
    try {
      // Get data for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const generator1Data = await db.select().from(schema.generator1)
        .where(gte(schema.generator1.time, sevenDaysAgo))
        .orderBy(schema.generator1.time);
      
      const grid1Data = await db.select().from(schema.grid1)
        .where(gte(schema.grid1.time, sevenDaysAgo))
        .orderBy(schema.grid1.time);
      
      // Group data by day
      const dailyData: Record<string, { production: number, consumption: number, gridExport: number }> = {};
      
      generator1Data.forEach(record => {
        const date = new Date(record.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        if (!dailyData[date]) {
          dailyData[date] = { production: 0, consumption: 0, gridExport: 0 };
        }
        
        dailyData[date].production += Number(record.kwt || 0);
      });
      
      grid1Data.forEach(record => {
        const date = new Date(record.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        if (!dailyData[date]) {
          dailyData[date] = { production: 0, consumption: 0, gridExport: 0 };
        }
        
        dailyData[date].consumption += Number(record.kwh_import || 0);
        dailyData[date].gridExport += Number(record.kwh_export || 0);
      });
      
      // Convert to array and sort by date
      return Object.entries(dailyData).map(([date, data]) => ({
        date,
        production: data.production,
        consumption: data.consumption,
        gridExport: data.gridExport
      }));
    } catch (error) {
      console.error('Error fetching energy history daily:', error);
      throw new Error('Failed to fetch daily energy history');
    }
  },

  async getEnergyHistoryMonthly() {
    try {
      // Get data for the last 12 months
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      const generator1Data = await db.select().from(schema.generator1)
        .where(gte(schema.generator1.time, oneYearAgo))
        .orderBy(schema.generator1.time);
      
      const grid1Data = await db.select().from(schema.grid1)
        .where(gte(schema.grid1.time, oneYearAgo))
        .orderBy(schema.grid1.time);
      
      // Group data by month
      const monthlyData: Record<string, { production: number, consumption: number, gridExport: number }> = {};
      
      generator1Data.forEach(record => {
        const month = new Date(record.time).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[month]) {
          monthlyData[month] = { production: 0, consumption: 0, gridExport: 0 };
        }
        
        monthlyData[month].production += Number(record.kwt || 0);
      });
      
      grid1Data.forEach(record => {
        const month = new Date(record.time).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[month]) {
          monthlyData[month] = { production: 0, consumption: 0, gridExport: 0 };
        }
        
        monthlyData[month].consumption += Number(record.kwh_import || 0);
        monthlyData[month].gridExport += Number(record.kwh_export || 0);
      });
      
      // Convert to array and sort by month
      return Object.entries(monthlyData).map(([month, data]) => ({
        month,
        production: data.production,
        consumption: data.consumption,
        gridExport: data.gridExport
      }));
    } catch (error) {
      console.error('Error fetching energy history monthly:', error);
      throw new Error('Failed to fetch monthly energy history');
    }
  },

  async getEnergyHistoryYearly() {
    try {
      // Get data for multiple years
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
      
      const generator1Data = await db.select().from(schema.generator1)
        .where(gte(schema.generator1.time, fiveYearsAgo))
        .orderBy(schema.generator1.time);
      
      const grid1Data = await db.select().from(schema.grid1)
        .where(gte(schema.grid1.time, fiveYearsAgo))
        .orderBy(schema.grid1.time);
      
      // Group data by year
      const yearlyData: Record<string, { production: number, consumption: number, gridExport: number }> = {};
      
      generator1Data.forEach(record => {
        const year = new Date(record.time).getFullYear().toString();
        
        if (!yearlyData[year]) {
          yearlyData[year] = { production: 0, consumption: 0, gridExport: 0 };
        }
        
        yearlyData[year].production += Number(record.kwt || 0);
      });
      
      grid1Data.forEach(record => {
        const year = new Date(record.time).getFullYear().toString();
        
        if (!yearlyData[year]) {
          yearlyData[year] = { production: 0, consumption: 0, gridExport: 0 };
        }
        
        yearlyData[year].consumption += Number(record.kwh_import || 0);
        yearlyData[year].gridExport += Number(record.kwh_export || 0);
      });
      
      // Convert to array and sort by year
      return Object.entries(yearlyData).map(([year, data]) => ({
        year,
        production: data.production,
        consumption: data.consumption,
        gridExport: data.gridExport
      }));
    } catch (error) {
      console.error('Error fetching energy history yearly:', error);
      throw new Error('Failed to fetch yearly energy history');
    }
  },

  async getEnergyDistribution() {
    try {
      // Get latest data from each power source
      const [grid1Data] = await db.select().from(schema.grid1).orderBy(desc(schema.grid1.time)).limit(1);
      const [grid2Data] = await db.select().from(schema.grid2).orderBy(desc(schema.grid2.time)).limit(1);
      const [generator1Data] = await db.select().from(schema.generator1).orderBy(desc(schema.generator1.time)).limit(1);
      const [generator2Data] = await db.select().from(schema.generator2).orderBy(desc(schema.generator2.time)).limit(1);
      const [inverter1Data] = await db.select().from(schema.inverter1).orderBy(desc(schema.inverter1.time)).limit(1);
      const [inverter2Data] = await db.select().from(schema.inverter2).orderBy(desc(schema.inverter2.time)).limit(1);
      
      // Calculate power distribution
      const gridTotal = Number(grid1Data?.kwt || 0) + Number(grid2Data?.kwt || 0);
      const generatorTotal = Number(generator1Data?.kwt || 0) + Number(generator2Data?.kwt || 0);
      const inverterTotal = Number(inverter1Data?.kwt || 0) + Number(inverter2Data?.kwt || 0);
      
      return [
        { name: 'Grid', value: gridTotal },
        { name: 'Generator', value: generatorTotal },
        { name: 'Inverter', value: inverterTotal }
      ];
    } catch (error) {
      console.error('Error fetching energy distribution:', error);
      throw new Error('Failed to fetch energy distribution data');
    }
  }
};
