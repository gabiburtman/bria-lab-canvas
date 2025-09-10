import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Upload, FileText, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

interface JSONEditorProps {
  value: string;
  onChange: (value: string) => void;
  isGenerating: boolean;
  lockedFields: Set<string>;
  onFieldLock: (field: string, locked: boolean) => void;
  onUploadImage: () => void;
  onUploadDocument: () => void;
  updatedFields?: Set<string>;
}

const JSONEditor = ({
  value,
  onChange,
  isGenerating,
  lockedFields,
  onFieldLock,
  onUploadImage,
  onUploadDocument,
  updatedFields = new Set()
}: JSONEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [parsedJSON, setParsedJSON] = useState<any>(null);

  useEffect(() => {
    try {
      setParsedJSON(JSON.parse(value));
    } catch {
      setParsedJSON(null);
    }
  }, [value]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(value);
  }, [value]);

  const getLineNumbers = () => {
    const lines = value.split('\n');
    return lines.map((_, index) => index + 1);
  };

  const highlightSyntax = (text: string) => {
    return text
      .replace(/"([^"]+)":/g, '<span class="text-lab-code-key">"$1":</span>')
      .replace(/:\s*"([^"]*)"/g, ': <span class="text-lab-code-string">"$1"</span>')
      .replace(/:\s*(\d+)/g, ': <span class="text-lab-code-number">$1</span>')
      .replace(/:\s*(true|false)/g, ': <span class="text-lab-code-boolean">$1</span>')
      .replace(/:\s*(null)/g, ': <span class="text-lab-code-null">$1</span>');
  };

  const renderJSONWithLocks = () => {
    if (!parsedJSON) return value;
    
    const lines = value.split('\n');
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      const match = trimmedLine.match(/"([^"]+)":/);
      const fieldName = match ? match[1] : null;
      const isField = fieldName && !line.includes('{') && !line.includes('[');
      const isLocked = fieldName && lockedFields.has(fieldName);
      const isUpdated = fieldName && updatedFields.has(fieldName);
      
      return (
        <div 
          key={index} 
          className={cn(
            "flex items-center group relative",
            isUpdated && "bg-yellow-200/20 animate-pulse"
          )}
        >
          <span className="w-8 text-xs text-lab-text-muted text-right pr-2 select-none flex-shrink-0">
            {index + 1}
          </span>
          <div className="flex-1 relative">
            <span 
              className="text-sm font-mono leading-6"
              dangerouslySetInnerHTML={{ __html: highlightSyntax(line) }}
            />
            {isField && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "absolute right-1 top-0 w-5 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                  isLocked && "opacity-100"
                )}
                onClick={() => fieldName && onFieldLock(fieldName, !isLocked)}
              >
                {isLocked ? (
                  <Lock className="w-3 h-3 text-lab-accent" />
                ) : (
                  <Unlock className="w-3 h-3 text-lab-text-muted" />
                )}
              </Button>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={cn(
      "relative bg-lab-code-bg rounded-lg border border-lab-code-border overflow-hidden",
      isGenerating && "opacity-50 pointer-events-none"
    )}>
      {/* Header with buttons */}
      <div className="flex items-center justify-between p-3 border-b border-lab-code-border bg-lab-code-bg">
        <span className="text-sm font-medium text-lab-text-primary">JSON Editor</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUploadImage}
            className="text-lab-text-secondary hover:text-lab-text-primary hover:bg-lab-interactive-hover p-1.5 h-auto"
          >
            <Upload className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onUploadDocument}
            className="text-lab-text-secondary hover:text-lab-text-primary hover:bg-lab-interactive-hover p-1.5 h-auto"
          >
            <FileText className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="text-lab-text-secondary hover:text-lab-text-primary hover:bg-lab-interactive-hover p-1.5 h-auto"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor content */}
      <div className="relative h-96 overflow-hidden">
        {/* Syntax highlighted display */}
        <div className="absolute inset-0 p-4 overflow-y-auto scrollbar-thin scrollbar-track-lab-code-bg scrollbar-thumb-lab-text-muted/20">
          <div className="space-y-0">
            {renderJSONWithLocks()}
          </div>
        </div>

        {/* Invisible textarea for editing */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full font-mono text-sm bg-transparent text-transparent caret-lab-primary border-none resize-none focus:ring-0 p-4 leading-6 z-10"
          style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
          spellCheck={false}
        />

        {/* Generation overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-lab-code-bg/80 flex items-center justify-center z-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lab-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JSONEditor;