import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardHeader from "@/components/layouts/dashboard-header";
import WeatherWidget from "@/components/dashboard/weather-widget";
import KpiGrid from "@/components/dashboard/kpi-grid";
import EnergyChart from "@/components/dashboard/energy-chart";
import SystemStatus from "@/components/dashboard/system-status";
import GeneratorPerformance from "@/components/dashboard/generator-performance";
import GridStatus from "@/components/dashboard/grid-status";
import AlertsTable from "@/components/dashboard/alerts-table";
import EnergyForecast from "@/components/dashboard/energy-forecast";
import PowerSourceDistribution from "@/components/dashboard/power-source-distribution";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("last-24h");
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    // Invalidate and refetch relevant dashboard queries
    queryClient.invalidateQueries(['/api/energy/chart']);
    queryClient.invalidateQueries(['/api/system/status']);
    queryClient.invalidateQueries(['/api/generator/performance']);
    queryClient.invalidateQueries(['/api/energy/distribution']);
    queryClient.invalidateQueries(['/api/grid/status']);
    queryClient.invalidateQueries(['/api/alerts']);
    queryClient.invalidateQueries(['/api/energy/forecast']);
    queryClient.invalidateQueries(['/api/weather']);
    queryClient.invalidateQueries(['/api/kpis']);
  };

  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
    // This will trigger re-fetches in components that depend on timeRange
  };

  return (
    <div className="p-4 md:p-6">
      <DashboardHeader 
        title="System Overview" 
        description="Monitor your PV system performance in real-time"
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onRefresh={handleRefresh}
        showExport={false}
      />
      
      <WeatherWidget />
      
      <KpiGrid />
      
      <EnergyChart timeRange={timeRange} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SystemStatus />
        <GeneratorPerformance />
        <PowerSourceDistribution />
      </div>
      
      <GridStatus timeRange={timeRange} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <AlertsTable />
        <EnergyForecast />
      </div>
    </div>
  );
}


