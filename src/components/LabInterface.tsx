import { useState } from "react";
import ConfigurationPanel from "./ConfigurationPanel";
import ResultsCanvas from "./ResultsCanvas";
import HistoryPanel from "./HistoryPanel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, User, Settings, LogOut, FileText } from "lucide-react";

const LabInterface = () => {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleImagesGenerated = (images: string[]) => {
    setGeneratedImages(images);
  };

  return (
    <div className="min-h-screen bg-lab-background font-roboto p-4">
      {/* Floating Header Elements */}
      <div className="flex items-center justify-between mb-6">
        {/* Left Group - Logo & Title */}
        <div className="flex items-center gap-3">
          <img src="/lovable-uploads/41e99d95-4105-4ece-b06b-475e0b2e8f10.png" alt="Bria Logo" className="h-8 w-auto" />
          <h1 className="text-xl font-google-sans font-medium text-lab-text-primary">
            Bria 4 Lab
          </h1>
        </div>

        {/* Right Group - Navigation & User */}
        <div className="flex items-center gap-2">
          {/* Primary CTA */}
          <Button 
            variant="default" 
            className="bg-lab-primary hover:bg-lab-primary-hover text-lab-primary-foreground font-medium px-4 hover:shadow-lab-glow-primary transition-all"
          >
            Bria Platform
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>

          {/* External Links */}
          <div className="flex items-center gap-1 ml-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-9 h-9 rounded-full bg-transparent hover:bg-lab-border text-lab-text-secondary hover:text-lab-text-primary transition-all duration-200"
                >
                  <img 
                    src="/lovable-uploads/d7168b47-d969-4810-b373-9a25ca8d305d.png" 
                    alt="Hugging Face" 
                    className="w-4 h-4"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hugging Face</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-9 h-9 rounded-full bg-transparent hover:bg-lab-border text-lab-text-secondary hover:text-lab-text-primary transition-all duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>GitHub</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-9 h-9 rounded-full bg-transparent hover:bg-lab-border text-lab-text-secondary hover:text-lab-text-primary transition-all duration-200"
                >
                  <img 
                    src="/lovable-uploads/ae118f43-dd1c-4862-9ac5-47b536da3b12.png" 
                    alt="Discord" 
                    className="w-4 h-4"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Discord</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-9 h-9 rounded-full bg-transparent hover:bg-lab-border text-lab-text-secondary hover:text-lab-text-primary transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Documentation</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9 rounded-full bg-transparent hover:bg-lab-border text-lab-text-secondary hover:text-lab-text-primary ml-2 transition-all duration-200"
              >
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-lab-surface border-lab-border shadow-lab-glow-subtle">
              <DropdownMenuItem className="cursor-pointer hover:bg-lab-interactive-hover">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-lab-interactive-hover">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Main Content Area - Floating Panels */}
      <div className="flex gap-4 h-[calc(100vh-8rem)]">
        {/* Configuration Panel - 45% width */}
        <div className="w-[45%] min-w-0">
          <ConfigurationPanel onImagesGenerated={handleImagesGenerated} />
        </div>
        
        {/* Results Canvas - 45% width */}
        <div className="w-[45%] min-w-0">
          <ResultsCanvas images={generatedImages} />
        </div>
        
        {/* History Panel - 10% width, collapsible */}
        <div className="w-[10%] min-w-0 max-w-80">
          <HistoryPanel />
        </div>
      </div>
    </div>
  );
};

export default LabInterface;