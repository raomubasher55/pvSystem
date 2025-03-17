import { useQuery } from "@tanstack/react-query";
import { SystemComponent } from "@/lib/types";
import { PanelTop, Cpu, Battery, Plug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SystemStatus() {
  const { data, isLoading } = useQuery<SystemComponent[]>({
    queryKey: ['/api/system/status'],
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'solar':
        return <PanelTop className="h-4 w-4" />;
      case 'inverter':
        return <Cpu className="h-4 w-4" />;
      case 'battery':
        return <Battery className="h-4 w-4" />;
      case 'grid':
        return <Plug className="h-4 w-4" />;
      default:
        return <PanelTop className="h-4 w-4" />;
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
      case 'charging':
      case 'connected':
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400";
      case 'needs attention':
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400";
      case 'alert':
      case 'disconnected':
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400";
    }
  };

  const getIconBackground = (type: string) => {
    switch (type) {
      case 'solar':
        return "bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400";
      case 'inverter':
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400";
      case 'battery':
        return "bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400";
      case 'grid':
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current state of components</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            ))
          ) : !data || data.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400">No system components found</p>
            </div>
          ) : (
            data.map((component, index) => (
              <div 
                key={component.id} 
                className={`flex items-center justify-between ${
                  index < data.length - 1 ? "pb-3 border-b border-gray-100 dark:border-slate-700/50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${getIconBackground(component.type)} flex items-center justify-center`}>
                    {getIcon(component.type)}
                  </div>
                  <div>
                    <p className="font-medium">{component.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{component.details}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses(component.status)}`}>
                    {component.status}
                  </span>
                  <span className="text-sm font-medium">{component.output}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
