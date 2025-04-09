import { Card } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Define types based on actual API response
type ApiEnergyData = {
  total_power: number;
  kwh_import: number;
  kwh_export: number;
  time: string;
};

type ChartEnergyData = {
  time: string;
  production: number;
  consumption: number;
  grid: number;
};

type EnergyDistribution = {
  name: string;
  value: number;
};

// Remove mock data as we are using real data from API

interface EnergyChartProps {
  timeRange?: string;
}

export default function EnergyChart({ timeRange: externalTimeRange }: EnergyChartProps) {
  const [localTimeRange, setLocalTimeRange] = useState('last-24h');
  
  // Use external timeRange if provided, otherwise use local state
  const timeRange = externalTimeRange || localTimeRange;
  
  // Use the new energy chart data API endpoint with time range
  const { data: chartData, isLoading: isLoadingEnergy } = useQuery<ChartEnergyData[]>({
    queryKey: ['/api/energy/chart', timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/energy/chart?timeRange=${timeRange}`);
      if (!res.ok) throw new Error('Failed to fetch energy chart data');
      return res.json();
    }
  });

  // Distribution data for the pie chart
  const { data: distributionData, isLoading: isLoadingDistribution } = useQuery<EnergyDistribution[]>({
    queryKey: ['/api/energy/distribution'],
  });

  // Log data for debugging
  console.log("Chart data from API:", chartData);
  
  // Use the chart data directly without transformation
  const transformedEnergyData = useMemo(() => {
    return chartData || [];
  }, [chartData]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  // Format date function
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timestamp; // Return as is if parsing fails
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-semibold">Energy Production</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Daily power generation</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center mr-4 order-first w-full md:w-auto md:order-none">
              <Select 
                value={timeRange.startsWith('custom:') ? 'custom' : timeRange} 
                onValueChange={(value) => setLocalTimeRange(value)}
              >
                <SelectTrigger className="w-full md:w-[150px] h-9 text-sm">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-24h">Last 24 hours</SelectItem>
                  <SelectItem value="last-7d">Last 7 days</SelectItem>
                  <SelectItem value="last-30d">Last 30 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mt-2 md:mt-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Production</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Consumption</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Grid</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-64">
          {isLoadingEnergy ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="h-full w-full" />
            </div>
          ) : !transformedEnergyData || transformedEnergyData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">No energy data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transformedEnergyData}>
                <defs>
                  <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  tickFormatter={(time) => {
                    try {
                      const date = new Date(time);
                      return date.toLocaleTimeString([], { hour: '2-digit' });
                    } catch (e) {
                      return time.split(' ')[1]?.split(':')[0] || time;
                    }
                  }}
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  width={40}
                />
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <Tooltip 
                  formatter={(value) => [`${value} kW`, undefined]}
                  labelFormatter={formatTime}
                />
                <Area 
                  type="linear" 
                  dataKey="production" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorProduction)" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
                <Area 
                  type="linear" 
                  dataKey="consumption" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorConsumption)" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
                <Area 
                  type="linear" 
                  dataKey="grid" 
                  stroke="#f59e0b" 
                  fillOpacity={1} 
                  fill="url(#colorGrid)" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Energy Distribution</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current usage allocation</p>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center">
          {isLoadingDistribution ? (
            <Skeleton className="h-48 w-48 rounded-full" />
          ) : !distributionData || distributionData.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No distribution data available</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, undefined]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}