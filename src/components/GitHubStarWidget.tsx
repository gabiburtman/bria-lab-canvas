import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, X, Github } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const GITHUB_REPO = "lovableai/gaia-lab"; // Replace with actual repo
const STORAGE_KEY = "github-star-widget-dismissed";

const GitHubStarWidget = () => {
  const [starCount, setStarCount] = useState<number | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if widget was dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    setIsDismissed(dismissed === "true");
  }, []);

  // Fetch star count from GitHub API
  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`);
        if (response.ok) {
          const data = await response.json();
          setStarCount(data.stargazers_count);
        }
      } catch (error) {
        console.error("Failed to fetch star count:", error);
      }
    };

    if (!isDismissed) {
      fetchStarCount();
    }
  }, [isDismissed]);

  const handleRepoClick = useCallback(() => {
    window.open(`https://github.com/${GITHUB_REPO}`, "_blank", "noopener,noreferrer");
  }, []);

  const handleStarClick = useCallback(async () => {
    setIsLoading(true);
    // Open GitHub star page in new tab
    window.open(`https://github.com/${GITHUB_REPO}`, "_blank", "noopener,noreferrer");
    
    toast({
      description: "Thanks for considering to star us! ⭐",
    });
    
    setIsLoading(false);
  }, []);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsDismissed(true);
  }, []);

  // Show minimal fallback after dismissal
  if (isDismissed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-9 h-9 rounded-full bg-transparent hover:bg-lab-border text-lab-text-secondary hover:text-lab-text-primary transition-all duration-200"
            onClick={handleRepoClick}
          >
            <Github className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>GitHub Repository</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="relative group">
      {/* Dismiss button - appears on hover */}
      <button
        onClick={handleDismiss}
        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 w-4 h-4 rounded-full bg-lab-border hover:bg-lab-interactive-hover text-lab-text-muted hover:text-lab-text-secondary flex items-center justify-center"
        aria-label="Dismiss star widget"
      >
        <X className="w-2.5 h-2.5" />
      </button>

      {/* Split button container */}
      <div className="flex items-center bg-transparent hover:bg-lab-border rounded-full overflow-hidden transition-all duration-200">
        {/* Left side - Repository access */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleRepoClick}
              className="flex items-center gap-1.5 px-2 py-1.5 pl-2.5 hover:bg-lab-interactive-hover transition-colors duration-200 text-lab-text-secondary hover:text-lab-text-primary"
              aria-label="Open GitHub repository"
            >
              <Github className="w-4 h-4" />
              {starCount !== null && (
                <span className="text-xs font-medium text-lab-text-muted">
                  {starCount.toLocaleString()}
                </span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Repository</p>
          </TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-4 bg-lab-border" />

        {/* Right side - Star action */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleStarClick}
              disabled={isLoading}
              className="flex items-center gap-1 px-2 py-1.5 pr-2.5 hover:bg-lab-interactive-hover transition-colors duration-200 text-lab-text-secondary hover:text-lab-text-primary disabled:opacity-50"
              aria-label="Star this repository"
            >
              <Star className={`w-3.5 h-3.5 ${isLoading ? "animate-pulse" : ""}`} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Star on GitHub</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default GitHubStarWidget;