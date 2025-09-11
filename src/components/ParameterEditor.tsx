import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Copy, Upload, FileText, Lock, LockOpen, Code2, ArrowLeft, Image, ChevronDown, ChevronRight } from "lucide-react";
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
  forceStructuredView?: boolean;
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
  updatedFields = new Set(),
  forceStructuredView = false
}: ParameterEditorProps) => {
  const [viewState, setViewState] = useState<ViewState>('empty');
  const [parsedJSON, setParsedJSON] = useState<any>(null);

  // Parse JSON and determine if we have data
  const hasData = useCallback(() => {
    try {
      const parsed = JSON.parse(value);
      setParsedJSON(parsed);
      // Check if the parsed JSON has actual meaningful content
      const hasContent = Object.values(parsed).some(val => {
        if (typeof val === 'string') return val.trim() !== '';
        if (Array.isArray(val)) {
          return val.some(item => {
            if (typeof item === 'string') return item.trim() !== '';
            if (typeof item === 'object' && item !== null) {
              return Object.values(item).some(subVal => 
                typeof subVal === 'string' ? subVal.trim() !== '' : subVal !== null && subVal !== undefined && subVal !== ''
              );
            }
            return item !== null && item !== undefined && item !== '';
          });
        }
        if (typeof val === 'object' && val !== null) {
          return Object.values(val).some(subVal => 
            typeof subVal === 'string' ? subVal.trim() !== '' : subVal !== null && subVal !== undefined && subVal !== ''
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

  // Update view state based on data and forceStructuredView
  useEffect(() => {
    if (forceStructuredView && viewState === 'empty') {
      setViewState('structured');
    } else if (hasData() && viewState === 'empty') {
      setViewState('structured');
    } else if (!hasData() && !forceStructuredView && viewState !== 'empty') {
      setViewState('empty');
    }
  }, [value, viewState, hasData, forceStructuredView]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(value);
  }, [value]);

  const renderTreeLines = (level: number, isLast: boolean, hasChildren: boolean) => {
    const lines = [];
    
    // Vertical lines for parent levels
    for (let i = 0; i < level; i++) {
      lines.push(
        <div
          key={`line-${i}`}
          className="absolute border-l border-border/30"
          style={{
            left: `${i * 20 + 10}px`,
            top: 0,
            bottom: 0,
            width: '1px'
          }}
        />
      );
    }
    
    // Horizontal line to current item
    if (level > 0) {
      lines.push(
        <div
          key="horizontal"
          className="absolute border-t border-border/30"
          style={{
            left: `${(level - 1) * 20 + 10}px`,
            top: '12px',
            width: '12px',
            height: '1px'
          }}
        />
      );
    }
    
    return lines;
  };

  const getTypeDisplay = (val: any) => {
    if (Array.isArray(val)) {
      return { type: 'array', count: val.length, icon: '[]' };
    }
    if (typeof val === 'object' && val !== null) {
      return { type: 'object', count: Object.keys(val).length, icon: '{}' };
    }
    return { type: typeof val, icon: null };
  };

  const renderFieldValue = (key: string, val: any, path: string = '', level: number = 0, isLast: boolean = false) => {
    const fieldPath = path ? `${path}.${key}` : key;
    const isLocked = lockedFields.has(fieldPath);
    const isUpdated = updatedFields.has(fieldPath);
    const typeInfo = getTypeDisplay(val);
    const hasChildren = typeof val === 'object' && val !== null;

    // Handle nested objects as collapsible sections
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      return (
        <Collapsible key={fieldPath} defaultOpen={true}>
          <div className="relative">
            {renderTreeLines(level, isLast, true)}
            <CollapsibleTrigger asChild>
              <div 
                className="flex items-center gap-2 py-1 px-2 hover:bg-muted/30 rounded cursor-pointer group font-mono text-sm"
                style={{ paddingLeft: `${level * 20 + 24}px` }}
              >
                <ChevronDown className="w-3 h-3 text-muted-foreground group-data-[state=closed]:rotate-[-90deg] transition-transform" />
                <span className="text-foreground font-medium">{key}</span>
                <span className="px-1.5 py-0.5 text-xs bg-blue-500/10 text-blue-600 rounded border border-blue-200/20 font-mono">
                  {typeInfo.icon} {typeInfo.count}
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div>
                {Object.entries(val).map(([subKey, subVal], index, arr) => 
                  renderFieldValue(subKey, subVal, fieldPath, level + 1, index === arr.length - 1)
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      );
    }

    // Handle arrays
    if (Array.isArray(val)) {
      return (
        <Collapsible key={fieldPath} defaultOpen={true}>
          <div className="relative">
            {renderTreeLines(level, isLast, true)}
            <CollapsibleTrigger asChild>
              <div 
                className="flex items-center gap-2 py-1 px-2 hover:bg-muted/30 rounded cursor-pointer group font-mono text-sm"
                style={{ paddingLeft: `${level * 20 + 24}px` }}
              >
                <ChevronDown className="w-3 h-3 text-muted-foreground group-data-[state=closed]:rotate-[-90deg] transition-transform" />
                <span className="text-foreground font-medium">{key}</span>
                <span className="px-1.5 py-0.5 text-xs bg-green-500/10 text-green-600 rounded border border-green-200/20 font-mono">
                  {typeInfo.icon} {typeInfo.count}
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div>
                {val.map((item, index) => {
                  const isLastItem = index === val.length - 1;
                  if (typeof item === 'object' && item !== null) {
                    return (
                      <div key={`${fieldPath}[${index}]`} className="relative">
                        {renderTreeLines(level + 1, isLastItem, true)}
                        <div 
                          className="flex items-center gap-2 py-1 px-2 font-mono text-sm text-muted-foreground"
                          style={{ paddingLeft: `${(level + 1) * 20 + 24}px` }}
                        >
                          <span>[{index}]</span>
                          <span className="px-1.5 py-0.5 text-xs bg-purple-500/10 text-purple-600 rounded border border-purple-200/20">
                            {'{}'} {Object.keys(item).length}
                          </span>
                        </div>
                        {Object.entries(item).map(([subKey, subVal], subIndex, subArr) => 
                          renderFieldValue(subKey, subVal, `${fieldPath}[${index}]`, level + 2, subIndex === subArr.length - 1)
                        )}
                      </div>
                    );
                  }
                  return renderFieldValue(`[${index}]`, item, fieldPath, level + 1, isLastItem);
                })}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      );
    }

    // Handle primitive values
    return (
      <div 
        key={fieldPath} 
        className="relative"
      >
        {renderTreeLines(level, isLast, false)}
        <div 
          className={cn(
            "flex items-center gap-2 py-1 px-2 group hover:bg-muted/30 transition-colors rounded font-mono text-sm",
            isUpdated && "bg-yellow-100/50 animate-pulse",
          )}
          style={{ paddingLeft: `${level * 20 + 24}px` }}
        >
          {/* Field Name */}
          <span className="text-foreground font-medium min-w-0 flex-shrink-0">
            {key}:
          </span>
          
          {/* Value Input */}
          <input
            type="text"
            value={String(val)}
            placeholder="String"
            onChange={(e) => {
              if (!isLocked) {
                try {
                  const updated = { ...parsedJSON };
                  const keys = fieldPath.split('.');
                  let current = updated;
                  
                  // Navigate to the correct nested location
                  for (let i = 0; i < keys.length - 1; i++) {
                    const key = keys[i];
                    // Handle array indices
                    if (key.includes('[') && key.includes(']')) {
                      const [arrayKey, indexStr] = key.split('[');
                      const index = parseInt(indexStr.replace(']', ''));
                      current = current[arrayKey][index];
                    } else {
                      current = current[key];
                    }
                  }
                  
                  const finalKey = keys[keys.length - 1];
                  if (finalKey.includes('[') && finalKey.includes(']')) {
                    const [arrayKey, indexStr] = finalKey.split('[');
                    const index = parseInt(indexStr.replace(']', ''));
                    current[arrayKey][index] = e.target.value;
                  } else {
                    current[finalKey] = e.target.value;
                  }
                  
                  onChange(JSON.stringify(updated, null, 2));
                } catch (error) {
                  console.error('Error updating field:', error);
                }
              }
            }}
            disabled={isLocked || isGenerating}
            className={cn(
              "flex-1 px-2 py-1 text-sm bg-background border border-border rounded focus:border-primary focus:outline-none transition-colors font-mono",
              isLocked && "opacity-50 cursor-not-allowed bg-muted",
              !isLocked && "hover:border-border/80",
              typeof val === 'string' && "text-green-600",
              typeof val === 'number' && "text-blue-600",
              typeof val === 'boolean' && "text-purple-600"
            )}
          />
          
          {/* Type Badge */}
          <span className="px-1.5 py-0.5 text-xs bg-muted text-muted-foreground rounded font-mono flex-shrink-0">
            {typeof val}
          </span>
          
          {/* Lock Icon Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-6 h-6 rounded p-0 transition-all hover:bg-muted flex-shrink-0",
                    isLocked 
                      ? "text-amber-600 hover:text-amber-600/80" 
                      : "text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100"
                  )}
                  onClick={() => onFieldLock(fieldPath, !isLocked)}
                >
                  {isLocked ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isLocked ? 'Unlock field' : 'Lock field'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-80 space-y-6 p-8">
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-foreground">Populate Parameters</h3>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          Upload an image or brief to extract parameters, or describe the desired output in the prompt above.
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={onUploadImage}
          className="flex items-center gap-2 px-6 py-3"
          disabled={isGenerating}
        >
          <Image className="w-4 h-4" />
          Upload Image
        </Button>
        
        <Button
          variant="secondary"
          onClick={onUploadDocument}
          className="flex items-center gap-2 px-6 py-3"
          disabled={isGenerating}
        >
          <FileText className="w-4 h-4" />
          Upload Brief
        </Button>
      </div>
    </div>
  );

  const renderStructuredView = () => (
    <div className="relative p-4 max-h-80 overflow-y-auto">
      <div className="space-y-1">
        {parsedJSON && Object.entries(parsedJSON).map(([key, val], index, arr) => 
          renderFieldValue(key, val, '', 0, index === arr.length - 1)
        )}
      </div>
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
                    <p>Upload Brief</p>
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