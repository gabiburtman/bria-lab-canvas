import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Copy, Upload, FileText, Lock, LockOpen, Code2, ArrowLeft, Image, ChevronDown, ChevronRight, Plus, Minus } from "lucide-react";
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
    if (val === null) {
      return { type: 'null', icon: null };
    }
    return { type: typeof val, icon: null };
  };

  // Helper function to check if a parent path is locked
  const isParentLocked = (path: string) => {
    return lockedFields.has(path);
  };

  // Helper function to check if a field is locked (either directly or through parent)
  const isFieldLocked = (fieldPath: string) => {
    // Check if this specific field is locked
    if (lockedFields.has(fieldPath)) {
      return true;
    }
    
    // Check if any parent path is locked
    const pathParts = fieldPath.split('.');
    for (let i = 1; i <= pathParts.length; i++) {
      const parentPath = pathParts.slice(0, i).join('.');
      if (lockedFields.has(parentPath)) {
        return true;
      }
    }
    
    // Also check for array parent paths
    if (fieldPath.includes('[')) {
      // For array items like "lighting[0].intensity", also check "lighting" 
      const arrayMatch = fieldPath.match(/^([^[]+)(\[.+)/);
      if (arrayMatch) {
        const arrayBasePath = arrayMatch[1];
        if (lockedFields.has(arrayBasePath)) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Helper function to get all child paths of a parent
  const getChildPaths = (obj: any, basePath: string = ''): string[] => {
    const paths: string[] = [];
    
    const traverse = (current: any, currentPath: string) => {
      if (typeof current === 'object' && current !== null) {
        if (Array.isArray(current)) {
          current.forEach((item, index) => {
            const itemPath = currentPath ? `${currentPath}[${index}]` : `[${index}]`;
            paths.push(itemPath);
            traverse(item, itemPath);
          });
        } else {
          Object.entries(current).forEach(([key, value]) => {
            const keyPath = currentPath ? `${currentPath}.${key}` : key;
            paths.push(keyPath);
            traverse(value, keyPath);
          });
        }
      }
    };
    
    traverse(obj, basePath);
    return paths;
  };

  // Helper function to handle parent locking/unlocking
  const handleParentLock = (path: string, obj: any, shouldLock: boolean) => {
    // Lock/unlock the parent itself
    onFieldLock(path, shouldLock);
    
    // Lock/unlock all children
    const childPaths = getChildPaths(obj, path);
    childPaths.forEach(childPath => {
      onFieldLock(childPath, shouldLock);
    });
  };

  // Helper function to add a new property to an object
  const addObjectProperty = (path: string) => {
    try {
      const updated = { ...parsedJSON };
      const keys = path.split('.');
      let current = updated;
      
      // Navigate to the target object
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.includes('[') && key.includes(']')) {
          const [arrayKey, indexStr] = key.split('[');
          const index = parseInt(indexStr.replace(']', ''));
          current = current[arrayKey][index];
        } else if (i < keys.length - 1) {
          current = current[key];
        } else {
          // This is the target object
          current = current[key];
        }
      }
      
      // Add new property with a default name and value
      let newKey = 'newProperty';
      let counter = 1;
      while (current.hasOwnProperty(newKey)) {
        newKey = `newProperty${counter}`;
        counter++;
      }
      
      current[newKey] = '';
      onChange(JSON.stringify(updated, null, 2));
    } catch (error) {
      console.error('Error adding object property:', error);
    }
  };

  // Helper function to delete an object property
  const deleteObjectProperty = (path: string) => {
    try {
      const updated = { ...parsedJSON };
      const keys = path.split('.');
      let current = updated;
      
      // Navigate to the parent object
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key.includes('[') && key.includes(']')) {
          const [arrayKey, indexStr] = key.split('[');
          const index = parseInt(indexStr.replace(']', ''));
          current = current[arrayKey][index];
        } else {
          current = current[key];
        }
      }
      
      // Delete the property
      const finalKey = keys[keys.length - 1];
      delete current[finalKey];
      
      onChange(JSON.stringify(updated, null, 2));
    } catch (error) {
      console.error('Error deleting object property:', error);
    }
  };

  // Helper function to add a new array item
  const addArrayItem = (path: string) => {
    try {
      const updated = { ...parsedJSON };
      const keys = path.split('.');
      let current = updated;
      
      // Navigate to the target array
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.includes('[') && key.includes(']')) {
          const [arrayKey, indexStr] = key.split('[');
          const index = parseInt(indexStr.replace(']', ''));
          current = current[arrayKey][index];
        } else if (i < keys.length - 1) {
          current = current[key];
        } else {
          // This is the target array
          current = current[key];
        }
      }
      
      // Add new item (empty string for primitives, empty object for objects)
      const existingItem = current.length > 0 ? current[0] : '';
      const newItem = typeof existingItem === 'object' && existingItem !== null ? {} : '';
      
      current.push(newItem);
      onChange(JSON.stringify(updated, null, 2));
    } catch (error) {
      console.error('Error adding array item:', error);
    }
  };

  // Helper function to delete an array item
  const deleteArrayItem = (path: string, index: number) => {
    try {
      const updated = { ...parsedJSON };
      const keys = path.split('.');
      let current = updated;
      
      // Navigate to the target array
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.includes('[') && key.includes(']')) {
          const [arrayKey, indexStr] = key.split('[');
          const arrayIndex = parseInt(indexStr.replace(']', ''));
          current = current[arrayKey][arrayIndex];
        } else if (i < keys.length - 1) {
          current = current[key];
        } else {
          // This is the target array
          current = current[key];
        }
      }
      
      // Remove the item at the specified index
      current.splice(index, 1);
      onChange(JSON.stringify(updated, null, 2));
    } catch (error) {
      console.error('Error deleting array item:', error);
    }
  };

  const renderFieldValue = (key: string, val: any, path: string = '', level: number = 0, isLast: boolean = false) => {
    const fieldPath = path ? `${path}.${key}` : key;
    const isLocked = isFieldLocked(fieldPath);
    const isUpdated = updatedFields.has(fieldPath);
    const typeInfo = getTypeDisplay(val);
    const hasChildren = typeof val === 'object' && val !== null;

    // Handle nested objects as collapsible sections
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      const parentLocked = isFieldLocked(fieldPath);
      
      return (
        <Collapsible key={fieldPath} defaultOpen={true}>
          <div className="relative">
            {renderTreeLines(level, isLast, true)}
            <div className="flex items-center gap-2 py-1 px-2 hover:bg-muted/30 rounded group font-mono text-sm">
              <CollapsibleTrigger asChild>
                <div 
                  className="flex items-center gap-2 cursor-pointer flex-1"
                  style={{ paddingLeft: `${level * 20 + 24}px` }}
                >
                  <ChevronDown className="w-3 h-3 text-muted-foreground group-data-[state=closed]:rotate-[-90deg] transition-transform" />
                  <span className="text-foreground font-medium">{key}</span>
                  <span className="px-1.5 py-0.5 text-xs bg-blue-500/10 text-blue-600 rounded border border-blue-200/20 font-mono">
                    {typeInfo.icon} {typeInfo.count}
                  </span>
                </div>
              </CollapsibleTrigger>
              
              {/* Parent Lock Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-6 h-6 rounded p-0 transition-all hover:bg-muted flex-shrink-0",
                        parentLocked 
                          ? "text-amber-600 hover:text-amber-600/80" 
                          : "text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100"
                      )}
                      onClick={() => handleParentLock(fieldPath, val, !parentLocked)}
                    >
                      {parentLocked ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{parentLocked ? 'Unlock object and all properties' : 'Lock object and all properties'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Add Property Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 rounded p-0 text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-all hover:bg-muted flex-shrink-0"
                      onClick={() => addObjectProperty(fieldPath)}
                      disabled={parentLocked || isGenerating}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add new property</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <CollapsibleContent>
              <div>
                {Object.entries(val).map(([subKey, subVal], index, arr) => (
                  <div key={`${fieldPath}.${subKey}`} className="relative">
                    {renderFieldValue(subKey, subVal, fieldPath, level + 1, index === arr.length - 1)}
                    
                    {/* Delete Property Button */}
                    {Object.keys(val).length > 1 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1 w-5 h-5 rounded p-0 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-60 hover:opacity-100 transition-all hover:bg-red-50 flex-shrink-0"
                              onClick={() => deleteObjectProperty(`${fieldPath}.${subKey}`)}
                              disabled={parentLocked || isGenerating}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete property</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      );
    }

    // Handle arrays
    if (Array.isArray(val)) {
      const parentLocked = isFieldLocked(fieldPath);
      
      return (
        <Collapsible key={fieldPath} defaultOpen={true}>
          <div className="relative">
            {renderTreeLines(level, isLast, true)}
            <div className="flex items-center gap-2 py-1 px-2 hover:bg-muted/30 rounded group font-mono text-sm">
              <CollapsibleTrigger asChild>
                <div 
                  className="flex items-center gap-2 cursor-pointer flex-1"
                  style={{ paddingLeft: `${level * 20 + 24}px` }}
                >
                  <ChevronDown className="w-3 h-3 text-muted-foreground group-data-[state=closed]:rotate-[-90deg] transition-transform" />
                  <span className="text-foreground font-medium">{key}</span>
                  <span className="px-1.5 py-0.5 text-xs bg-green-500/10 text-green-600 rounded border border-green-200/20 font-mono">
                    {typeInfo.icon} {typeInfo.count}
                  </span>
                </div>
              </CollapsibleTrigger>
              
              {/* Parent Lock Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-6 h-6 rounded p-0 transition-all hover:bg-muted flex-shrink-0",
                        parentLocked 
                          ? "text-amber-600 hover:text-amber-600/80" 
                          : "text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100"
                      )}
                      onClick={() => handleParentLock(fieldPath, val, !parentLocked)}
                    >
                      {parentLocked ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{parentLocked ? 'Unlock array and all items' : 'Lock array and all items'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Add Item Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 rounded p-0 text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-all hover:bg-muted flex-shrink-0"
                      onClick={() => addArrayItem(fieldPath)}
                      disabled={parentLocked || isGenerating}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add new item</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <CollapsibleContent>
              <div>
                {val.map((item, index) => {
                  const isLastItem = index === val.length - 1;
                  if (typeof item === 'object' && item !== null) {
                    return (
                      <div key={`${fieldPath}[${index}]`} className="relative group/item">
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
                        
                        {/* Delete Array Item Button */}
                        {val.length > 1 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1 w-5 h-5 rounded p-0 text-muted-foreground hover:text-red-500 opacity-0 group-hover/item:opacity-60 hover:opacity-100 transition-all hover:bg-red-50 flex-shrink-0"
                                  onClick={() => deleteArrayItem(fieldPath, index)}
                                  disabled={parentLocked || isGenerating}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete item</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    );
                  }
                  
                  return (
                    <div key={`${fieldPath}[${index}]`} className="relative group/item">
                      {renderFieldValue(`[${index}]`, item, fieldPath, level + 1, isLastItem)}
                      
                      {/* Delete Array Item Button for primitives */}
                      {val.length > 1 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1 w-5 h-5 rounded p-0 text-muted-foreground hover:text-red-500 opacity-0 group-hover/item:opacity-60 hover:opacity-100 transition-all hover:bg-red-50 flex-shrink-0"
                                onClick={() => deleteArrayItem(fieldPath, index)}
                                disabled={parentLocked || isGenerating}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete item</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  );
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
          
          {/* Type Badge - hide for strings, show for other types */}
          {typeof val !== 'string' && (
            <span className={cn(
              "px-1.5 py-0.5 text-xs rounded font-mono flex-shrink-0",
              typeof val === 'number' && "bg-blue-500/10 text-blue-600 border border-blue-200/20",
              typeof val === 'boolean' && "bg-purple-500/10 text-purple-600 border border-purple-200/20",
              val === null && "bg-gray-500/10 text-gray-600 border border-gray-200/20",
              typeof val !== 'number' && typeof val !== 'boolean' && val !== null && "bg-muted text-muted-foreground"
            )}>
              {val === null ? 'null' : typeof val}
            </span>
          )}
          
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