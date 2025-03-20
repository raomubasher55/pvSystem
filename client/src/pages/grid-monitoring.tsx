import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

const GridMonitoring = () => {
  // Sample data from your provided snippets
  const voltageData = Array(60).fill(null).map((_, i) => {
    // Creating a sample based on your actual data
    return {
      time: '4 PM',
      phaseA: 237 + Math.random() * 2,
      phaseB: 237 + Math.random() * 2,
      phaseC: 237 + Math.random() * 2
    };
  });
  
  const frequencyData = Array(60).fill(null).map((_, i) => {
    // Creating data points around 50Hz based on your actual data
    return {
      time: '4 PM',
      frequency: 49.95 + Math.random() * 0.1
    };
  });

  const isVoltageLoading = false;
  const isFrequencyLoading = false;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Grid Monitoring</h1>
        <p className="text-gray-500">Monitor and analyze grid connection status and power exchange</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-500">Grid Status</p>
              <h3 className="text-xl font-bold text-green-500">Connected</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-500">Power Import</p>
              <h3 className="text-xl font-bold">2.4 kW</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-500">Power Export</p>
              <h3 className="text-xl font-bold">0.0 kW</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
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
                    <p className="text-gray-500">No voltage data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={voltageData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="time" />
                      <YAxis domain={[235, 240]} />
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
                    <p className="text-gray-500">No frequency data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={frequencyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="time" />
                      <YAxis domain={[49.8, 50.2]} />
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
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Power quality analysis coming soon</p>
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
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Grid events log coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GridMonitoring;