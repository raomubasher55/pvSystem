import { useQuery } from "@tanstack/react-query";
import { ForecastDay } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sun, CloudSun, Cloud } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EnergyForecastProps {
  timeRange?: string;
}

export default function EnergyForecast({ timeRange = 'last-24h' }: EnergyForecastProps) {
  const { data, isLoading } = useQuery<{
    days: ForecastDay[],
    weeklyTotal: string,
    weeklyChange: number
  }>({
    queryKey: ['/api/energy/forecast', timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/energy/forecast?timeRange=${timeRange}`);
      if (!res.ok) throw new Error('Failed to fetch energy forecast');
      return res.json();
    }
  });

  const getWeatherIcon = (weather: string) => {
    const weather_lower = weather.toLowerCase();
    if (weather_lower.includes('sunny')) return <Sun className="h-5 w-5" />;
    if (weather_lower.includes('partly')) return <CloudSun className="h-5 w-5" />;
    if (weather_lower.includes('cloud')) return <Cloud className="h-5 w-5" />;
    return <Sun className="h-5 w-5" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-500 dark:text-green-400";
    if (change < 0) return "text-red-500 dark:text-red-400";
    return "text-amber-500 dark:text-amber-400";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Energy Forecast</CardTitle>
        <CardDescription>Predicted production</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-5 w-20 mb-1" />
                  <Skeleton className="h-3 w-12 ml-auto" />
                </div>
              </div>
            ))
          ) : !data || !data.days || data.days.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400">No forecast data available</p>
            </div>
          ) : (
            data.days.map((day) => (
              <div key={day.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400">
                    {getWeatherIcon(day.weather)}
                  </div>
                  <div>
                    <p className="font-medium">{day.date}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{day.weather}</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-right">{day.forecast}</p>
                  <p className={`text-xs ${getChangeColor(day.comparison)} text-right`}>
                    {day.comparison > 0 ? "+" : ""}{day.comparison}% vs. avg
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Weekly Projected Generation</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold">
              {isLoading ? <Skeleton className="h-7 w-24" /> : data?.weeklyTotal || "N/A"}
            </p>
            {!isLoading && data && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                data.weeklyChange > 0 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {data.weeklyChange > 0 ? "+" : ""}{data.weeklyChange}% vs. last week
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
