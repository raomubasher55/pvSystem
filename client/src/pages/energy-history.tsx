import DashboardHeader from "@/components/layouts/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function EnergyHistory() {
  const { data: dailyData, isLoading: isDailyLoading } = useQuery<any[]>({
    queryKey: ['/api/energy/history/daily'],
  });

  const { data: monthlyData, isLoading: isMonthlyLoading } = useQuery<any[]>({
    queryKey: ['/api/energy/history/monthly'],
  });

  const { data: yearlyData, isLoading: isYearlyLoading } = useQuery<any[]>({
    queryKey: ['/api/energy/history/yearly'],
  });

  return (
    <div className="p-4 md:p-6">
      <DashboardHeader 
        title="Energy History" 
        description="Track and analyze energy production and consumption over time"
      />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Energy Production History</CardTitle>
          <CardDescription>Historical data of your system's energy production</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="space-y-6">
            <TabsList>
              <TabsTrigger value="daily">Daily View</TabsTrigger>
              <TabsTrigger value="monthly">Monthly View</TabsTrigger>
              <TabsTrigger value="yearly">Yearly View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="space-y-4">
              <div className="h-80">
                {isDailyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : !dailyData ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">No daily data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="production" name="Production" stroke="#3b82f6" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="consumption" name="Consumption" stroke="#10b981" />
                      <Line type="monotone" dataKey="gridExport" name="Grid Export" stroke="#f59e0b" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="monthly" className="space-y-4">
              <div className="h-80">
                {isMonthlyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : !monthlyData ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">No monthly data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="production" name="Production" fill="#3b82f6" />
                      <Bar dataKey="consumption" name="Consumption" fill="#10b981" />
                      <Bar dataKey="gridExport" name="Grid Export" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="yearly" className="space-y-4">
              <div className="h-80">
                {isYearlyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : !yearlyData ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">No yearly data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="production" name="Production" fill="#3b82f6" />
                      <Bar dataKey="consumption" name="Consumption" fill="#10b981" />
                      <Bar dataKey="gridExport" name="Grid Export" fill="#f59e0b" />
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
              {/* Consumption distribution chart would go here */}
              <div className="flex items-center justify-center h-full">
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
              {/* CO2 savings chart would go here */}
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">CO₂ savings analysis coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
