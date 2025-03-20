import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell 
} from 'recharts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { useLocation } from 'wouter';
import DashboardHeader from '@/components/layouts/dashboard-header';
import { Battery, Activity, BatteryCharging, Sun, Zap } from 'lucide-react';

export const SourceMonitor = () => {
  const [location, params] = useLocation();
  const [timeRange, setTimeRange] = useState('last-24h');
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const queryClient = useQueryClient();
  
  // Get source type from route parameters or query parameters or default to inverter1
  const sourceId = params?.sourceId;
  const sourceType = sourceId || new URLSearchParams(window.location.search).get('source') || 'inverter1';
  
  // Format display name
  const getDisplayName = (source: string) => {
    const parts = source.match(/([a-zA-Z]+)(\d+)/) || [];
    if (parts.length >= 3) {
      return `${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)} ${parts[2]}`;
    }
    return source.charAt(0).toUpperCase() + source.slice(1);
  };
  
  const displayName = getDisplayName(sourceType);
  
  // Compute the effective time range param that will be passed to API
  const effectiveTimeRange = timeRange === 'custom' && customDateRange 
    ? `custom:${customDateRange.startDate}:${customDateRange.endDate}`
    : timeRange;
    
  // Fetch source data from API based on sourceType
  const { data: sourceData, isLoading: isSourceLoading, refetch: refetchSource } = useQuery({
    queryKey: [`/api/sources/${sourceType}`, effectiveTimeRange],
    queryFn: async () => {
      const res = await fetch(`/api/sources/${sourceType}?timeRange=${effectiveTimeRange}`);
      if (!res.ok) throw new Error(`Failed to fetch ${sourceType} data`);
      return res.json();
    },
    enabled: !!sourceType,
  });
  
  // Mock data for additional metrics
  const efficiencyData = [
    { time: '1 AM', value: 95 },
    { time: '2 AM', value: 93 },
    { time: '3 AM', value: 92 },
    { time: '4 AM', value: 94 },
    { time: '5 AM', value: 96 },
    { time: '6 AM', value: 97 },
    { time: '7 AM', value: 98 },
    { time: '8 AM', value: 97 },
    { time: '9 AM', value: 96 },
    { time: '10 AM', value: 94 },
    { time: '11 AM', value: 93 },
    { time: '12 PM', value: 92 },
  ];
  
  const temperatureData = {
    current: 42,
    max: 80,
    min: 20,
  };

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
    refetchSource();
  };
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
  
  // Source-specific UI components
  const getSourceIcon = (source: string) => {
    if (source.includes('inverter')) return <BatteryCharging className="h-6 w-6 text-blue-500" />;
    if (source.includes('grid')) return <Zap className="h-6 w-6 text-amber-500" />;
    if (source.includes('generator')) return <Activity className="h-6 w-6 text-green-500" />;
    return <Sun className="h-6 w-6 text-orange-500" />;
  };
  
  // Get appropriate parameters based on source type
  const getSourceParameters = () => {
    if (sourceType.includes('inverter')) {
      return [
        { label: 'Line-Line Voltage', value: '230/400 V' },
        { label: 'Current Phase A', value: '8.7 A' },
        { label: 'Current Phase B', value: '8.5 A' },
        { label: 'Current Phase C', value: '8.9 A' },
        { label: 'L-L Voltage Range', value: '390-410 V' },
        { label: 'Active Power', value: '3.8 kW' },
        { label: 'Reactive Power', value: '1.2 kVAR' },
        { label: 'Power Factor', value: '0.95' },
        { label: 'Frequency', value: '50 Hz' },
        { label: 'DC Input Voltage', value: '320 V' },
        { label: 'Battery SOC', value: '78%' },
        { label: 'Battery Temperature', value: '34°C' },
        { label: 'PV Input Power', value: '4.5 kW' },
        { label: 'AC Output Power', value: '3.8 kW' },
      ];
    }
    
    if (sourceType.includes('grid')) {
      return [
        { label: 'Line-Line Voltage', value: '230/400 V' },
        { label: 'Current Phase A', value: '12.3 A' },
        { label: 'L-L Voltage Range', value: '390-410 V' },
        { label: 'Power Factor', value: '0.97' },
        { label: 'Frequency', value: '50 Hz' },
        { label: 'Net Energy Balance', value: '+2.1 kWh' },
      ];
    }
    
    if (sourceType.includes('generator')) {
      return [
        { label: 'Operational Hours', value: '12,345 hours' },
        { label: 'Load Factor', value: '72%' },
        { label: 'Power Output', value: '5.2 kW' },
        { label: 'Oil Temperature', value: '78°C' },
        { label: 'Fuel Level', value: '87%' },
        { label: 'Next Service', value: '120 hours' },
      ];
    }
    
    return [
      { label: 'Parameter 1', value: 'Value 1' },
      { label: 'Parameter 2', value: 'Value 2' },
      { label: 'Parameter 3', value: 'Value 3' },
      { label: 'Parameter 4', value: 'Value 4' },
      { label: 'Parameter 5', value: 'Value 5' },
      { label: 'Parameter 6', value: 'Value 6' },
    ];
  };
  
  const sourceParameters = getSourceParameters();

  return (
    <div className="p-4 md:p-6">
      <DashboardHeader 
        title={`${displayName} Monitoring`}
        description={`Monitor and analyze detailed parameters for ${displayName}`}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onCustomDateChange={handleCustomDateChange}
        onRefresh={handleRefresh}
        showExport={true}
        onExport={() => alert('Export functionality will be available soon')}
      />
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 mb-6">
        {isSourceLoading ? (
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
                  <p className="text-gray-500">Efficiency</p>
                  <Skeleton className="h-8 w-24 mx-auto mt-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-500">Status</p>
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
                  <h3 className="text-xl font-bold">4.2 kW</h3>
                  <p className="text-xs text-gray-400 mt-1">Current production</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-500">Efficiency</p>
                  <h3 className="text-xl font-bold">94%</h3>
                  <p className="text-xs text-gray-400 mt-1">Based on rated capacity</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-500">Status</p>
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
              <CardTitle>Output Over Time</CardTitle>
              <CardDescription>Performance by time period</CardDescription>
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
              {isSourceLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : !efficiencyData ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">No data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={efficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={(time) => {
                        try {
                          return time;
                        } catch (e) {
                          return time;
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
                          return label;
                        } catch (e) {
                          return label;
                        }
                      }}
                    />
                    <Legend />
                    <Line 
                      type="linear" 
                      dataKey="value" 
                      name="Output" 
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
            <CardTitle>Key Parameters</CardTitle>
            <CardDescription>Current operating metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sourceParameters.map((param, index) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{param.label}</p>
                  <p className="font-medium">{param.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{displayName} Details</CardTitle>
          <CardDescription>Comprehensive parameters and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="quality">Power Quality</TabsTrigger>
              <TabsTrigger value="technical">Technical Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Efficiency</p>
                  <p className="font-medium">94%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Power Ratio</p>
                  <p className="font-medium">0.92</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Capacity Factor</p>
                  <p className="font-medium">68%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Energy Production (MTD)</p>
                  <p className="font-medium">1,120 kWh</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Energy Production (YTD)</p>
                  <p className="font-medium">10,280 kWh</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Lifetime Production</p>
                  <p className="font-medium">98,456 kWh</p>
                </div>
              </div>
              
              <div className="h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Jan', value: 1200 },
                    { name: 'Feb', value: 980 },
                    { name: 'Mar', value: 1120 },
                    { name: 'Apr', value: 1400 },
                    { name: 'May', value: 1600 },
                    { name: 'Jun', value: 1800 },
                    { name: 'Jul', value: 2000 },
                    { name: 'Aug', value: 2200 },
                    { name: 'Sep', value: 1900 },
                    { name: 'Oct', value: 1700 },
                    { name: 'Nov', value: 1500 },
                    { name: 'Dec', value: 1300 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} kWh`, 'Energy']} />
                    <Legend />
                    <Bar dataKey="value" name="Monthly Energy Production" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="health" className="space-y-4">
              <div className="h-80">
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
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Operating Time</p>
                  <p className="font-medium">16,240 hours</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Health Score</p>
                  <p className="font-medium">92%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Last Maintenance</p>
                  <p className="font-medium">2024-11-20</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="quality" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Power Factor</p>
                  <p className="font-medium">0.95</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">THD Voltage</p>
                  <p className="font-medium">2.2%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">THD Current</p>
                  <p className="font-medium">3.1%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Frequency Stability</p>
                  <p className="font-medium">±0.05 Hz</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Ripple Voltage</p>
                  <p className="font-medium">1.8%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Voltage Regulation</p>
                  <p className="font-medium">±1.2%</p>
                </div>
              </div>
              
              <div className="h-64 mt-6">
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Detailed power quality analysis coming soon</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Rated Power</p>
                  <p className="font-medium">5 kW</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Rated Voltage</p>
                  <p className="font-medium">230 V</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Rated Current</p>
                  <p className="font-medium">21.7 A</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Frequency</p>
                  <p className="font-medium">50 Hz</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">MPPT Range</p>
                  <p className="font-medium">120-450 V</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Max. Efficiency</p>
                  <p className="font-medium">97.8%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">IP Rating</p>
                  <p className="font-medium">IP65</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Cooling</p>
                  <p className="font-medium">Fan Cooled</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Dimensions</p>
                  <p className="font-medium">540 x 360 x 145 mm</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Distribution</CardTitle>
            <CardDescription>Energy flow allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Home Use', value: 65 },
                      { name: 'Grid Export', value: 20 },
                      { name: 'Battery Storage', value: 15 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1, 2].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Events</CardTitle>
            <CardDescription>Recent notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">System updated</p>
                    <p className="text-xs text-gray-500">2025-03-15 09:22:05</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Battery below 20%</p>
                    <p className="text-xs text-gray-500">2025-03-12 22:15:30</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Connected to grid</p>
                    <p className="text-xs text-gray-500">2025-03-10 06:45:12</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SourceMonitor;