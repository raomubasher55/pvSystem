import DashboardHeader from "@/components/layouts/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  Bar
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DownloadIcon,
  FileTextIcon,
  FileSpreadsheetIcon, 
  FileJsonIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

// Define proper types for our data
type DailyData = {
  date: string;
  production: number;
  consumption: number;
  gridExport: number;
};

type MonthlyData = {
  month: string;
  production: number;
  consumption: number;
  gridExport: number;
};

type YearlyData = {
  year: string;
  production: number;
  consumption: number;
  gridExport: number;
};

// Mock yearly data since it appears to be missing
const mockYearlyData = [
  { year: '2020', production: 9500, consumption: 8900, gridExport: 600 },
  { year: '2021', production: 10200, consumption: 9100, gridExport: 1100 },
  { year: '2022', production: 11800, consumption: 9800, gridExport: 2000 },
  { year: '2023', production: 12500, consumption: 10400, gridExport: 2100 },
  { year: '2024', production: 13800, consumption: 11200, gridExport: 2600 },
  { year: '2025', production: 7200, consumption: 5900, gridExport: 1300 },
];

export default function EnergyHistory() {
  const [activeTab, setActiveTab] = useState("daily");

  const { data: dailyData, isLoading: isDailyLoading } = useQuery<DailyData[]>({
    queryKey: ['/api/energy/history/daily'],
  });

  const { data: monthlyData, isLoading: isMonthlyLoading } = useQuery<MonthlyData[]>({
    queryKey: ['/api/energy/history/monthly'],
  });

  const { data: yearlyData, isLoading: isYearlyLoading } = useQuery<YearlyData[]>({
    queryKey: ['/api/energy/history/yearly'],
    // Add fallback mock data if your API isn't returning yearly data yet
    initialData: mockYearlyData,
  });

  // Function to format labels and tooltip values
  const formatEnergy = (value: number) => `${value} kWh`;
  
  // Custom Tooltip for the charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-gray-200 dark:border-slate-700 rounded-md shadow-md">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {formatEnergy(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Function to get active data based on the current tab
  const getActiveData = () => {
    switch (activeTab) {
      case "daily":
        return dailyData || [];
      case "monthly":
        return monthlyData || [];
      case "yearly":
        return yearlyData || [];
      default:
        return [];
    }
  };

  // Export functions
  const exportToCSV = () => {
    const data = getActiveData();
    if (!data.length) return;
    
    // Get headers based on first data item
    const headers = Object.keys(data[0]).join(',');
    // Map each row to CSV format
    const rows = data.map(item => Object.values(item).join(','));
    // Combine headers and rows
    const csvContent = [headers, ...rows].join('\n');
    
    // Create downloadable link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set filename based on active tab
    link.href = url;
    link.setAttribute('download', `energy-data-${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const data = getActiveData();
    if (!data.length) return;
    
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', `energy-data-${activeTab}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportToXLSX = () => {
    // For actual XLSX export, you would need a library like xlsx or exceljs
    // This is a simplified version that creates a TSV which Excel can open
    const data = getActiveData();
    if (!data.length) return;
    
    const headers = Object.keys(data[0]).join('\t');
    const rows = data.map(item => Object.values(item).join('\t'));
    const tsvContent = [headers, ...rows].join('\n');
    
    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', `energy-data-${activeTab}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6">
      <DashboardHeader 
        title="Energy History" 
        description="Track and analyze energy production and consumption over time"
      />
      
      <Card className="mb-6">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Energy Production History</CardTitle>
            <CardDescription>Historical data of your system's energy production</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mt-4 sm:mt-0" disabled={!getActiveData().length}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV}>
                <FileTextIcon className="mr-2 h-4 w-4" />
                <span>Export as CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToJSON}>
                <FileJsonIcon className="mr-2 h-4 w-4" />
                <span>Export as JSON</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToXLSX}>
                <FileSpreadsheetIcon className="mr-2 h-4 w-4" />
                <span>Export as XLSX</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="daily" 
            className="space-y-6"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList>
              <TabsTrigger value="daily">Daily View</TabsTrigger>
              <TabsTrigger value="monthly">Monthly View</TabsTrigger>
              <TabsTrigger value="yearly">Yearly View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="space-y-4">
              <div className="h-80">
                {isDailyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : !dailyData || dailyData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">No daily data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        interval="preserveEnd"
                        minTickGap={20}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatEnergy}
                        width={60}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: 10 }} />
                      <Line 
                        type="linear" 
                        dataKey="production" 
                        name="Production" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                        isAnimationActive={false}
                      />
                      <Line 
                        type="linear" 
                        dataKey="consumption" 
                        name="Consumption" 
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                        isAnimationActive={false}
                      />
                      <Line 
                        type="linear" 
                        dataKey="gridExport" 
                        name="Grid Export" 
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="monthly" className="space-y-4">
              <div className="h-80">
                {isMonthlyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : !monthlyData || monthlyData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">No monthly data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                        minTickGap={30}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatEnergy}
                        width={60}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: 10 }} />
                      <Bar 
                        dataKey="production" 
                        name="Production" 
                        fill="#3b82f6" 
                        radius={[4, 4, 0, 0]}
                        barSize={25}
                        isAnimationActive={false}
                      />
                      <Bar 
                        dataKey="consumption" 
                        name="Consumption" 
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        barSize={25}
                        isAnimationActive={false}
                      />
                      <Bar 
                        dataKey="gridExport" 
                        name="Grid Export" 
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                        barSize={25}
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="yearly" className="space-y-4">
              <div className="h-80">
                {isYearlyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : !yearlyData || yearlyData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">No yearly data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatEnergy}
                        width={60}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: 10 }} />
                      <Bar 
                        dataKey="production" 
                        name="Production" 
                        fill="#3b82f6" 
                        radius={[4, 4, 0, 0]}
                        barSize={35}
                        isAnimationActive={false}
                      />
                      <Bar 
                        dataKey="consumption" 
                        name="Consumption" 
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        barSize={35}
                        isAnimationActive={false}
                      />
                      <Bar 
                        dataKey="gridExport" 
                        name="Grid Export" 
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                        barSize={35}
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption Analysis</CardTitle>
            <CardDescription>Breakdown of your energy usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {/* Placeholder for consumption distribution chart */}
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Consumption analysis coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CO₂ Savings</CardTitle>
            <CardDescription>Environmental impact of your solar energy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {/* Placeholder for CO2 savings chart */}
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">CO₂ savings analysis coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}