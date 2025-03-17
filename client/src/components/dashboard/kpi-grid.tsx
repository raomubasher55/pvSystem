import { useQuery } from "@tanstack/react-query";
import KpiCard from "./kpi-card";
import { Kpi } from "@/lib/types";
import { Zap, PanelTop, Plug, Leaf } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function KpiGrid() {
  const { data, isLoading } = useQuery<Kpi[]>({
    queryKey: ['/api/kpis'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-full">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 mb-6">
        <p className="text-center text-gray-500 dark:text-gray-400">No KPI data available</p>
      </div>
    );
  }

  const iconMap = {
    power: <Zap className="h-5 w-5" />,
    energy: <PanelTop className="h-5 w-5" />,
    grid: <Plug className="h-5 w-5" />,
    co2: <Leaf className="h-5 w-5" />
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {data.map((kpi, index) => (
        <KpiCard
          key={kpi.id}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          icon={iconMap[kpi.type as keyof typeof iconMap]}
          variant={index === 0 ? "default" : index === 1 ? "success" : index === 2 ? "warning" : "danger"}
          pulsate={index === 0}
        />
      ))}
    </div>
  );
}
