import DashboardHeader from "@/components/layouts/dashboard-header";
import GridStatus from "@/components/dashboard/grid-status";
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
  Legend 
} from "recharts";
import { useQuery } from "@tanstack/react-query";

export default function GridMonitoring() {
  const { data: voltageData, isLoading: isVoltageLoading } = useQuery<any[]>({
    queryKey: ['/api/grid/voltage'],
  });

  const { data: frequencyData, isLoading: isFrequencyLoading } = useQuery<any[]>({
    queryKey: ['/api/grid/frequency'],
  });

  return (
    <div className="p-4 md:p-6">
      <DashboardHeader 
        title="Grid Monitoring" 
        description="Monitor and analyze grid connection status and power exchange"
      />
      
      <GridStatus />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Grid Parameters</CardTitle>
          <CardDescription>Detailed grid electrical parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="voltage" className="space-y-6">
            <TabsList>
              <TabsTrigger value="voltage">Voltage</TabsTrigger>
              <TabsTrigger value="frequency">Frequency</TabsTrigger>
            </TabsList>
            
            <TabsContent value="voltage" className="space-y-4">
              <div className="h-80">
                {isVoltageLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : !voltageData ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">No voltage data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={voltageData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="time" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="phaseA" name="Phase A" stroke="#3b82f6" />
                      <Line type="monotone" dataKey="phaseB" name="Phase B" stroke="#10b981" />
                      <Line type="monotone" dataKey="phaseC" name="Phase C" stroke="#f59e0b" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="frequency" className="space-y-4">
              <div className="h-80">
                {isFrequencyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : !frequencyData ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">No frequency data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={frequencyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="time" />
                      <YAxis domain={[59.8, 60.2]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="frequency" name="Hz" stroke="#3b82f6" />
                    </LineChart>
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
            <CardTitle>Power Quality</CardTitle>
            <CardDescription>Grid power quality metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {/* Power quality chart would go here */}
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">Power quality analysis coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Grid Events</CardTitle>
            <CardDescription>Recent grid events and anomalies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {/* Grid events list would go here */}
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">Grid events log coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
