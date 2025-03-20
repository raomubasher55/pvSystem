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
  return (
    <div className="p-4 md:p-6">
      <DashboardHeader 
        title="System Overview" 
        description="Monitor your PV system performance in real-time"
      />
      
      <WeatherWidget />
      
      <KpiGrid />
      
      <EnergyChart />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SystemStatus />
        <GeneratorPerformance />
        <PowerSourceDistribution />
      </div>
      
      <GridStatus />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <AlertsTable />
        <EnergyForecast />
      </div>
    </div>
  );
}


