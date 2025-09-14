import { useState, useCallback } from "react";
import ConfigurationPanel from "./ConfigurationPanel";
import ResultsCanvas from "./ResultsCanvas";
import HistoryPanel, { HistoryItem } from "./HistoryPanel";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, User, Settings, LogOut, FileText, HelpCircle } from "lucide-react";
const LabInterface = () => {
  const [images, setImages] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [currentConfig, setCurrentConfig] = useState<any>(null);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const clearResults = useCallback(() => {
    setImages([]);
    setActiveHistoryId(null);
    setCurrentConfig(null);
  }, []);
  const handleImagesGenerated = useCallback((images: string[], config: any) => {
    setImages(images);

    // Add to history
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      prompt: config.prompt || config.mainPrompt || "Untitled experiment",
      timestamp: new Date(),
      thumbnail: images[0],
      // Use first generated image as thumbnail
      visualControls: {
        aspectRatio: config.aspectRatio || "1:1",
        steps: config.steps || 30,
        seed: config.seed
      },
      images,
      jsonConfig: config.jsonConfig
    };
    setHistory(prev => [historyItem, ...prev]);
    setActiveHistoryId(historyItem.id);
    setCurrentConfig(config);
  }, []);
  const handleHistoryItemClick = useCallback((item: HistoryItem) => {
    setActiveHistoryId(item.id);
    setImages(item.images || []);

    // In a real implementation, this would restore the configuration
    // For now, we'll just set the current config
    setCurrentConfig({
      mainPrompt: item.prompt,
      aspectRatio: item.visualControls.aspectRatio,
      steps: item.visualControls.steps,
      seed: item.visualControls.seed,
      jsonConfig: item.jsonConfig
    });
  }, []);
  const handleUploadImage = useCallback(() => {
    // This will be handled by the ConfigurationPanel component
    console.log('Upload image requested');
  }, []);
  const handleUploadDocument = useCallback(() => {
    // This will be handled by the ConfigurationPanel component
    console.log('Upload document requested');
  }, []);
  return <div className="h-screen flex flex-col bg-lab-background font-roboto overflow-hidden">
      {/* Floating Header Elements */}
      <div className="flex flex-col gap-3 p-4 flex-none">
        {/* Top Row - Logo, Title & Navigation */}
        <div className="flex items-center justify-between">
          {/* Left Group - Logo & Title */}
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/41e99d95-4105-4ece-b06b-475e0b2e8f10.png" alt="Bria Logo" className="h-8 w-auto" />
            <h1 className="text-xl font-google-sans font-medium text-lab-text-primary">GAIA Lab</h1>
          </div>

          {/* Right Group - Navigation & User */}
        <div className="flex items-center gap-2">
          {/* Primary CTA */}
          <Button variant="default" className="bg-lab-primary hover:bg-lab-primary-hover text-lab-primary-foreground font-medium px-4 hover:shadow-lab-glow-primary transition-all">
            Bria Platform
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>

          {/* External Links */}
          <div className="flex items-center gap-1 ml-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full bg-transparent hover:bg-lab-border text-lab-text-secondary hover:text-lab-text-primary transition-all duration-200">
                  <img src="/lovable-uploads/d7168b47-d969-4810-b373-9a25ca8d305d.png" alt="Hugging Face" className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hugging Face</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full bg-transparent hover:bg-lab-border text-lab-text-secondary hover:text-lab-text-primary transition-all duration-200">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>GitHub</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full bg-transparent hover:bg-lab-border text-lab-text-secondary hover:text-lab-text-primary transition-all duration-200">
                  <img src="/lovable-uploads/ae118f43-dd1c-4862-9ac5-47b536da3b12.png" alt="Discord" className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Discord</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full bg-transparent hover:bg-lab-border text-lab-text-secondary hover:text-lab-text-primary transition-all duration-200">
                  <FileText className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Documentation</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs px-2 h-7 rounded bg-transparent hover:bg-lab-border text-lab-text-muted hover:text-lab-text-secondary transition-all duration-200">
                  Research Paper
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Research Paper</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full bg-transparent hover:bg-lab-border text-lab-text-secondary hover:text-lab-text-primary ml-2 transition-all duration-200">
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

        {/* Description Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-lab-text-secondary max-w-2xl">
              This is the interactive lab for GAIA, the first open-source model that uses long, structured prompts for developer-native precision and professional control.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-lab-surface hover:bg-lab-interactive-hover border-lab-border text-lab-text-primary">
                  Learn more
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
          </div>
        </div>
      </div>
      
      
      {/* Main Content Area - Floating Panels */}
      <div className="flex-1 min-h-0 p-4">
        <div className="flex gap-4 h-full min-h-0">
          {/* Configuration Panel - Fixed width since overlay doesn't affect layout */}
          <div className="w-[48.5%] min-w-0">
          <ConfigurationPanel onImagesGenerated={handleImagesGenerated} onClearResults={clearResults} initialConfig={currentConfig} onGeneratingChange={setIsGenerating} onUploadImage={handleUploadImage} onUploadDocument={handleUploadDocument} />
          </div>
          
          {/* Results Canvas with History Panel */}
          <div className="w-[48.5%] min-w-0 relative">
            <ResultsCanvas images={images} isGenerating={isGenerating} />
          </div>
          
          {/* History Panel - Normal layout when collapsed, overlay when expanded */}
          <div className="flex-shrink-0 w-16 relative">
            <HistoryPanel history={history} activeId={activeHistoryId} onItemClick={handleHistoryItemClick} onCollapseChange={setIsHistoryCollapsed} />
          </div>
        </div>
      </div>
    </div>;
};
export default LabInterface;