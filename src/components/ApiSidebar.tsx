
import { useState } from 'react';
import { Search } from 'lucide-react';
import { apiEndpoints } from '../services/api-service';
import { ApiEndpoint, HttpMethod } from '../types/api';
import { cn } from '@/lib/utils';

interface ApiSidebarProps {
  onSelectEndpoint: (endpoint: ApiEndpoint) => void;
  selectedEndpoint: ApiEndpoint | null;
}

export const ApiSidebar = ({ onSelectEndpoint, selectedEndpoint }: ApiSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Employee Data': true,
    'Insurance': true,
    'Harassment Reports': true,
    'Leave Management': true,
    'Payroll': true,
    'Policies': true
  });

  // Group endpoints by category
  const groupedEndpoints = apiEndpoints.reduce((acc, endpoint) => {
    if (!acc[endpoint.category]) {
      acc[endpoint.category] = [];
    }
    acc[endpoint.category].push(endpoint);
    return acc;
  }, {} as Record<string, ApiEndpoint[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const filteredEndpointsByCategory = Object.keys(groupedEndpoints)
    .reduce((acc, category) => {
      const filtered = groupedEndpoints[category].filter(endpoint => 
        endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      
      return acc;
    }, {} as Record<string, ApiEndpoint[]>);

  const getMethodBadgeColor = (method: HttpMethod) => {
    switch (method) {
      case 'GET': return 'bg-api-get/20 text-api-get border-api-get/30';
      case 'POST': return 'bg-api-post/20 text-api-post border-api-post/30';
      case 'PUT': return 'bg-api-put/20 text-api-put border-api-put/30';
      case 'DELETE': return 'bg-api-delete/20 text-api-delete border-api-delete/30';
      case 'PATCH': return 'bg-api-patch/20 text-api-patch border-api-patch/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div className="w-80 h-screen border-r border-border flex flex-col bg-sidebar">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold mb-2 flex items-center">
          <span className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white mr-2">H</span>
          HRMS API Builder
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search endpoints..."
            className="w-full pl-9 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {Object.keys(filteredEndpointsByCategory).map(category => (
          <div key={category} className="mb-2">
            <button 
              onClick={() => toggleCategory(category)}
              className="flex items-center justify-between w-full p-2 text-left font-medium hover:bg-muted/50 rounded-md"
            >
              <span>{category}</span>
              <span className="text-xs">{expandedCategories[category] ? '▼' : '►'}</span>
            </button>
            {expandedCategories[category] && (
              <div className="ml-2">
                {filteredEndpointsByCategory[category].map(endpoint => (
                  <button
                    key={endpoint.id}
                    className={cn(
                      "flex flex-col w-full text-left p-2 text-sm rounded-md mb-1 hover:bg-muted/30",
                      selectedEndpoint?.id === endpoint.id ? "bg-muted/50" : ""
                    )}
                    onClick={() => onSelectEndpoint(endpoint)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{endpoint.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded border ${getMethodBadgeColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-1 mt-1">{endpoint.url}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border text-xs text-muted-foreground">
        HRMS API Explorer v1.0
      </div>
    </div>
  );
};
