
import { useState } from 'react';
import { ApiSidebar } from '@/components/ApiSidebar';
import { ApiExplorer } from '@/components/ApiExplorer';
import { ApiEndpoint } from '@/types/api';
import { apiEndpoints } from '@/services/api-service';

const Index = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(apiEndpoints[0]);

  return (
    <div className="flex h-screen overflow-hidden">
      <ApiSidebar 
        onSelectEndpoint={setSelectedEndpoint}
        selectedEndpoint={selectedEndpoint}
      />
      <div className="flex-1 overflow-hidden">
        {selectedEndpoint ? (
          <ApiExplorer endpoint={selectedEndpoint} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">HRMS API Builder</h2>
              <p className="text-muted-foreground">Select an endpoint from the sidebar to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
