
import React from 'react';
import { useParams } from 'wouter';
import { SourceDetails } from '@/components/dashboard/source-details';

export const SourceMonitor = () => {
  const { sourceType } = useParams();
  
  if (!sourceType || !['grid', 'generator', 'inverter'].includes(sourceType)) {
    return <div>Invalid source type</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-2xl font-bold capitalize">{sourceType} Monitoring</h1>
        <p className="text-gray-500">Detailed monitoring for {sourceType} parameters</p>
      </div>
      
      <SourceDetails sourceType={sourceType as 'grid' | 'generator' | 'inverter'} />
    </div>
  );
};

export default SourceMonitor;
