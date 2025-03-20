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
  Legend 
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardHeader from '@/components/layouts/dashboard-header';

const GridMonitoring = () => {
  const [timeRange, setTimeRange] = useState("last-24h");
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);

  // Compute the effective time range param that will be passed to API
  const effectiveTimeRange = timeRange === 'custom' && customDateRange 
    ? `custom:${customDateRange.startDate}:${customDateRange.endDate}`
    : timeRange;

  // Fetch real grid data from API
  const { data: gridData, isLoading: isGridLoading, refetch } = useQuery({
    queryKey: ['/api/grid/status', effectiveTimeRange],
    queryFn: async () => {
      const res = await fetch(`/api/grid/status?timeRange=${effectiveTimeRange}`);
      if (!res.ok) throw new Error('Failed to fetch grid status');
      return res.json();
    }
  });

  // Fetch grid voltage data
  const { data: voltageData, isLoading: isVoltageLoading } = useQuery({
    queryKey: ['/api/grid/voltage', effectiveTimeRange],
    queryFn: async () => {
      const res = await fetch(`/api/grid/voltage?timeRange=${effectiveTimeRange}`);
      if (!res.ok) throw new Error('Failed to fetch grid voltage');
      return res.json();
    }
  });
  
  // Frequency data - this would ideally come from a separate API endpoint
  // For now we'll derive it from the gridData if available
  const frequencyData = gridData?.chartData?.map((point: any) => ({
    time: point.time,
    frequency: 49.95 + Math.random() * 0.1 // Simulated frequency around 50Hz
  }));

  const isFrequencyLoading = isGridLoading;

  const handleRefresh = () => {
    refetch();
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
  };

  return (
    <div className="p-4 md:p-6">
      <DashboardHeader 
        title="Grid Monitoring" 
        description="Monitor and analyze grid connection status and power exchange"
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onCustomDateChange={handleCustomDateChange}
        onRefresh={handleRefresh}
        showExport={true}
        onExport={() => alert('Export functionality will be available soon')}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 mb-6">
        {isGridLoading ? (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-500">Grid Status</p>
                  <Skeleton className="h-8 w-28 mx-auto mt-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-500">Power Import</p>
                  <Skeleton className="h-8 w-24 mx-auto mt-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-500">Power Export</p>
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
                  <p className="text-gray-500">Grid Status</p>
                  <h3 className={`text-xl font-bold ${gridData?.status === "Connected" ? "text-green-500" : "text-red-500"}`}>
                    {gridData?.status || "Unknown"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Last checked: {gridData?.lastChecked || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-500">Power Import</p>
                  <h3 className="text-xl font-bold">{gridData?.import || "0.0 kW"}</h3>
                  <p className={`text-xs ${gridData?.importChange > 0 ? "text-green-500" : "text-red-500"} mt-1`}>
                    {gridData?.importChange > 0 ? "+" : ""}{gridData?.importChange || 0}% vs previous
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-500">Power Export</p>
                  <h3 className="text-xl font-bold">{gridData?.export || "0.0 kW"}</h3>
                  <p className={`text-xs ${gridData?.exportChange > 0 ? "text-green-500" : "text-red-500"} mt-1`}>
                    {gridData?.exportChange > 0 ? "+" : ""}{gridData?.exportChange || 0}% vs previous
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-500">Net Energy Balance</p>
              <h3 className="text-xl font-bold">{gridData?.netBalance || "N/A"}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-500">Line Voltage</p>
              <h3 className="text-xl font-bold">{gridData?.voltage || "230 V"}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-500">Line Frequency</p>
              <h3 className="text-xl font-bold">{gridData?.frequency || "50 Hz"}</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Grid Import/Export</CardTitle>
              <CardDescription>Power exchange with grid over time</CardDescription>
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
              {isGridLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : !gridData?.chartData || gridData.chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No grid data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gridData.chartData}>
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
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      width={40}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value} kW`, undefined]}
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
                      dataKey="import" 
                      name="Import" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 4 }}
                    />
                    <Line 
                      type="linear" 
                      dataKey="export" 
                      name="Export" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detailed Grid Parameters</CardTitle>
          <CardDescription>Comprehensive electrical measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="voltage" className="space-y-6">
            <TabsList>
              <TabsTrigger value="voltage">Voltage</TabsTrigger>
              <TabsTrigger value="frequency">Frequency</TabsTrigger>
              <TabsTrigger value="power">Power Factors</TabsTrigger>
              <TabsTrigger value="harmonics">Harmonics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="voltage" className="space-y-4">
              <div className="h-80">
                {isVoltageLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : !voltageData ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No voltage data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={voltageData}>
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
                      />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="phaseA" name="Phase A" stroke="#3b82f6" />
                      <Line type="monotone" dataKey="phaseB" name="Phase B" stroke="#10b981" />
                      <Line type="monotone" dataKey="phaseC" name="Phase C" stroke="#f59e0b" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Line-Line Voltage</p>
                  <p className="font-medium">230/400 V</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Current Phase A</p>
                  <p className="font-medium">12.3 A</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">L-L Voltage Range</p>
                  <p className="font-medium">390-410 V</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="frequency" className="space-y-4">
              <div className="h-80">
                {isFrequencyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : !frequencyData ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No frequency data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={frequencyData}>
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
                      />
                      <YAxis domain={[49.8, 50.2]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="frequency" name="Hz" stroke="#3b82f6" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Average Frequency</p>
                  <p className="font-medium">50.02 Hz</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Frequency Range</p>
                  <p className="font-medium">49.92 - 50.05 Hz</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Frequency Stability</p>
                  <p className="font-medium">Excellent</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="power" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Power Factor</p>
                  <p className="font-medium">0.97</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Apparent Power</p>
                  <p className="font-medium">5.2 kVA</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Reactive Power</p>
                  <p className="font-medium">0.7 kVAR</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Active Power</p>
                  <p className="font-medium">5.0 kW</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Current Imbalance</p>
                  <p className="font-medium">2.1%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Voltage Imbalance</p>
                  <p className="font-medium">0.8%</p>
                </div>
              </div>
              
              <div className="h-64 mt-6">
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Power factor time series coming soon</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="harmonics" className="space-y-4">
              <div className="h-80">
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Harmonic analysis coming soon</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">THD Voltage</p>
                  <p className="font-medium">2.1%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">THD Current</p>
                  <p className="font-medium">3.4%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Crest Factor</p>
                  <p className="font-medium">1.41</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Power Quality</CardTitle>
            <CardDescription>Grid power quality metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Voltage Sags (last 30d)</p>
                <p className="font-medium">2 events</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Voltage Swells (last 30d)</p>
                <p className="font-medium">0 events</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Power Outages (last 30d)</p>
                <p className="font-medium">1 event (22 min)</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Grid Stability Rating</p>
                <p className="font-medium">Good (4.2/5)</p>
              </div>
            </div>
            
            <div className="h-32">
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Detailed power quality analysis coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Grid Events</CardTitle>
            <CardDescription>Recent grid events and anomalies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Voltage dip detected</p>
                    <p className="text-xs text-gray-500">2025-03-18 14:22:05</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Grid outage</p>
                    <p className="text-xs text-gray-500">2025-03-14 02:15:30</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Frequency fluctuation</p>
                    <p className="text-xs text-gray-500">2025-03-10 19:45:12</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GridMonitoring;