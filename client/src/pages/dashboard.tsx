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
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("last-24h");
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    // Invalidate and refetch relevant dashboard queries
    queryClient.invalidateQueries({ queryKey: ['/api/energy/chart', timeRange] });
    queryClient.invalidateQueries({ queryKey: ['/api/system/status', timeRange] });
    queryClient.invalidateQueries({ queryKey: ['/api/generator/performance', timeRange] });
    queryClient.invalidateQueries({ queryKey: ['/api/energy/distribution', timeRange] });
    queryClient.invalidateQueries({ queryKey: ['/api/grid/status', timeRange] });
    queryClient.invalidateQueries({ queryKey: ['/api/alerts', timeRange] });
    queryClient.invalidateQueries({ queryKey: ['/api/energy/forecast', timeRange] });
    queryClient.invalidateQueries({ queryKey: ['/api/weather'] }); // Weather doesn't use timeRange
    queryClient.invalidateQueries({ queryKey: ['/api/kpis'] }); // KPIs don't use timeRange
  };

  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
    // Reset custom date range if not using custom
    if (newTimeRange !== 'custom') {
      setCustomDateRange(null);
    }
    // This will trigger re-fetches in components that depend on timeRange
  };

  const handleCustomDateChange = (startDate: Date, endDate: Date) => {
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');
    
    setCustomDateRange({
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });
    
    // This will trigger re-fetches in components that depend on customDateRange
  };

  // Compute the effective time range param that will be passed to components
  const effectiveTimeRange = timeRange === 'custom' && customDateRange 
    ? `custom:${customDateRange.startDate}:${customDateRange.endDate}`
    : timeRange;

  return (
    <div className="p-4 md:p-6">
      <DashboardHeader 
        title="System Overview" 
        description="Monitor your PV system performance in real-time"
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onCustomDateChange={handleCustomDateChange}
        onRefresh={handleRefresh}
        showExport={false}
      />
      
      <WeatherWidget />
      
      <KpiGrid />
      
      <EnergyChart timeRange={effectiveTimeRange} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SystemStatus timeRange={effectiveTimeRange} />
        <GeneratorPerformance timeRange={effectiveTimeRange} />
        <PowerSourceDistribution timeRange={effectiveTimeRange} />
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Grid Status</h2>
          <Link href="/grid-monitoring">
            <Button variant="outline" size="sm" className="gap-1">
              <span>View Details</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <GridStatus timeRange={effectiveTimeRange} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <AlertsTable timeRange={effectiveTimeRange} />
        <EnergyForecast timeRange={effectiveTimeRange} />
      </div>

      <div className="flex flex-wrap gap-4 my-8 justify-center">
        <Link href="/grid-monitoring">
          <Button className="min-w-[200px] p-6 flex flex-col h-auto gap-2 items-center">
            <span className="text-lg font-medium">Grid Monitoring</span>
            <span className="text-sm opacity-70">Detailed grid parameters</span>
          </Button>
        </Link>
        <Link href="/generator">
          <Button className="min-w-[200px] p-6 flex flex-col h-auto gap-2 items-center">
            <span className="text-lg font-medium">Generator Details</span>
            <span className="text-sm opacity-70">Performance & monitoring</span>
          </Button>
        </Link>
        <Link href="/source-monitor">
          <Button className="min-w-[200px] p-6 flex flex-col h-auto gap-2 items-center">
            <span className="text-lg font-medium">Inverter Monitor</span>
            <span className="text-sm opacity-70">Inverter parameters</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}


