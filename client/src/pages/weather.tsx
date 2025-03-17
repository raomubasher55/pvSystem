import DashboardHeader from "@/components/layouts/dashboard-header";
import WeatherWidget from "@/components/dashboard/weather-widget";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  BarChart,
  Bar
} from "recharts";

export default function Weather() {
  const { data: forecastData, isLoading: isForecastLoading } = useQuery<any[]>({
    queryKey: ['/api/weather/forecast'],
  });

  const { data: solarData, isLoading: isSolarLoading } = useQuery<any[]>({
    queryKey: ['/api/weather/solar'],
  });

  return (
    <div className="p-4 md:p-6">
      <DashboardHeader 
        title="Weather Conditions" 
        description="Current weather and solar radiation data"
      />
      
      <WeatherWidget />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
          <CardDescription>5-day weather forecast and solar conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {isForecastLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : !forecastData ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No forecast data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="temp" domain={['auto', 'auto']} />
                  <YAxis yAxisId="precip" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="temp" type="monotone" dataKey="highTemp" name="High Temp (°F)" stroke="#f59e0b" />
                  <Line yAxisId="temp" type="monotone" dataKey="lowTemp" name="Low Temp (°F)" stroke="#3b82f6" />
                  <Line yAxisId="precip" type="monotone" dataKey="precipChance" name="Precip. Chance (%)" stroke="#6366f1" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Solar Radiation</CardTitle>
            <CardDescription>Solar radiation and production potential</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isSolarLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : !solarData ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">No solar radiation data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={solarData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="radiation" name="Solar Radiation (W/m²)" fill="#f59e0b" />
                    <Bar dataKey="potential" name="Production Potential (kW)" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weather Impact</CardTitle>
            <CardDescription>Weather impact on system performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {/* Weather impact visualization would go here */}
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">Weather impact analysis coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
