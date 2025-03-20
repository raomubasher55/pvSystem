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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Cell,
  BarChart,
  Bar,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Radar
} from "recharts";

export default function Generator() {
  const [timeRange, setTimeRange] = useState('last-24h');
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const queryClient = useQueryClient();
  
  // Compute the effective time range param that will be passed to API
  const effectiveTimeRange = timeRange === 'custom' && customDateRange 
    ? `custom:${customDateRange.startDate}:${customDateRange.endDate}`
    : timeRange;
  
  const { data: performanceData, isLoading: isPerformanceLoading, refetch: refetchPerformance } = useQuery<any[]>({
    queryKey: ['/api/generator/performance/hourly', effectiveTimeRange],
    queryFn: async () => {
      const res = await fetch(`/api/generator/performance/hourly?timeRange=${effectiveTimeRange}`);
      if (!res.ok) throw new Error('Failed to fetch generator performance data');
      return res.json();
    }
  });

  const { data: temperatureData, isLoading: isTemperatureLoading } = useQuery<{current: number, max: number, min: number}>({
    queryKey: ['/api/generator/temperature', effectiveTimeRange],
    queryFn: async () => {
      const res = await fetch(`/api/generator/temperature?timeRange=${effectiveTimeRange}`);
      if (!res.ok) throw new Error('Failed to fetch generator temperature data');
      return res.json();
    }
  });
  
  const { data: generatorGroups, isLoading: isGroupsLoading } = useQuery<any[]>({
    queryKey: ['/api/generator/groups', effectiveTimeRange],
    queryFn: async () => {
      const res = await fetch(`/api/generator/groups?timeRange=${effectiveTimeRange}`);
      if (!res.ok) throw new Error('Failed to fetch generator groups data');
      return res.json();
    }
  });
  
  const { data: generatorTotal, isLoading: isTotalLoading } = useQuery<{output: string, efficiency: number}>({
    queryKey: ['/api/generator/total-output', effectiveTimeRange],
    queryFn: async () => {
      const res = await fetch(`/api/generator/total-output?timeRange=${effectiveTimeRange}`);
      if (!res.ok) throw new Error('Failed to fetch generator total output');
      return res.json();
    }
  });

  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
    // Reset custom date range if not using custom
    if (newTimeRange !== 'custom') {
      setCustomDateRange(null);
    }
  };

  const handleCustomDateChange = (startDate: Date, endDate: Date) => {
    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
    
    setCustomDateRange({
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });
    setTimeRange('custom');
  };
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/generator/performance/hourly'] });
    queryClient.invalidateQueries({ queryKey: ['/api/generator/temperature'] });
    queryClient.invalidateQueries({ queryKey: ['/api/generator/groups'] });
    queryClient.invalidateQueries({ queryKey: ['/api/generator/total-output'] });
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="p-4 md:p-6">
      <DashboardHeader 
        title="Generator Monitoring" 
        description="Monitor and analyze generator performance and efficiency"
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onCustomDateChange={handleCustomDateChange}
        onRefresh={handleRefresh}
        showExport={true}
        onExport={() => alert('Export functionality will be available soon')}
      />
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 mb-6">
        {isTotalLoading ? (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-500">Total Output</p>
                  <Skeleton className="h-8 w-28 mx-auto mt-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-500">Average Efficiency</p>
                  <Skeleton className="h-8 w-24 mx-auto mt-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-500">Generator Status</p>
                  <Skeleton className="h-8 w-24 mx-auto mt-2" />
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-500">Total Output</p>
                  <h3 className="text-xl font-bold">{generatorTotal?.output || "0.0 kW"}</h3>
                  <p className="text-xs text-gray-400 mt-1">Current production</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-500">Average Efficiency</p>
                  <h3 className="text-xl font-bold">{generatorTotal?.efficiency ? `${generatorTotal.efficiency}%` : "0%"}</h3>
                  <p className="text-xs text-gray-400 mt-1">Based on rated capacity</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-500">Generator Status</p>
                  <h3 className="text-xl font-bold text-green-500">Online</h3>
                  <p className="text-xs text-gray-400 mt-1">All systems operational</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>Generator output by time period</CardDescription>
            </div>
            
            <Select 
              value={timeRange.startsWith('custom:') ? 'custom' : timeRange} 
              onValueChange={handleTimeRangeChange}
            >
              <SelectTrigger className="w-[150px] h-8 text-sm">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-24h">Last 24 hours</SelectItem>
                <SelectItem value="last-7d">Last 7 days</SelectItem>
                <SelectItem value="last-30d">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isPerformanceLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-full w-full" />
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
                      label={{ value: 'kW', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} kW`, 'Output']}
                      labelFormatter={(label) => {
                        try {
                          const date = new Date(label);
                          return date.toLocaleString();
                        } catch (e) {
                          return label;
                        }
                      }}
                    />
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
        
        <Card>
          <CardHeader>
            <CardTitle>Generator Group Efficiency</CardTitle>
            <CardDescription>Efficiency by generator group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isGroupsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : !generatorGroups || generatorGroups.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No generator group data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generatorGroups.map(group => ({
                        name: group.name,
                        value: group.efficiency
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {generatorGroups.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Efficiency']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generator Details</CardTitle>
          <CardDescription>Comprehensive generator parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="technical">Technical Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Operational Hours</p>
                  <p className="font-medium">12,345 hours</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Load Factor</p>
                  <p className="font-medium">72%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Capacity Factor</p>
                  <p className="font-medium">64%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Energy Production (MTD)</p>
                  <p className="font-medium">1,234 kWh</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Energy Production (YTD)</p>
                  <p className="font-medium">12,345 kWh</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Lifetime Production</p>
                  <p className="font-medium">123,456 kWh</p>
                </div>
              </div>
              
              <div className="h-64 mt-6">
                {isGroupsLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : !generatorGroups || generatorGroups.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No generator group data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generatorGroups}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Output (kW)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`${value}`, undefined]} />
                      <Legend />
                      <Bar dataKey="efficiency" name="Efficiency (%)" fill="#3b82f6" />
                      <Bar dataKey="output" name="Output (kW)" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="temperature" className="space-y-4">
              <div className="h-80">
                {isTemperatureLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-full w-full" />
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
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Oil Temperature</p>
                  <p className="font-medium">78°C</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Exhaust Temperature</p>
                  <p className="font-medium">450°C</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Coolant Temperature</p>
                  <p className="font-medium">82°C</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="maintenance" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Next Service</p>
                  <p className="font-medium">120 hours</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Oil Change</p>
                  <p className="font-medium">78 hours</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Filter Replacement</p>
                  <p className="font-medium">120 hours</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Last Maintenance</p>
                  <p className="font-medium">2024-12-15</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Maintenance Status</p>
                  <p className="font-medium text-green-500">Up to date</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Fuel Level</p>
                  <p className="font-medium">87%</p>
                </div>
              </div>
              
              <div className="h-48 mt-6">
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Maintenance history chart coming soon</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Rated Power</p>
                  <p className="font-medium">250 kW</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Rated Voltage</p>
                  <p className="font-medium">400 V</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Rated Current</p>
                  <p className="font-medium">360 A</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Frequency</p>
                  <p className="font-medium">50 Hz</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Power Factor</p>
                  <p className="font-medium">0.8</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">RPM</p>
                  <p className="font-medium">1500</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Engine Type</p>
                  <p className="font-medium">Diesel</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Cooling System</p>
                  <p className="font-medium">Water Cooled</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Fuel Consumption</p>
                  <p className="font-medium">62 L/hr</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {isGroupsLoading ? (
                <Skeleton className="h-full w-full" />
              ) : !generatorGroups || generatorGroups.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No generator data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={[
                    { subject: 'Efficiency', A: 85, fullMark: 100 },
                    { subject: 'Reliability', A: 92, fullMark: 100 },
                    { subject: 'Uptime', A: 98, fullMark: 100 },
                    { subject: 'Fuel Economy', A: 75, fullMark: 100 },
                    { subject: 'Power Quality', A: 88, fullMark: 100 },
                    { subject: 'Response Time', A: 90, fullMark: 100 },
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Performance" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alarm History</CardTitle>
            <CardDescription>Recent generator alarms and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Low fuel warning</p>
                    <p className="text-xs text-gray-500">2025-02-18 14:22:05</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Maintenance reminder</p>
                    <p className="text-xs text-gray-500">2025-01-14 08:15:30</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">High temperature warning</p>
                    <p className="text-xs text-gray-500">2024-12-10 19:45:12</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
