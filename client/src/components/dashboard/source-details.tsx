
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";

interface SourceDetailsProps {
  sourceType: 'grid' | 'generator' | 'inverter';
}

export const SourceDetails: React.FC<SourceDetailsProps> = ({ sourceType }) => {
  const { data, isLoading } = useQuery(['sourceData', sourceType], 
    () => fetch(`/api/power/${sourceType}`).then(res => res.json())
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="capitalize">{sourceType} Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="voltage">
          <TabsList>
            <TabsTrigger value="voltage">Voltage</TabsTrigger>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="power">Power</TabsTrigger>
          </TabsList>
          {/* Add tab contents for each parameter */}
        </Tabs>
      </CardContent>
    </Card>
  );
};
