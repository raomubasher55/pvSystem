import { useQuery } from "@tanstack/react-query";
import { GridData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface GridStatusProps {
  timeRange?: string;
}

export default function GridStatus({ timeRange: externalTimeRange }: GridStatusProps) {
  const [localTimeRange, setLocalTimeRange] = useState('last-24h');
  
  // Use external timeRange if provided, otherwise use local state
  const timeRange = externalTimeRange || localTimeRange;
  
  const { data, isLoading } = useQuery<GridData>({
    queryKey: ['/api/grid/status', timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/grid/status?timeRange=${timeRange}`);
      if (!res.ok) throw new Error('Failed to fetch grid status');
      return res.json();
    }
  });

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Grid Monitoring</CardTitle>
          <CardDescription>Power exchange with the grid</CardDescription>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-sm font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Grid Stable
          </span>
          <Select 
            value={timeRange} 
            onValueChange={(value) => setLocalTimeRange(value)}
          >
            <SelectTrigger className="w-[150px] h-8 text-sm">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-24h">Last 24 hours</SelectItem>
              <SelectItem value="last-7d">Last 7 days</SelectItem>
              <SelectItem value="last-30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-7 w-20 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))
          ) : !data ? (
            <div className="col-span-4 text-center py-6">
              <p className="text-gray-500 dark:text-gray-400">No grid data available</p>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Grid Import</p>
                <div className="flex items-baseline">
                  <h4 className="text-xl font-bold">{data.import}</h4>
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">kWh</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Today</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{data.importChange < 0 ? `${Math.abs(data.importChange)}% lower` : `${data.importChange}% higher`} than yesterday</span>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Grid Export</p>
                <div className="flex items-baseline">
                  <h4 className="text-xl font-bold">{data.export}</h4>
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">kWh</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Today</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{data.exportChange}% higher than yesterday</span>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Net Balance</p>
                <div className="flex items-baseline">
                  <h4 className="text-xl font-bold text-green-600 dark:text-green-400">{data.netBalance}</h4>
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">kWh</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Net Positive</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Exporting to grid</span>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Grid Status</p>
                <div className="flex items-baseline">
                  <h4 className="text-xl font-bold">{data.voltage}</h4>
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">V</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Normal</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Frequency: {data.frequency} Hz</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="h-64">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : !data || !data.chartData ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">No chart data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />
                <YAxis tick={{ fontSize: 12 }} width={40} />
                <Tooltip 
                  formatter={(value) => [`${value} kWh`, undefined]}
                />
                <Legend />
                <Bar 
                  name="Import from Grid" 
                  dataKey="import" 
                  fill="#f59e0b" 
                  barSize={20}
                  isAnimationActive={false}
                />
                <Bar 
                  name="Export to Grid" 
                  dataKey="export" 
                  fill="#10b981" 
                  barSize={20}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
