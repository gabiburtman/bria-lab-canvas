import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, History, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: Date;
  thumbnail?: string;
  parameters: Record<string, any>;
  images?: string[];
  jsonConfig?: any;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  activeId: string | null;
  onItemClick: (item: HistoryItem) => void;
}

const HistoryPanel = ({ history, activeId, onItemClick }: HistoryPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const truncatePrompt = (prompt: string, maxLength: number = 60) => {
    return prompt.length > maxLength ? prompt.slice(0, maxLength) + "..." : prompt;
  };

  const handleItemClick = (item: HistoryItem) => {
    onItemClick(item);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-lab-surface rounded-lg shadow-lg flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="m-2 p-2 hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-xs font-medium text-lab-text-muted tracking-widest transform -rotate-90 whitespace-nowrap">
            HISTORY
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-lab-surface rounded-lg shadow-lg flex flex-col">
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-lab-text-secondary" />
          <h3 className="font-medium text-lab-text-primary text-base">
            History
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(true)}
          className="p-2 hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-6 pb-6">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 mx-auto mb-3 text-lab-text-muted" />
              <p className="text-sm text-lab-text-secondary mb-1">
                No experiments yet
              </p>
              <p className="text-xs text-lab-text-muted">
                Generate an image to start building your history
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "p-4 border border-lab-border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lab-glow-subtle",
                    activeId === item.id 
                      ? "bg-lab-primary/10 border-lab-border-focus shadow-lab-glow-focus" 
                      : "bg-lab-surface hover:bg-lab-interactive-hover"
                  )}
                >
                  <div className="flex gap-3">
                    {item.thumbnail && (
                      <div className="flex-shrink-0">
                        <img
                          src={item.thumbnail}
                          alt="Experiment thumbnail"
                          className="w-12 h-12 rounded-lg object-cover border border-lab-border"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-lab-text-primary font-medium leading-tight mb-2">
                        {truncatePrompt(item.prompt, 50)}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-lab-text-muted mb-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(item.timestamp)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-lab-text-secondary">
                        <span>{item.parameters.aspectRatio}</span>
                        <span>•</span>
                        <span>{item.parameters.steps} steps</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HistoryPanel;