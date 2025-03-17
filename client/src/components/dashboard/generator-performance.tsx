import { useQuery } from "@tanstack/react-query";
import { GeneratorGroup } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function GeneratorPerformance() {
  const { data, isLoading } = useQuery<{
    groups: GeneratorGroup[],
    totalOutput: string
  }>({
    queryKey: ['/api/generator/performance'],
  });

  const getProgressColor = (efficiency: number) => {
    if (efficiency >= 95) return "bg-blue-500";
    if (efficiency >= 90) return "bg-green-500";
    if (efficiency >= 80) return "bg-purple-500";
    if (efficiency >= 70) return "bg-teal-500";
    return "bg-red-500";
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return "text-blue-500 dark:text-blue-400";
    if (efficiency >= 90) return "text-green-500 dark:text-green-400";
    if (efficiency >= 80) return "text-amber-500 dark:text-amber-400";
    if (efficiency >= 70) return "text-teal-500 dark:text-teal-400";
    return "text-red-500 dark:text-red-400";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Generator Performance</CardTitle>
        <CardDescription>Output by panel group</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))
          ) : !data || !data.groups || data.groups.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400">No generator data available</p>
            </div>
          ) : (
            data.groups.map((group) => (
              <div key={group.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${getProgressColor(group.efficiency)}`}></span>
                    <p className="font-medium">{group.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{group.output}</span>
                    <span className={`text-xs font-medium ${getEfficiencyColor(group.efficiency)}`}>{group.efficiency}%</span>
                  </div>
                </div>
                <Progress value={group.efficiency} className={getProgressColor(group.efficiency)} />
              </div>
            ))
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Generator Output</p>
            <p className="text-xl font-semibold">{isLoading ? <Skeleton className="h-7 w-24" /> : data?.totalOutput || "N/A"}</p>
          </div>
          <Button variant="outline">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}
