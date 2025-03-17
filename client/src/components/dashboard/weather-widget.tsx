import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { WeatherData } from "@/lib/types";
import { CloudSun, Clock, RefreshCw } from "lucide-react";
import { format } from "date-fns";

export default function WeatherWidget() {
  const { data, isLoading, refetch } = useQuery<WeatherData>({
    queryKey: ['/api/weather'],
  });

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="text-center py-10">
            <h3 className="text-xl font-medium mb-2">Weather data unavailable</h3>
            <p className="text-gray-500 dark:text-gray-400">Unable to load weather information</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <CloudSun className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">{data.location}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold flex items-center">
              {data.temperature}<span className="text-sm ml-1">°F</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{data.condition}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
              <p className="font-medium">{data.humidity}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
              <p className="font-medium">{data.wind} mph</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">UV Index</p>
              <p className="font-medium">{data.uvIndex}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Visibility</p>
              <p className="font-medium">{data.visibility} mi</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Solar Conditions</p>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <CloudSun className="h-4 w-4" />
            </div>
            <p className="font-semibold">{data.solarIntensity}</p>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-gray-50 dark:bg-slate-700/30 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <Clock className="inline-block h-4 w-4 mr-1" />
          <span>Updated {data.lastUpdated}</span>
        </p>
        
        <button 
          onClick={() => refetch()}
          className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
        >
          <RefreshCw className="inline-block h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>
    </div>
  );
}
