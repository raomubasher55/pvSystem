import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Battery, BoltIcon, SunIcon } from "lucide-react";

const COLORS = ["#22c55e", "#eab308", "#ef4444"];

interface DistributionData {
  name: string;
  value: number;
}

interface PowerSourceDistributionProps {
  timeRange?: string;
}

export default function PowerSourceDistribution({ timeRange = 'last-24h' }: PowerSourceDistributionProps) {
  const { data, isLoading, error } = useQuery<DistributionData[]>({
    queryKey: ["/api/energy/distribution", timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/energy/distribution?timeRange=${timeRange}`);
      if (!res.ok) throw new Error('Failed to fetch energy distribution');
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Power Source Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="w-[200px] h-[200px] rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Power Source Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-destructive">
            Failed to load distribution data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Power Source Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}