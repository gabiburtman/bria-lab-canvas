import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Copy, Upload, FileText, Lock, LockOpen, Code, ArrowLeft, Image, ChevronDown, ChevronRight, Plus, Minus, Expand, Network, HelpCircle, Sparkles, Zap, Shield, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
interface StructuredPromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  isGenerating: boolean;
  lockedFields: Set<string>;
  onFieldLock: (field: string, locked: boolean) => void;
  onBatchFieldLock?: (fields: string[], locked: boolean) => void;
  onUploadImage: () => void;
  onUploadDocument: () => void;
  updatedFields?: Set<string>;
  forceStructuredView?: boolean;
  readOnly?: boolean;
}
type ViewState = 'empty' | 'structured' | 'source';
const StructuredPromptEditor = ({
  value,
  onChange,
  isGenerating,
  lockedFields,
  onFieldLock,
  onBatchFieldLock,
  onUploadImage,
  onUploadDocument,
  updatedFields = new Set(),
  forceStructuredView = false,
  readOnly = false
}: StructuredPromptEditorProps) => {
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
              return Object.values(item).some(subVal => typeof subVal === 'string' ? subVal.trim() !== '' : subVal !== null && subVal !== undefined && subVal !== '');
            }
            return item !== null && item !== undefined && item !== '';
          });
        }
        if (typeof val === 'object' && val !== null) {
          return Object.values(val).some(subVal => typeof subVal === 'string' ? subVal.trim() !== '' : subVal !== null && subVal !== undefined && subVal !== '');
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
      lines.push(<div key={`line-${i}`} className="absolute border-l border-border/30" style={{
        left: `${i * 12 + 6}px`,
        top: 0,
        bottom: 0,
        width: '1px'
      }} />);
    }

    // Horizontal line to current item
    if (level > 0) {
      lines.push(<div key="horizontal" className="absolute border-t border-border/30" style={{
        left: `${(level - 1) * 12 + 6}px`,
        top: '12px',
        width: '10px',
        height: '1px'
      }} />);
    }
    return lines;
  };
  const getTypeDisplay = (val: any) => {
    if (Array.isArray(val)) {
      return {
        type: 'array',
        count: val.length,
        icon: '[]'
      };
    }
    if (typeof val === 'object' && val !== null) {
      return {
        type: 'object',
        count: Object.keys(val).length,
        icon: '{}'
      };
    }
    if (val === null) {
      return {
        type: 'null',
        icon: null
      };
    }
    return {
      type: typeof val,
      icon: null
    };
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

  // Helper function to check if THIS specific path is locked (for parent objects/arrays)
  const isParentPathLocked = (path: string) => {
    return lockedFields.has(path);
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
    console.log('handleParentLock called:', {
      path,
      shouldLock,
      obj
    });
    if (onBatchFieldLock) {
      // Use batch locking for better state consistency
      const childPaths = getChildPaths(obj, path);
      const allPaths = [path, ...childPaths];
      console.log('Batch locking paths:', allPaths);
      onBatchFieldLock(allPaths, shouldLock);
    } else {
      // Fallback to individual locking (old behavior)
      onFieldLock(path, shouldLock);
      console.log('Called onFieldLock for parent:', path, shouldLock);
      const childPaths = getChildPaths(obj, path);
      console.log('Child paths to lock/unlock:', childPaths);
      childPaths.forEach(childPath => {
        onFieldLock(childPath, shouldLock);
        console.log('Called onFieldLock for child:', childPath, shouldLock);
      });
    }
  };

  // Helper function to add a new property to an object (disabled - not supported)
  const addObjectProperty = (path: string) => {
    // Adding properties to objects is not supported
    return;
  };

  // Helper function to delete an object property
  const deleteObjectProperty = (path: string) => {
    try {
      const updated = {
        ...parsedJSON
      };
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
    // Only allow adding to specific arrays
    const allowedArrays = ['objects', 'text_render'];
    const arrayName = path.split('.').pop() || path;
    if (!allowedArrays.includes(arrayName)) {
      return;
    }
    try {
      const updated = {
        ...parsedJSON
      };
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

      // Create new item based on existing structure
      let newItem;
      if (current.length > 0) {
        // Clone the structure of the first item
        const template = current[0];
        if (typeof template === 'object' && template !== null) {
          newItem = {};
          // Copy all keys from template with empty string values
          Object.keys(template).forEach(key => {
            if (typeof template[key] === 'string') {
              newItem[key] = '';
            } else if (typeof template[key] === 'number') {
              newItem[key] = 0;
            } else if (typeof template[key] === 'boolean') {
              newItem[key] = false;
            } else {
              newItem[key] = '';
            }
          });
        } else {
          newItem = '';
        }
      } else {
        // Default structure for empty arrays
        if (arrayName === 'objects') {
          newItem = {
            description: '',
            location: '',
            relationship: '',
            relative_size: '',
            shape_and_color: '',
            texture: '',
            appearance_details: '',
            pose: '',
            expression: '',
            clothing: '',
            action: '',
            gender: '',
            skin_tone_and_texture: '',
            orientation: '',
            number_of_objects: ''
          };
        } else if (arrayName === 'text_render') {
          newItem = {
            text_content: '',
            font_style: '',
            color: '',
            placement: '',
            size_and_formatting: ''
          };
        } else {
          newItem = '';
        }
      }
      current.push(newItem);
      onChange(JSON.stringify(updated, null, 2));
    } catch (error) {
      console.error('Error adding array item:', error);
    }
  };

  // Helper function to delete an entire array/group
  const deleteEntireGroup = (path: string) => {
    // Only allow deleting specific groups
    const allowedGroups = ['objects', 'text_render'];
    const groupName = path.split('.').pop() || path;
    if (!allowedGroups.includes(groupName)) {
      return;
    }
    try {
      const updated = {
        ...parsedJSON
      };
      const keys = path.split('.');
      let current = updated;

      // Navigate to the parent of the target group
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

      // Delete the entire group by setting it to an empty array
      const finalKey = keys[keys.length - 1];
      current[finalKey] = [];
      onChange(JSON.stringify(updated, null, 2));
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  // Helper function to delete an array item
  const deleteArrayItem = (path: string, index: number) => {
    // Only allow deleting from specific arrays
    const allowedArrays = ['objects', 'text_render'];
    const arrayName = path.split('.').pop() || path;
    if (!allowedArrays.includes(arrayName)) {
      return;
    }
    try {
      const updated = {
        ...parsedJSON
      };
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

  // Helper function to check if any child paths of a parent are updated
  const hasUpdatedChildren = (parentPath: string, obj: any): boolean => {
    if (!obj || typeof obj !== 'object') return false;
    const childPaths = getChildPaths(obj, parentPath);
    return childPaths.some(childPath => updatedFields.has(childPath));
  };

  // Helper function to check if any fields in the General group are updated
  const hasUpdatedGeneralFields = (generalData: Record<string, any>): boolean => {
    return Object.keys(generalData).some(key => updatedFields.has(key));
  };
  const renderFieldValue = (key: string, val: any, path: string = '', level: number = 0, isLast: boolean = false) => {
    const fieldPath = path ? `${path}.${key}` : key;
    const isLocked = isFieldLocked(fieldPath);
    const isUpdated = updatedFields.has(fieldPath);
    const hasUpdatedChild = hasUpdatedChildren(fieldPath, val);
    const isHighlighted = isUpdated || hasUpdatedChild;
    const typeInfo = getTypeDisplay(val);
    const hasChildren = typeof val === 'object' && val !== null;

    // Handle nested objects as collapsible sections
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      const parentLocked = isParentPathLocked(fieldPath);
      return <Collapsible key={fieldPath} defaultOpen={false}>
          <div className="relative">
            {renderTreeLines(level, isLast, true)}
            <div className={cn("flex items-center gap-2 py-1 px-2 hover:bg-muted/30 rounded group font-mono text-sm", isHighlighted && "bg-yellow-500/10 border border-yellow-500/30 rounded-md")} style={{
            paddingLeft: `${level * 12 + 4}px`
          }}>
              {/* Parent Lock Button */}
              {!readOnly && <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className={cn("w-6 h-6 rounded p-0 transition-all hover:bg-muted flex-shrink-0", parentLocked ? "text-amber-600 hover:text-amber-600/80" : "text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100")} onClick={() => {
                    console.log('Lock button clicked for object:', fieldPath, 'current lock state:', parentLocked);
                    handleParentLock(fieldPath, val, !parentLocked);
                  }}>
                        {parentLocked ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{parentLocked ? 'Unlock object and all properties' : 'Lock object and all properties'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>}
              {readOnly && <div className="w-6 h-6 flex-shrink-0" />}

              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer flex-1">
                  <ChevronDown className="w-3 h-3 text-muted-foreground group-data-[state=closed]:rotate-[-90deg] transition-transform" />
                  <span className="text-foreground font-medium">{key}</span>
                  <span className="px-1.5 py-0.5 text-xs bg-blue-500/10 text-blue-600 rounded border border-blue-200/20 font-mono">
                    {typeInfo.icon} {typeInfo.count}
                  </span>
                </div>
              </CollapsibleTrigger>
              
              {/* Add Property Button - Disabled for objects */}
              {false && <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-6 h-6 rounded p-0 text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-all hover:bg-muted flex-shrink-0" onClick={() => addObjectProperty(fieldPath)} disabled={parentLocked || isGenerating}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add new property</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>}
            </div>
            
            <CollapsibleContent>
              <div>
                {Object.entries(val).map(([subKey, subVal], index, arr) => <div key={`${fieldPath}.${subKey}`} className="relative">
                    {renderFieldValue(subKey, subVal, fieldPath, level + 1, index === arr.length - 1)}
                    
                    {/* Delete Property Button - Disabled */}
                    {false && Object.keys(val).length > 1 && <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="absolute right-2 top-1 w-5 h-5 rounded p-0 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-60 hover:opacity-100 transition-all hover:bg-red-50 flex-shrink-0" onClick={() => deleteObjectProperty(`${fieldPath}.${subKey}`)} disabled={parentLocked || isGenerating}>
                              <Minus className="w-3 h-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete property</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>}
                  </div>)}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>;
    }

    // Handle arrays
    if (Array.isArray(val)) {
      const parentLocked = isParentPathLocked(fieldPath);
      return <Collapsible key={fieldPath} defaultOpen={false}>
          <div className="relative">
            {renderTreeLines(level, isLast, true)}
            <div className={cn("flex items-center gap-2 py-1 px-2 hover:bg-muted/30 rounded group font-mono text-sm", isHighlighted && "bg-yellow-500/10 border border-yellow-500/30 rounded-md")} style={{
            paddingLeft: `${level * 12 + 4}px`
          }}>
              {/* Parent Lock Button */}
              {!readOnly && <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className={cn("w-6 h-6 rounded p-0 transition-all hover:bg-muted flex-shrink-0", parentLocked ? "text-amber-600 hover:text-amber-600/80" : "text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100")} onClick={() => {
                    handleParentLock(fieldPath, val, !parentLocked);
                  }}>
                        {parentLocked ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{parentLocked ? 'Unlock array and all items' : 'Lock array and all items'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>}
              {readOnly && <div className="w-6 h-6 flex-shrink-0" />}

              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer flex-1">
                  <ChevronDown className="w-3 h-3 text-muted-foreground group-data-[state=closed]:rotate-[-90deg] transition-transform" />
                  <span className="text-foreground font-medium">{key}</span>
                  <span className="px-1.5 py-0.5 text-xs bg-green-500/10 text-green-600 rounded border border-green-200/20 font-mono">
                    {typeInfo.icon} {typeInfo.count}
                  </span>
                </div>
              </CollapsibleTrigger>
              
              {/* Add Item Button - Only for objects and text_render */}
              {!readOnly && (key === 'objects' || key === 'text_render') && <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-6 h-6 rounded p-0 text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-all hover:bg-muted flex-shrink-0" onClick={() => addArrayItem(fieldPath)} disabled={parentLocked || isGenerating}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add new {key === 'objects' ? 'object' : 'text element'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>}
            </div>
            
            <CollapsibleContent>
              <div>
                {val.map((item, index) => {
                const isLastItem = index === val.length - 1;
                if (typeof item === 'object' && item !== null) {
                  return <Collapsible key={`${fieldPath}[${index}]`} defaultOpen={false}>
      <div className={cn("relative group/item", isUpdated && "bg-yellow-500/10 border border-yellow-500/30 rounded-md")}>
                           {renderTreeLines(level + 1, isLastItem, true)}
                           <div className="flex items-center gap-2 py-1 px-2 hover:bg-muted/30 rounded group font-mono text-sm" style={{
                        paddingLeft: `${(level + 1) * 12 + 4}px`
                      }}>
                             {/* Individual Item Lock Button */}
                             {!readOnly && <TooltipProvider>
                                 <Tooltip>
                                   <TooltipTrigger asChild>
                                     <Button variant="ghost" size="sm" className={cn("w-6 h-6 rounded p-0 transition-all hover:bg-muted flex-shrink-0", isFieldLocked(`${fieldPath}[${index}]`) ? "text-amber-600 hover:text-amber-600/80" : "text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100")} onClick={() => {
                                const itemPath = `${fieldPath}[${index}]`;
                                const itemLocked = isFieldLocked(itemPath);
                                handleParentLock(itemPath, item, !itemLocked);
                              }}>
                                       {isFieldLocked(`${fieldPath}[${index}]`) ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
                                     </Button>
                                   </TooltipTrigger>
                                   <TooltipContent>
                                     <p>{isFieldLocked(`${fieldPath}[${index}]`) ? `Unlock ${key === 'objects' ? 'object' : 'text element'} and all properties` : `Lock ${key === 'objects' ? 'object' : 'text element'} and all properties`}</p>
                                   </TooltipContent>
                                 </Tooltip>
                               </TooltipProvider>}
                             {readOnly && <div className="w-6 h-6 flex-shrink-0" />}

                            <CollapsibleTrigger asChild>
                              <div className="flex items-center gap-2 cursor-pointer flex-1">
                                <ChevronDown className="w-3 h-3 text-muted-foreground group-data-[state=closed]:rotate-[-90deg] transition-transform" />
                                <span className="text-foreground font-medium">
                                  {key === 'objects' ? `Object [${index}]` : `Text Element [${index}]`}
                                </span>
                                <span className="px-1.5 py-0.5 text-xs bg-purple-500/10 text-purple-600 rounded border border-purple-200/20">
                                  {'{}'} {Object.keys(item).length}
                                </span>
                              </div>
                            </CollapsibleTrigger>
                             
                             {/* Delete Array Item Button - Only for objects and text_render */}
                             {!readOnly && (key === 'objects' || key === 'text_render') && <TooltipProvider>
                                 <Tooltip>
                                   <TooltipTrigger asChild>
                                     <Button variant="ghost" size="sm" className="w-5 h-5 rounded p-0 text-muted-foreground hover:text-red-500 opacity-60 group-hover:opacity-100 transition-all hover:bg-red-50 flex-shrink-0" onClick={() => deleteArrayItem(fieldPath, index)} disabled={parentLocked || isGenerating}>
                                       <Minus className="w-3 h-3" />
                                     </Button>
                                   </TooltipTrigger>
                                   <TooltipContent>
                                     <p>Delete {key === 'objects' ? 'object' : 'text element'}</p>
                                   </TooltipContent>
                                 </Tooltip>
                               </TooltipProvider>}
                          </div>
                          
                          <CollapsibleContent>
                            <div>
                              {Object.entries(item).map(([subKey, subVal], subIndex, subArr) => renderFieldValue(subKey, subVal, `${fieldPath}[${index}]`, level + 2, subIndex === subArr.length - 1))}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>;
                }
                return <div key={`${fieldPath}[${index}]`} className="relative group/item">
                      {renderFieldValue(`[${index}]`, item, fieldPath, level + 1, isLastItem)}
                       
                       {/* Delete Array Item Button for primitives - Only for objects and text_render */}
                       {!readOnly && (key === 'objects' || key === 'text_render') && <TooltipProvider>
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <Button variant="ghost" size="sm" className="absolute right-2 top-1 w-5 h-5 rounded p-0 text-muted-foreground hover:text-red-500 opacity-0 group-hover/item:opacity-60 hover:opacity-100 transition-all hover:bg-red-50 flex-shrink-0" onClick={() => deleteArrayItem(fieldPath, index)} disabled={parentLocked || isGenerating}>
                                 <Minus className="w-3 h-3" />
                               </Button>
                             </TooltipTrigger>
                             <TooltipContent>
                               <p>Delete {key === 'objects' ? 'object' : 'text element'}</p>
                             </TooltipContent>
                           </Tooltip>
                         </TooltipProvider>}
                    </div>;
              })}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>;
    }

    // Handle primitive values
    return <div key={fieldPath} className="relative">
        {renderTreeLines(level, isLast, false)}
        <div className={cn("flex items-center gap-2 py-1 px-2 group hover:bg-muted/30 transition-colors rounded font-mono text-sm", isUpdated && "bg-yellow-100/50")} style={{
        paddingLeft: `${level * 12 + 4}px`
      }}>
          {/* Lock Icon Button */}
          {!readOnly && <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className={cn("w-6 h-6 rounded p-0 transition-all hover:bg-muted flex-shrink-0", isLocked ? "text-amber-600 hover:text-amber-600/80" : "text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100")} onClick={() => onFieldLock(fieldPath, !isLocked)}>
                    {isLocked ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isLocked ? 'Unlock field' : 'Lock field'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>}
          {readOnly && <div className="w-6 h-6 flex-shrink-0" />}

          {/* Field Name */}
          <span className="text-foreground font-medium min-w-0 flex-shrink-0">
            {key}:
          </span>
          
          {/* Value Display (read-only) or Input (editable) */}
          <TooltipProvider>
            {readOnly ? <Tooltip>
                <TooltipTrigger asChild>
                  <span className={cn("flex-1 px-2 py-1 text-sm font-mono truncate cursor-help", typeof val === 'string' && "text-green-600", typeof val === 'number' && "text-blue-600", typeof val === 'boolean' && "text-purple-600")}>
                    {String(val)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs break-words">{String(val)}</p>
                </TooltipContent>
              </Tooltip> : <input type="text" value={String(val)} placeholder="String" onChange={e => {
            if (!isLocked) {
              try {
                const updated = {
                  ...parsedJSON
                };
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
          }} disabled={isLocked || isGenerating} className={cn("flex-1 px-2 py-1 text-sm bg-background border border-border rounded focus:border-primary focus:outline-none transition-colors font-mono", isLocked && "opacity-50 cursor-not-allowed bg-muted", !isLocked && "hover:border-border/80", typeof val === 'string' && "text-green-600", typeof val === 'number' && "text-blue-600", typeof val === 'boolean' && "text-purple-600")} />}
          </TooltipProvider>
          
          {/* Type Badge - hide for strings, show for other types */}
          {typeof val !== 'string' && <span className={cn("px-1.5 py-0.5 text-xs rounded font-mono flex-shrink-0", typeof val === 'number' && "bg-blue-500/10 text-blue-600 border border-blue-200/20", typeof val === 'boolean' && "bg-purple-500/10 text-purple-600 border border-purple-200/20", val === null && "bg-gray-500/10 text-gray-600 border border-gray-200/20", typeof val !== 'number' && typeof val !== 'boolean' && val !== null && "bg-muted text-muted-foreground")}>
              {val === null ? 'null' : typeof val}
            </span>}
        </div>
      </div>;
  };
  const renderEmptyState = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            Structured Prompt
          </span>
          <Button variant="ghost" size="sm" className="w-6 h-6 rounded-full p-0 text-muted-foreground opacity-50 cursor-not-allowed" disabled>
            <HelpCircle className="w-3 h-3" />
          </Button>
        </div>
        
        <TooltipProvider>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full p-0 text-muted-foreground opacity-50 cursor-not-allowed" disabled>
              <Network className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full p-0 text-muted-foreground opacity-50 cursor-not-allowed" disabled>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </TooltipProvider>
      </div>
      
      <div className="flex-1 grid place-items-center p-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground/70 max-w-md leading-relaxed">This is the detailed blueprint GAIA follows for generation. It will be populated from your instructions or uploaded assets, giving you predictable, repeatable control without any guesswork.</p>
        </div>
      </div>
    </div>
  );
  const renderStructuredView = () => {
    const generalFields = ['short_description', 'background_setting', 'style_medium', 'context', 'artistic_style'];
    const renderGeneralGroup = () => {
      const generalData: Record<string, any> = {};
      const otherData: Record<string, any> = {};

      // Split fields into general and other categories
      if (parsedJSON) {
        Object.entries(parsedJSON).forEach(([key, val]) => {
          if (generalFields.includes(key)) {
            generalData[key] = val;
          } else {
            otherData[key] = val;
          }
        });
      }
      const allEntries: Array<[string, any]> = [];

      // Add General group if it has content
      if (Object.keys(generalData).length > 0) {
        allEntries.push(['General', generalData]);
      }

      // Add other fields
      Object.entries(otherData).forEach(([key, val]) => {
        allEntries.push([key, val]);
      });
      return <div className="space-y-1">
          {allEntries.map(([key, val], index, arr) => {
          if (key === 'General') {
            // Render General as a virtual object with same hierarchy as others
            const isLast = index === arr.length - 1;
            const generalFieldKeys = Object.keys(val);
            const generalLocked = generalFieldKeys.some(fieldKey => isFieldLocked(fieldKey));
            const allGeneralLocked = generalFieldKeys.length > 0 && generalFieldKeys.every(fieldKey => isFieldLocked(fieldKey));
            const isGeneralHighlighted = hasUpdatedGeneralFields(val);
            return <Collapsible key="general" defaultOpen={false}>
                  <div className="relative">
                    {renderTreeLines(0, isLast, true)}
                    <div className={cn("flex items-center gap-2 py-1 px-2 hover:bg-muted/30 rounded group font-mono text-sm", isGeneralHighlighted && "bg-yellow-500/10 border border-yellow-500/30 rounded-md")} style={{
                  paddingLeft: '4px'
                }}>
                      {/* General Lock Button */}
                      {!readOnly && <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className={cn("w-6 h-6 rounded p-0 transition-all hover:bg-muted flex-shrink-0", allGeneralLocked ? "text-amber-600 hover:text-amber-600/80" : "text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100")} onClick={() => {
                          const generalFieldsArray = Object.keys(val);
                          if (onBatchFieldLock) {
                            onBatchFieldLock(generalFieldsArray, !allGeneralLocked);
                          } else {
                            generalFieldsArray.forEach(fieldKey => {
                              onFieldLock(fieldKey, !allGeneralLocked);
                            });
                          }
                        }}>
                                {allGeneralLocked ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{allGeneralLocked ? 'Unlock all general fields' : 'Lock all general fields'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>}
                      {readOnly && <div className="w-6 h-6 flex-shrink-0" />}
                      
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer flex-1">
                          <ChevronDown className="w-3 h-3 text-muted-foreground group-data-[state=closed]:rotate-[-90deg] transition-transform" />
                          <span className="text-foreground font-medium">general</span>
                          <span className="px-1.5 py-0.5 text-xs bg-blue-500/10 text-blue-600 rounded border border-blue-200/20 font-mono">
                            {} {Object.keys(val).length}
                          </span>
                        </div>
                      </CollapsibleTrigger>
                    </div>
                    
                    <CollapsibleContent>
                      <div>
                        {Object.entries(val).map(([fieldKey, fieldVal], fieldIndex, fieldArr) => renderFieldValue(fieldKey, fieldVal, '', 1, fieldIndex === fieldArr.length - 1))}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>;
          } else {
            // Render other fields normally
            return renderFieldValue(key, val, '', 0, index === arr.length - 1);
          }
        })}
        </div>;
    };
    return <div className="relative h-full overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto overscroll-contain p-4">
          {renderGeneralGroup()}
        </div>
      </div>;
  };
  const renderSourceView = () => {
    const lines = value.split('\n');
    const highlightSyntax = (text: string) => {
      return text.replace(/"([^"]+)":/g, '<span class="text-blue-400 font-medium">"$1":</span>').replace(/:\s*"([^"]*)"/g, ': <span class="text-green-400">"$1"</span>').replace(/:\s*(\d+)/g, ': <span class="text-orange-400">$1</span>').replace(/:\s*(true|false)/g, ': <span class="text-purple-400">$1</span>').replace(/:\s*(null)/g, ': <span class="text-gray-400">$1</span>').replace(/([{}[\],])/g, '<span class="text-gray-300">$1</span>');
    };
    return <div className="h-full overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 font-mono text-sm">
          {lines.map((line, index) => <div key={index} className="flex items-center min-h-[24px]">
              <span className="w-8 text-xs text-muted-foreground text-right pr-2 select-none flex-shrink-0">
                {index + 1}
              </span>
              <span className="flex-1" dangerouslySetInnerHTML={{
            __html: highlightSyntax(line)
          }} />
            </div>)}
        </div>
      </div>;
  };
  const renderHeader = () => {
    if (viewState === 'empty') return null;
    return <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            Structured Prompt
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="w-6 h-6 rounded-full p-0 text-muted-foreground hover:text-foreground">
                <HelpCircle className="w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-lab-surface border-lab-border">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-lab-text-primary">
                  Bria 4.0: Control-First Image Generation
                </DialogTitle>
                <DialogDescription className="text-lab-text-secondary">
                  Reframing text-to-image from "pretty images" to professional control and automation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-lab-text-primary">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-lab-surface-elevated rounded-lg p-3">
                    <div className="font-semibold text-lab-primary mb-2">Native for Automation</div>
                    <div className="text-lab-text-secondary text-xs">LLM interpretation layer for structured, scalable workflows</div>
                  </div>
                  <div className="bg-lab-surface-elevated rounded-lg p-3">
                    <div className="font-semibold text-lab-primary mb-2">Professional Control</div>
                    <div className="text-lab-text-secondary text-xs">Granular control over aesthetics, composition, and positioning</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-2 text-lab-primary">Architecture & Capabilities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-lab-surface-elevated rounded-lg p-3 text-sm">
                      <div className="font-medium text-lab-text-primary mb-2">Technical Foundation</div>
                      <div className="space-y-1 text-xs text-lab-text-secondary">
                        <div>• 8B Parameters optimized</div>
                        <div>• SmolLM Text Encoder</div>
                        <div>• WAN 2.2 VAE for quality</div>
                        <div>• LLM-to-pixel connection</div>
                      </div>
                    </div>
                    <div className="bg-lab-surface-elevated rounded-lg p-3 text-sm">
                      <div className="font-medium text-lab-text-primary mb-2">Workflow</div>
                      <div className="text-xs text-lab-text-secondary">
                        <div className="flex items-center justify-between mb-2">
                          <span>Prompt</span><span>→</span><span>LLM</span><span>→</span><span>Image</span>
                        </div>
                        <div>• Generate from natural language</div>
                        <div>• Refine with instructions</div>
                        <div>• Inspire from existing images</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-2 text-lab-primary">Advanced Control</h3>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-lab-surface-elevated rounded p-2">
                      <div className="font-medium text-lab-text-primary mb-1">Aesthetics</div>
                      <div className="text-lab-text-secondary">Composition, color, mood</div>
                    </div>
                    <div className="bg-lab-surface-elevated rounded p-2">
                      <div className="font-medium text-lab-text-primary mb-1">Photography</div>
                      <div className="text-lab-text-secondary">Focus, angles, lighting</div>
                    </div>
                    <div className="bg-lab-surface-elevated rounded p-2">
                      <div className="font-medium text-lab-text-primary mb-1">Objects</div>
                      <div className="text-lab-text-secondary">Position, size, texture</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-2 text-lab-primary">Resources</h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Button variant="outline" size="sm" className="bg-lab-surface hover:bg-lab-interactive-hover border-lab-border text-lab-text-primary h-8" asChild>
                      <a href="https://huggingface.co/briaai/BRIA-2.3" target="_blank" rel="noopener noreferrer">🤗 Bria 4</a>
                    </Button>
                    <Button variant="outline" size="sm" className="bg-lab-surface hover:bg-lab-interactive-hover border-lab-border text-lab-text-primary h-8" asChild>
                      <a href="https://docs.bria.ai/" target="_blank" rel="noopener noreferrer">
                        📚 API Docs
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="bg-lab-surface hover:bg-lab-interactive-hover border-lab-border text-lab-text-primary h-8" asChild>
                      <a href="https://platform.bria.ai/" target="_blank" rel="noopener noreferrer">
                        🚀 Bria Platform
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <Dialog>
                <DialogTrigger asChild>
                  
                </DialogTrigger>
                <DialogContent className="max-w-6xl w-full h-[90vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Structured Prompt - Expanded View</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-hidden">
                    <div className="h-full border border-border rounded-lg bg-background overflow-hidden flex flex-col">
                      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                        <span className="text-sm font-medium text-foreground">
                          Structured Prompt
                        </span>
                         <div className="flex items-center gap-1">
                           <Button variant="ghost" size="sm" onClick={() => setViewState(viewState === 'structured' ? 'source' : 'structured')} className="w-8 h-8 rounded-full p-0 text-muted-foreground hover:text-foreground">
                              <Code className="w-4 h-4" />
                           </Button>
                           <Button variant="ghost" size="sm" onClick={onUploadImage} className="w-8 h-8 rounded-full p-0 text-muted-foreground hover:text-foreground">
                             <Image className="w-4 h-4" />
                           </Button>
                           <Button variant="ghost" size="sm" onClick={onUploadDocument} className="w-8 h-8 rounded-full p-0 text-muted-foreground hover:text-foreground">
                             <FileText className="w-4 h-4" />
                           </Button>
                           <Button variant="ghost" size="sm" onClick={copyToClipboard} className="w-8 h-8 rounded-full p-0 text-muted-foreground hover:text-foreground">
                             <Copy className="w-4 h-4" />
                           </Button>
                         </div>
                      </div>
                      <div className="flex-1 overflow-auto h-full">
                        {viewState === 'structured' ? renderStructuredView() : renderSourceView()}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </TooltipTrigger>
            <TooltipContent>
              <p>Expand to fullscreen view</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <TooltipProvider>
          <div className="flex items-center gap-1">
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setViewState(viewState === 'structured' ? 'source' : 'structured')} className="w-8 h-8 rounded-full p-0 text-muted-foreground hover:text-foreground">
                  {viewState === 'structured' ? <Code className="w-4 h-4" /> : <Network className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{viewState === 'structured' ? 'View JSON' : 'Config Explorer'}</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={copyToClipboard} className="w-8 h-8 rounded-full p-0 text-muted-foreground hover:text-foreground">
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy JSON</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>;
  };
  return <div className={cn("relative rounded-lg border border-border overflow-hidden h-full flex flex-col", isGenerating && "opacity-50 pointer-events-none")}>
      {renderHeader()}
      
      <div className="relative flex-1 min-h-0">
        {viewState === 'empty' && renderEmptyState()}
        {viewState === 'structured' && renderStructuredView()}
        {viewState === 'source' && renderSourceView()}
        
        {isGenerating && <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>}
      </div>
    </div>;
};
export default StructuredPromptEditor;