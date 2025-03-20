import React, { useState } from "react";
import DashboardHeader from "@/components/layouts/dashboard-header";
import GeneratorPerformance from "@/components/dashboard/generator-performance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Generator() {
  const [timeRange, setTimeRange] = useState('last-24h');
  
  const { data: performanceData, isLoading: isPerformanceLoading } = useQuery<any[]>({
    queryKey: ['/api/generator/performance/hourly', timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/generator/performance/hourly?timeRange=${timeRange}`);
      if (!res.ok) throw new Error('Failed to fetch generator performance data');
      return res.json();
    }
  });

  const { data: temperatureData, isLoading: isTemperatureLoading } = useQuery<{current: number, max: number, min: number}>({
    queryKey: ['/api/generator/temperature'],
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="p-4 md:p-6">
      <DashboardHeader 
        title="Generator Monitoring" 
        description="Monitor and analyze solar panel performance"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GeneratorPerformance />
        
        <Card>
          <CardHeader>
            <CardTitle>Panel Efficiency Distribution</CardTitle>
            <CardDescription>Current efficiency by panel groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {/* Just show a placeholder for now */}
              <div className="flex items-center justify-center h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Roof East', value: 96 },
                        { name: 'Roof West', value: 98 },
                        { name: 'Garage', value: 87 },
                        { name: 'Ground Array', value: 72 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {
                        [0, 1, 2, 3].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))
                      }
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>Generator output by time period</CardDescription>
          </div>
          
          <div className="flex items-center gap-3">
            <Select 
              value={timeRange} 
              onValueChange={(value) => setTimeRange(value)}
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
          <div className="h-80">
            {isPerformanceLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : !performanceData ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No performance data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                    minTickGap={30}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    width={40}
                    label={{ value: 'kW', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip formatter={(value) => [`${value} kW`, 'Output']} />
                  <Legend />
                  <Line 
                    type="linear" 
                    dataKey="value" 
                    name="Generator Output" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Panel Temperature</CardTitle>
          <CardDescription>Temperature of panel arrays over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {isTemperatureLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : !temperatureData ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No temperature data available</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold mb-1">Current Temperature</h3>
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                    {temperatureData.current}°C
                  </div>
                  <div className="text-gray-500 mt-2">
                    Min: {temperatureData.min}°C | Max: {temperatureData.max}°C
                  </div>
                </div>
                
                <div className="w-full max-w-md h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-red-500"
                    style={{ 
                      width: `${Math.max(0, Math.min(100, ((temperatureData.current - temperatureData.min) / (temperatureData.max - temperatureData.min)) * 100))}%` 
                    }}
                  />
                </div>
                
                <div className="w-full max-w-md flex justify-between mt-2 text-sm text-gray-500">
                  <span>{temperatureData.min}°C</span>
                  <span>Optimal Range</span>
                  <span>{temperatureData.max}°C</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
