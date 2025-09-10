import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Upload, FileText, Lock, Unlock, Code2, ArrowLeft, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParameterEditorProps {
  value: string;
  onChange: (value: string) => void;
  isGenerating: boolean;
  lockedFields: Set<string>;
  onFieldLock: (field: string, locked: boolean) => void;
  onUploadImage: () => void;
  onUploadDocument: () => void;
  updatedFields?: Set<string>;
}

type ViewState = 'empty' | 'structured' | 'source';

const ParameterEditor = ({
  value,
  onChange,
  isGenerating,
  lockedFields,
  onFieldLock,
  onUploadImage,
  onUploadDocument,
  updatedFields = new Set()
}: ParameterEditorProps) => {
  const [viewState, setViewState] = useState<ViewState>('empty');
  const [parsedJSON, setParsedJSON] = useState<any>(null);

  // Parse JSON and determine if we have data
  const hasData = useCallback(() => {
    try {
      const parsed = JSON.parse(value);
      setParsedJSON(parsed);
      // Check if the parsed JSON has actual content (not just empty structure)
      const hasContent = Object.values(parsed).some(val => {
        if (typeof val === 'string') return val.trim() !== '';
        if (Array.isArray(val)) return val.length > 0;
        if (typeof val === 'object' && val !== null) {
          return Object.values(val).some(subVal => 
            typeof subVal === 'string' ? subVal.trim() !== '' : subVal !== null && subVal !== undefined
          );
        }
        return val !== null && val !== undefined && val !== '';
      });
      return hasContent;
    } catch {
      setParsedJSON(null);
      return false;
    }
  }, [value]);

  // Update view state based on data
  useEffect(() => {
    if (hasData() && viewState === 'empty') {
      setViewState('structured');
    } else if (!hasData() && viewState !== 'empty') {
      setViewState('empty');
    }
  }, [value, viewState, hasData]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(value);
  }, [value]);

  const renderFieldValue = (key: string, val: any, path: string = '', level: number = 0) => {
    const isLocked = lockedFields.has(key);
    const isUpdated = updatedFields.has(key);
    const indent = level * 16;

    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      return (
        <div key={path + key} style={{ marginLeft: `${indent}px` }}>
          <div className="flex items-center py-1">
            <span className="text-sm font-medium text-foreground">{key}</span>
          </div>
          <div className="ml-4">
            {Object.entries(val).map(([subKey, subVal]) => 
              renderFieldValue(subKey, subVal, `${path}${key}.`, level + 1)
            )}
          </div>
        </div>
      );
    }

    return (
      <div 
        key={path + key} 
        className={cn(
          "flex items-center justify-between py-2 px-3 rounded-md group hover:bg-muted/50 transition-colors",
          isUpdated && "bg-yellow-200/20 animate-pulse",
        )}
        style={{ marginLeft: `${indent}px` }}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <span className="text-sm font-medium text-muted-foreground flex-shrink-0 w-24">
            {key}
          </span>
          <input
            type="text"
            value={String(val)}
            onChange={(e) => {
              if (!isLocked) {
                // Update the JSON value
                try {
                  const updated = { ...parsedJSON };
                  const keys = (path + key).split('.').filter(Boolean);
                  let current = updated;
                  for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]];
                  }
                  current[keys[keys.length - 1]] = e.target.value;
                  onChange(JSON.stringify(updated, null, 2));
                } catch (error) {
                  console.error('Error updating field:', error);
                }
              }
            }}
            disabled={isLocked || isGenerating}
            className={cn(
              "flex-1 px-2 py-1 text-sm bg-transparent border border-transparent rounded focus:border-border focus:outline-none",
              isLocked && "opacity-50 cursor-not-allowed",
              !isLocked && "hover:border-border/50"
            )}
          />
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-8 h-8 rounded-full p-0 text-muted-foreground hover:text-foreground transition-all",
                  isLocked ? "opacity-100 bg-accent text-accent-foreground" : "opacity-0 group-hover:opacity-100"
                )}
                onClick={() => onFieldLock(key, !isLocked)}
              >
                {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLocked ? 'Unlock field' : 'Lock field'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-80 space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Populate Parameters</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Upload an image or file to extract parameters, or describe the desired output in the prompt above.
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={onUploadImage}
          className="flex items-center gap-2"
          disabled={isGenerating}
        >
          <Image className="w-4 h-4" />
          Upload Image
        </Button>
        
        <Button
          variant="secondary"
          onClick={onUploadDocument}
          className="flex items-center gap-2"
          disabled={isGenerating}
        >
          <FileText className="w-4 h-4" />
          Upload File
        </Button>
      </div>
    </div>
  );

  const renderStructuredView = () => (
    <div className="space-y-2 p-4 max-h-80 overflow-y-auto">
      {parsedJSON && Object.entries(parsedJSON).map(([key, val]) => 
        renderFieldValue(key, val)
      )}
    </div>
  );

  const renderSourceView = () => {
    const lines = value.split('\n');
    
    const highlightSyntax = (text: string) => {
      return text
        .replace(/"([^"]+)":/g, '<span class="text-blue-400 font-medium">"$1":</span>')
        .replace(/:\s*"([^"]*)"/g, ': <span class="text-green-400">"$1"</span>')
        .replace(/:\s*(\d+)/g, ': <span class="text-orange-400">$1</span>')
        .replace(/:\s*(true|false)/g, ': <span class="text-purple-400">$1</span>')
        .replace(/:\s*(null)/g, ': <span class="text-gray-400">$1</span>')
        .replace(/([{}[\],])/g, '<span class="text-gray-300">$1</span>');
    };

    return (
      <div className="p-4 max-h-80 overflow-y-auto font-mono text-sm">
        {lines.map((line, index) => (
          <div key={index} className="flex items-center min-h-[24px]">
            <span className="w-8 text-xs text-muted-foreground text-right pr-2 select-none flex-shrink-0">
              {index + 1}
            </span>
            <span 
              className="flex-1"
              dangerouslySetInnerHTML={{ __html: highlightSyntax(line) }}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderHeader = () => {
    if (viewState === 'empty') return null;

    return (
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <span className="text-sm font-medium text-foreground">
          {viewState === 'structured' ? 'Parameters' : 'Source View'}
        </span>
        
        <TooltipProvider>
          <div className="flex items-center gap-1">
            {viewState === 'source' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewState('structured')}
                    className="w-8 h-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back to Structured View</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {viewState === 'structured' && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onUploadImage}
                      className="w-8 h-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                      disabled={isGenerating}
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload Image</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onUploadDocument}
                      className="w-8 h-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                      disabled={isGenerating}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload Document</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewState('source')}
                      className="w-8 h-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                    >
                      <Code2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Source</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="w-8 h-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy JSON</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    );
  };

  return (
    <div className={cn(
      "relative bg-background rounded-lg border border-border overflow-hidden",
      isGenerating && "opacity-50 pointer-events-none"
    )}>
      {renderHeader()}
      
      <div className="relative">
        {viewState === 'empty' && renderEmptyState()}
        {viewState === 'structured' && renderStructuredView()}
        {viewState === 'source' && renderSourceView()}
        
        {isGenerating && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParameterEditor;