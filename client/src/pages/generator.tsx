import DashboardHeader from "@/components/layouts/dashboard-header";
import GeneratorPerformance from "@/components/dashboard/generator-performance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  const { data: performanceData, isLoading: isPerformanceLoading } = useQuery<any[]>({
    queryKey: ['/api/generator/performance/hourly'],
  });

  const { data: temperatureData, isLoading: isTemperatureLoading } = useQuery<any[]>({
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
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
          <CardDescription>Generator output over the past 24 hours</CardDescription>
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
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="roofEast" name="Roof East" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="roofWest" name="Roof West" stroke="#10b981" />
                  <Line type="monotone" dataKey="garage" name="Garage" stroke="#f59e0b" />
                  <Line type="monotone" dataKey="groundArray" name="Ground Array" stroke="#8b5cf6" />
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
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="roofEast" name="Roof East" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="roofWest" name="Roof West" stroke="#10b981" />
                  <Line type="monotone" dataKey="garage" name="Garage" stroke="#f59e0b" />
                  <Line type="monotone" dataKey="groundArray" name="Ground Array" stroke="#8b5cf6" />
                  <Line type="monotone" dataKey="ambient" name="Ambient Temp" stroke="#a3a3a3" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
