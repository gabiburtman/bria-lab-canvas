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
  visualControls: Record<string, any>;
  images?: string[];
  jsonConfig?: any;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  activeId: string | null;
  onItemClick: (item: HistoryItem) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

const HistoryPanel = ({ history, activeId, onItemClick, onCollapseChange }: HistoryPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed
  const [wasManuallyExpanded, setWasManuallyExpanded] = useState(false);
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);

  const handleCollapse = (collapsed: boolean, isManual: boolean = false) => {
    setIsCollapsed(collapsed);
    onCollapseChange?.(collapsed);
    
    if (isManual) {
      setWasManuallyExpanded(!collapsed);
      setIsHoverExpanded(false); // Reset hover state when manual action occurs
    }
  };

  const handleMouseEnter = () => {
    if (isCollapsed && !wasManuallyExpanded) {
      setIsHoverExpanded(true);
      setIsCollapsed(false);
      onCollapseChange?.(false);
    }
  };

  const handleMouseLeave = () => {
    // Only auto-collapse if it was expanded by hover
    if (isHoverExpanded && !wasManuallyExpanded) {
      setTimeout(() => {
        if (isHoverExpanded && !wasManuallyExpanded) {
          setIsCollapsed(true);
          setIsHoverExpanded(false);
          onCollapseChange?.(true);
        }
      }, 300); // Small delay to prevent flicker
    }
  };

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

  return (
    <>
      {/* Collapsed state - Part of normal layout */}
      {isCollapsed && (
        <div 
          className="w-16 h-full bg-lab-surface rounded-lg shadow-lg flex flex-col relative"
          onMouseEnter={handleMouseEnter}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              handleCollapse(false, true);
            }}
            className="m-2 p-2 hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 flex flex-col min-h-0">
            {history.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-xs font-medium text-lab-text-muted tracking-widest transform -rotate-90 whitespace-nowrap">
                  EXPERIMENTS
                </div>
              </div>
            ) : (
              <>
                {/* Fixed height container for title to prevent overlap */}
                <div className="h-36 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <div className="text-xs font-medium text-lab-text-muted tracking-widest transform -rotate-90 whitespace-nowrap">
                    EXPERIMENTS
                  </div>
                </div>
                
                {/* Thumbnails container with clear separation */}
                <div className="flex flex-col gap-4 px-2 flex-1 overflow-y-auto items-center pb-4 pt-2">
                  {history.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onItemClick(item);
                        handleCollapse(false, true);
                      }}
                      className={cn(
                        "w-12 h-12 rounded cursor-pointer transition-all duration-200 border-2 flex-shrink-0",
                        activeId === item.id 
                          ? "border-lab-border-focus shadow-lab-glow-focus" 
                          : "border-lab-border hover:border-lab-border-focus hover:shadow-lab-glow-subtle"
                      )}
                    >
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt="Experiment"
                          className="w-full h-full rounded object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded bg-lab-border flex items-center justify-center">
                          <History className="w-4 h-4 text-lab-text-muted" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Expanded overlay - Expands leftward over middle panel */}
      {!isCollapsed && (
        <div className="absolute top-0 right-0 h-full w-80 bg-lab-surface rounded-lg shadow-2xl flex flex-col z-50 border border-lab-border"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-lab-text-primary text-base">
                Experiments
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleCollapse(true, true);
              }}
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
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "p-2 border border-lab-border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lab-glow-subtle",
                        activeId === item.id 
                          ? "bg-lab-primary/10 border-lab-border-focus shadow-lab-glow-focus" 
                          : "bg-lab-surface hover:bg-lab-interactive-hover"
                      )}
                    >
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt="Experiment"
                          className="w-full aspect-square rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-full aspect-square rounded-md bg-lab-border flex items-center justify-center">
                          <History className="w-6 h-6 text-lab-text-muted" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  );
};

export default HistoryPanel;