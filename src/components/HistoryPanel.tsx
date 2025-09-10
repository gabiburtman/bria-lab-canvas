import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, History, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: Date;
  thumbnail?: string;
  parameters: Record<string, any>;
}

const HistoryPanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Mock history data
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "1",
      prompt: "A beautiful sunset over mountains with vibrant colors",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      thumbnail: "https://picsum.photos/64/64?random=1",
      parameters: { aspectRatio: "16:9", steps: 30 }
    },
    {
      id: "2", 
      prompt: "Portrait of a wise old wizard with a long beard",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      thumbnail: "https://picsum.photos/64/64?random=2",
      parameters: { aspectRatio: "3:4", steps: 25 }
    },
    {
      id: "3",
      prompt: "Futuristic cityscape with neon lights and flying cars",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      thumbnail: "https://picsum.photos/64/64?random=3", 
      parameters: { aspectRatio: "16:9", steps: 35 }
    },
    {
      id: "4",
      prompt: "Serene forest path with morning sunlight filtering through trees",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      thumbnail: "https://picsum.photos/64/64?random=4",
      parameters: { aspectRatio: "4:5", steps: 30 }
    }
  ]);

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
    setActiveId(item.id);
    // In a real app, this would reload the configuration and results
    console.log("Loading experiment:", item);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-lab-surface rounded-lg shadow-lab-glow-subtle flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="m-2 p-2 hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="writing-mode-vertical text-xs font-medium text-lab-text-muted tracking-widest">
            <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              HISTORY
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-lab-surface rounded-lg shadow-lab-glow-subtle flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-lab-border">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-lab-text-secondary" />
          <h3 className="font-medium text-lab-text-primary text-sm">
            History
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(true)}
          className="p-2 hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 mx-auto mb-2 text-lab-text-muted" />
              <p className="text-sm text-lab-text-secondary">
                No experiments yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "p-3 border border-lab-border rounded-lab cursor-pointer transition-all duration-200 hover:shadow-lab-glow-subtle",
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
                          className="w-12 h-12 rounded-lab-sm object-cover border border-lab-border"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-lab-text-primary font-medium leading-tight mb-1">
                        {truncatePrompt(item.prompt, 50)}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-lab-text-muted">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(item.timestamp)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1 text-xs text-lab-text-secondary">
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