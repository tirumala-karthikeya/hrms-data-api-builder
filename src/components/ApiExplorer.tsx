
import { useState } from 'react';
import { ApiEndpoint, ApiResponse } from '@/types/api';
import { fetchApi } from '@/services/api-service';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Send, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApiExplorerProps {
  endpoint: ApiEndpoint;
  onToggleView: () => void;
}

export const ApiExplorer = ({ endpoint, onToggleView }: ApiExplorerProps) => {
  const { toast } = useToast();
  const [idValue, setIdValue] = useState<string>('');
  const [requestBody, setRequestBody] = useState<string>(endpoint.hasBody && endpoint.exampleRequestBody ? JSON.stringify(endpoint.exampleRequestBody || {}, null, 2) : '');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(endpoint.hasBody ? 'body' : 'params');
  const [headerValues, setHeaderValues] = useState<Record<string, string>>({
    'Content-Type': 'application/json',
    'api_key': 'xpectrum_api_key_123@ai'
  });
  const [queryParams, setQueryParams] = useState<Record<string, string>>({
    'api_key': 'xpectrum_api_key_123@ai'
  });

  const handleSend = async () => {
    setLoading(true);
    try {
      let url = endpoint.url;
      
      // Replace path parameter if needed
      if (endpoint.requiresId) {
        if (!idValue) {
          toast({
            title: 'Error',
            description: 'Please provide an ID value for this endpoint',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }
        
        // Extract the parameter name from the URL
        const idParamMatch = url.match(/{([^}]+)}/);
        if (idParamMatch && idParamMatch[1]) {
          url = url.replace(`{${idParamMatch[1]}}`, idValue);
        }
      }
      
      const result = await fetchApi({
        url,
        method: endpoint.method,
        headers: headerValues,
        params: queryParams,
        data: endpoint.hasBody ? JSON.parse(requestBody) : undefined
      });
      
      setResponse(result);
    } catch (error) {
      setResponse({
        status: 0,
        statusText: 'Error',
        data: null,
        error: error instanceof Error ? error.message : 'Failed to parse request body or send request',
        headers: {},
        time: 0
      });
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send request',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: 'Copied to clipboard!'
    });
  };

  const formatJSON = (jsonObj: any): string => {
    try {
      return JSON.stringify(jsonObj, null, 2);
    } catch (error) {
      return String(jsonObj);
    }
  };

  const getMethodColor = () => {
    switch (endpoint.method) {
      case 'GET': return 'bg-api-get text-white';
      case 'POST': return 'bg-api-post text-white';
      case 'PUT': return 'bg-api-put text-white';
      case 'DELETE': return 'bg-api-delete text-white';
      case 'PATCH': return 'bg-api-patch text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const renderHighlightedJSON = (json: string) => {
    try {
      let highlighted = json.replace(
        /"([^"]+)":/g, 
        '<span class="json-key">"$1"</span>:'
      );
      
      highlighted = highlighted
        .replace(
          /:(\s*)"([^"]+)"/g, 
          ':<span class="json-string">$1"$2"</span>'
        )
        .replace(
          /:(\s*)(\d+)/g, 
          ':<span class="json-number">$1$2</span>'
        )
        .replace(
          /:(\s*)(true|false)/g, 
          ':<span class="json-boolean">$1$2</span>'
        )
        .replace(
          /:(\s*)(null)/g, 
          ':<span class="json-null">$1$2</span>'
        );
      
      return { __html: highlighted };
    } catch (e) {
      return { __html: json };
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="border-b border-border p-4">
        <h2 className="text-xl font-medium mb-2">{endpoint.name}</h2>
        <p className="text-muted-foreground mb-4">{endpoint.description}</p>
        
        <div className="flex gap-2 items-center">
          <span className={`px-3 py-1 rounded text-sm font-medium ${getMethodColor()}`}>
            {endpoint.method}
          </span>
          <input 
            type="text" 
            value={endpoint.url}
            className="flex-1 bg-muted p-2 rounded-md text-sm font-mono"
            readOnly
          />
          <button
            className="bg-primary text-white p-2 rounded-md flex items-center gap-1"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span>Send</span>
          </button>
        </div>
        
        {endpoint.requiresId && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Path Parameter</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder={`Enter ${endpoint.url.match(/{([^}]+)}/)?.[1] || 'ID'} value...`}
                className="flex-1 bg-muted p-2 rounded-md text-sm"
                value={idValue}
                onChange={(e) => setIdValue(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden flex">
        <div className="w-1/2 border-r border-border flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="border-b border-border">
              <TabsList className="bg-transparent p-0 h-12">
                <TabsTrigger 
                  value="params" 
                  className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12 text-sm"
                >
                  Query Params
                </TabsTrigger>
                <TabsTrigger 
                  value="headers" 
                  className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12 text-sm"
                >
                  Headers
                </TabsTrigger>
                {endpoint.hasBody && (
                  <TabsTrigger 
                    value="body" 
                    className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12 text-sm"
                  >
                    Body
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <TabsContent value="params" className="flex-1 overflow-auto mt-0 pt-2">
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Query Parameters</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(queryParams).map(([key, value]) => (
                      <div key={key} className="flex gap-2 items-center">
                        <input
                          type="text"
                          className="bg-muted p-2 rounded-md text-sm w-1/3"
                          value={key}
                          onChange={(e) => {
                            const newParams = { ...queryParams };
                            delete newParams[key];
                            newParams[e.target.value] = value;
                            setQueryParams(newParams);
                          }}
                        />
                        <input
                          type="text"
                          className="bg-muted p-2 rounded-md text-sm flex-1"
                          value={value}
                          onChange={(e) => {
                            setQueryParams({
                              ...queryParams,
                              [key]: e.target.value
                            });
                          }}
                        />
                        <button
                          className="p-2 rounded-md hover:bg-muted"
                          onClick={() => {
                            const newParams = { ...queryParams };
                            delete newParams[key];
                            setQueryParams(newParams);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-2 text-sm text-primary"
                    onClick={() => {
                      setQueryParams({
                        ...queryParams,
                        '': ''
                      });
                    }}
                  >
                    + Add Parameter
                  </button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="headers" className="flex-1 overflow-auto mt-0 pt-2">
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Headers</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(headerValues).map(([key, value]) => (
                      <div key={key} className="flex gap-2 items-center">
                        <input
                          type="text"
                          className="bg-muted p-2 rounded-md text-sm w-1/3"
                          value={key}
                          onChange={(e) => {
                            const newHeaders = { ...headerValues };
                            delete newHeaders[key];
                            newHeaders[e.target.value] = value;
                            setHeaderValues(newHeaders);
                          }}
                        />
                        <input
                          type="text"
                          className="bg-muted p-2 rounded-md text-sm flex-1"
                          value={value}
                          onChange={(e) => {
                            setHeaderValues({
                              ...headerValues,
                              [key]: e.target.value
                            });
                          }}
                        />
                        <button
                          className="p-2 rounded-md hover:bg-muted"
                          onClick={() => {
                            const newHeaders = { ...headerValues };
                            delete newHeaders[key];
                            setHeaderValues(newHeaders);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-2 text-sm text-primary"
                    onClick={() => {
                      setHeaderValues({
                        ...headerValues,
                        '': ''
                      });
                    }}
                  >
                    + Add Header
                  </button>
                </div>
              </div>
            </TabsContent>

            {endpoint.hasBody && (
              <TabsContent value="body" className="flex-1 overflow-auto mt-0 pt-2">
                <div className="p-4 h-full">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Request Body (JSON)</span>
                    <button
                      className="text-xs text-primary flex items-center gap-1"
                      onClick={() => copyToClipboard(requestBody)}
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </button>
                  </div>
                  <textarea
                    className="w-full h-64 bg-muted p-4 rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary scrollbar-custom"
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        <div className="w-1/2 flex flex-col">
          <div className="border-b border-border p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Response</h3>
              <button
                className="bg-primary text-white px-4 py-1 rounded text-sm"
                onClick={onToggleView}
              >
                Documentation
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-muted/30 p-4 scrollbar-custom">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : response ? (
              response.error ? (
                <div className="text-api-delete font-mono whitespace-pre-wrap text-sm">
                  {response.error}
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  <div dangerouslySetInnerHTML={renderHighlightedJSON(formatJSON(response.data))} />
                </pre>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <ArrowRight className="h-8 w-8 mb-2" />
                <span>Click Send to get a response</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
