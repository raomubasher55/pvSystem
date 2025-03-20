import { useQuery } from "@tanstack/react-query";
import { Alert } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AlertsTableProps {
  timeRange?: string;
}

export default function AlertsTable({ timeRange = 'last-24h' }: AlertsTableProps) {
  const { data, isLoading } = useQuery<Alert[]>({
    queryKey: ['/api/alerts', timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/alerts?timeRange=${timeRange}`);
      if (!res.ok) throw new Error('Failed to fetch alerts');
      return res.json();
    }
  });

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case 'info':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case 'warning':
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case 'alert':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>System notifications and warnings</CardDescription>
        </div>
        
        <Button variant="outline" size="sm">View All</Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-slate-700/30">
              <TableRow>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Component</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 dark:divide-slate-700">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : !data || data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No alerts found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses(alert.status)}`}>
                        {alert.status}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{alert.description}</TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">{alert.component}</TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">{alert.time}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
