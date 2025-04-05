
import { useState } from 'react';
import { ApiEndpoint } from '@/types/api';
import { ArrowRight, Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface ApiDocumentationProps {
  endpoint: ApiEndpoint;
  onToggleView: () => void;
}

export const ApiDocumentation = ({ endpoint, onToggleView }: ApiDocumentationProps) => {
  const { toast } = useToast();
  const [activeTab, useState] = useState<string>("shell");

  // Helper function to get method badge color
  const getMethodBadgeColor = () => {
    switch (endpoint.method) {
      case 'GET': return 'bg-api-get text-white';
      case 'POST': return 'bg-api-post text-white';
      case 'PUT': return 'bg-api-put text-white';
      case 'DELETE': return 'bg-api-delete text-white';
      case 'PATCH': return 'bg-api-patch text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: 'Copied to clipboard!'
    });
  };

  const renderRequestSample = () => {
    // Example curl command for the endpoint
    const curlCommand = `curl --location --request ${endpoint.method} '${endpoint.url}' \\
--header 'X-SOURCE: admin' \\
--header 'X-LANG: en' \\
--header 'X-REQUEST-ID: stacktics' \\
--header 'X-DEVICE-ID: stacktics device' \\
--header 'x-api-key: xpectrum_api_key_123@ai' \\
--header 'Content-Type: application/json'${endpoint.hasBody ? ` \\
--data-raw '${JSON.stringify(endpoint.exampleRequestBody || {}, null, 2)}'` : ''}`;

    return curlCommand;
  };

  // Extract path parameter name from URL (e.g., {employee_id})
  const getPathParamName = () => {
    const match = endpoint.url.match(/{([^}]+)}/);
    return match ? match[1] : 'id';
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header with endpoint info */}
      <div className="border-b border-border p-4">
        <div className="text-xs text-muted-foreground uppercase mb-1">{endpoint.category}</div>
        <h2 className="text-2xl font-medium mb-2">{endpoint.name}</h2>
        <p className="text-muted-foreground mb-4">{endpoint.description}</p>
        
        <div className="flex gap-2 items-center">
          <span className={`px-3 py-1 rounded text-sm font-medium ${getMethodBadgeColor()}`}>
            {endpoint.method}
          </span>
          <input 
            type="text" 
            value={endpoint.url}
            className="flex-1 bg-muted p-2 rounded-md text-sm font-mono"
            readOnly
          />
          <button
            className="bg-primary text-white px-4 py-2 rounded-md"
            onClick={onToggleView}
          >
            Use API
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Request section */}
        <div className="p-6">
          <h3 className="text-xl font-medium mb-4">Request</h3>

          {/* Query Parameters Table */}
          {Object.keys(endpoint.queryParams || {}).length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-2">Query Params</h4>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-medium text-sm">Parameter</th>
                      <th className="text-left p-3 font-medium text-sm">Type</th>
                      <th className="text-left p-3 font-medium text-sm">Required</th>
                      <th className="text-left p-3 font-medium text-sm">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(endpoint.queryParams || {}).map(([key, value]) => (
                      <tr key={key} className="border-t border-border">
                        <td className="p-3 text-sm text-primary">{key}</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3">
                          <span className="bg-amber-600/20 text-amber-600 px-2 py-1 rounded-md text-xs">
                            required
                          </span>
                        </td>
                        <td className="p-3 text-sm">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Header Parameters Table */}
          {Object.keys(endpoint.headers || {}).length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-2">Header Params</h4>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-medium text-sm">Parameter</th>
                      <th className="text-left p-3 font-medium text-sm">Type</th>
                      <th className="text-left p-3 font-medium text-sm">Required</th>
                      <th className="text-left p-3 font-medium text-sm">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(endpoint.headers || {}).map(([key, value]) => (
                      <tr key={key} className="border-t border-border">
                        <td className="p-3 text-sm text-primary">{key}</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3">
                          <span className="bg-amber-600/20 text-amber-600 px-2 py-1 rounded-md text-xs">
                            required
                          </span>
                        </td>
                        <td className="p-3 text-sm">{value}</td>
                      </tr>
                    ))}
                    {/* Add standard headers */}
                    <tr className="border-t border-border">
                      <td className="p-3 text-sm text-primary">X-SOURCE</td>
                      <td className="p-3 text-sm">string</td>
                      <td className="p-3">
                        <span className="bg-amber-600/20 text-amber-600 px-2 py-1 rounded-md text-xs">
                          required
                        </span>
                      </td>
                      <td className="p-3 text-sm">admin</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-3 text-sm text-primary">X-LANG</td>
                      <td className="p-3 text-sm">string</td>
                      <td className="p-3">
                        <span className="bg-amber-600/20 text-amber-600 px-2 py-1 rounded-md text-xs">
                          required
                        </span>
                      </td>
                      <td className="p-3 text-sm">en</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-3 text-sm text-primary">X-REQUEST-ID</td>
                      <td className="p-3 text-sm">string</td>
                      <td className="p-3">
                        <span className="bg-amber-600/20 text-amber-600 px-2 py-1 rounded-md text-xs">
                          required
                        </span>
                      </td>
                      <td className="p-3 text-sm">stacktics</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Path Parameters */}
          {endpoint.requiresId && (
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-2">Path Parameter</h4>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-medium text-sm">Parameter</th>
                      <th className="text-left p-3 font-medium text-sm">Type</th>
                      <th className="text-left p-3 font-medium text-sm">Required</th>
                      <th className="text-left p-3 font-medium text-sm">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 text-sm text-primary">{getPathParamName()}</td>
                      <td className="p-3 text-sm">string</td>
                      <td className="p-3">
                        <span className="bg-amber-600/20 text-amber-600 px-2 py-1 rounded-md text-xs">
                          required
                        </span>
                      </td>
                      <td className="p-3 text-sm">The {getPathParamName()} to retrieve</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request Body */}
          {endpoint.hasBody && endpoint.exampleRequestBody && (
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-2">Request Body</h4>
              <div className="bg-muted/30 rounded-lg border border-border p-4 font-mono text-sm">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(endpoint.exampleRequestBody, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Request Samples */}
          <div className="mb-8">
            <h4 className="text-lg font-medium mb-2">Request samples</h4>
            <Tabs defaultValue="shell" className="w-full">
              <TabsList className="mb-2 bg-muted/30">
                <TabsTrigger value="shell" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <span className="text-xs mr-1">$</span> Shell
                </TabsTrigger>
                <TabsTrigger value="js" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <span className="text-xs mr-1 text-yellow-400">JS</span> JavaScript
                </TabsTrigger>
                <TabsTrigger value="py" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <span className="text-xs mr-1 text-blue-400">Py</span> Python
                </TabsTrigger>
              </TabsList>
              <TabsContent value="shell" className="relative">
                <div className="bg-muted/30 rounded-lg border border-border p-4 font-mono text-sm overflow-x-auto">
                  <div className="absolute top-2 right-2">
                    <button 
                      className="p-2 rounded-md hover:bg-muted"
                      onClick={() => copyToClipboard(renderRequestSample())}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap">
                    {renderRequestSample()}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="js">
                <div className="bg-muted/30 rounded-lg border border-border p-4 font-mono text-sm">
                  <pre className="whitespace-pre-wrap text-sm">
{`// Using fetch API
fetch("${endpoint.url}", {
  method: "${endpoint.method}",
  headers: {
    "Content-Type": "application/json",
    "X-SOURCE": "admin",
    "X-LANG": "en",
    "X-REQUEST-ID": "stacktics",
    "x-api-key": "xpectrum_api_key_123@ai"
  }${endpoint.hasBody ? `,
  body: JSON.stringify(${JSON.stringify(endpoint.exampleRequestBody || {}, null, 2)})` : ''}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="py">
                <div className="bg-muted/30 rounded-lg border border-border p-4 font-mono text-sm">
                  <pre className="whitespace-pre-wrap text-sm">
{`import requests

url = "${endpoint.url}"
headers = {
    "Content-Type": "application/json",
    "X-SOURCE": "admin",
    "X-LANG": "en",
    "X-REQUEST-ID": "stacktics",
    "x-api-key": "xpectrum_api_key_123@ai"
}
${endpoint.hasBody ? `payload = ${JSON.stringify(endpoint.exampleRequestBody || {}, null, 2)}

response = requests.${endpoint.method.toLowerCase()}(url, json=payload, headers=headers)` : `response = requests.${endpoint.method.toLowerCase()}(url, headers=headers)`}
print(response.json())`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Response section */}
        <div className="p-6 border-t border-border">
          <h3 className="text-xl font-medium mb-4">Response</h3>

          <div className="mb-4">
            <h4 className="text-lg font-medium mb-2">Response Body</h4>
            <Tabs defaultValue="json" className="w-full">
              <TabsList className="mb-2 bg-muted/30">
                <TabsTrigger value="json" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  JSON
                </TabsTrigger>
                <TabsTrigger value="text" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Text
                </TabsTrigger>
              </TabsList>
              <TabsContent value="json" className="relative">
                <div className="bg-muted/30 rounded-lg border border-border p-4 font-mono text-sm">
                  <div className="absolute top-2 right-2">
                    <button 
                      className="p-2 rounded-md hover:bg-muted"
                      onClick={() => copyToClipboard(JSON.stringify(endpoint.exampleResponse || {}, null, 2))}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(endpoint.exampleResponse || {}, null, 2)}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="text">
                <div className="bg-muted/30 rounded-lg border border-border p-4 font-mono text-sm">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(endpoint.exampleResponse || {}, null, 2)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
