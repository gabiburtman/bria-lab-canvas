import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, Share, ThumbsUp, ThumbsDown, Code, Grid3X3, Badge, HelpCircle, Sparkles, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
interface ImageCardProps {
  src?: string;
  index: number;
}
const ImageCard = ({
  src,
  index
}: ImageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const mockCodeSnippets = {
    python: `import requests

response = requests.post(
  "https://api.bria.ai/v1/generate",
  headers={"Authorization": "Bearer YOUR_API_KEY"},
  json={"prompt": "Your prompt here", "model": "bria-4"}
)`,
    javascript: `fetch('https://api.bria.ai/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Your prompt here',
    model: 'bria-4'
  })
})`,
    curl: `curl -X POST https://api.bria.ai/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Your prompt here", "model": "bria-4"}'`
  };
  if (!src) {
    return <div className="aspect-square bg-lab-interactive-hover border border-lab-border rounded-lab flex items-center justify-center">
        <div className="w-8 h-8 bg-lab-interactive-active rounded-lab animate-pulse"></div>
      </div>;
  }
  const ActionButtons = () => <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lab flex items-start justify-between p-3">
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" className="w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm">
          <Badge className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm">
          <Download className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="ghost" className="w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm">
              <Code className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-background border-border shadow-lg z-50">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground text-sm">Code Snippets</h4>
              {Object.entries(mockCodeSnippets).map(([lang, code]) => <div key={lang} className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {lang}
                  </div>
                  <pre className="text-xs bg-muted text-muted-foreground p-2 rounded overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                </div>)}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>;
  const FeedbackButtons = () => <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => setLiked(true)} className={cn("w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm", liked === true && "bg-green-500 text-white border-green-500 hover:bg-green-600")}>
          <ThumbsUp className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setLiked(false)} className={cn("w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm", liked === false && "bg-red-500 text-white border-red-500 hover:bg-red-600")}>
          <ThumbsDown className="w-4 h-4" />
        </Button>
      </div>
    </div>;
  const SharePopover = ({
    inDialog = false
  }: {
    inDialog?: boolean;
  }) => <Popover>
      <PopoverTrigger asChild>
        <Button variant={inDialog ? "ghost" : "outline"} size={inDialog ? "sm" : "default"} className={inDialog ? "w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm" : "w-full bg-lab-surface hover:bg-lab-interactive-hover border-lab-border hover:border-lab-border-hover text-lab-text-primary transition-all duration-200"}>
          <Share className={inDialog ? "w-4 h-4" : "w-4 h-4 mr-2"} />
          {!inDialog && "Share"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-lab-surface border-lab-border shadow-lg">
        <div className="space-y-3">
          <h4 className="font-medium text-lab-text-primary text-sm">Share Image</h4>
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-full justify-start text-lab-text-secondary hover:text-lab-text-primary hover:bg-lab-interactive-hover" onClick={() => {
            navigator.clipboard.writeText(src || '');
          }}>
              Copy Image Link
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-lab-text-secondary hover:text-lab-text-primary hover:bg-lab-interactive-hover" onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `Generated Image ${index + 1}`,
                url: src
              });
            }
          }}>
              Native Share
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>;
  return <div className="flex flex-col h-full">
      <Dialog>
        <DialogTrigger asChild>
          <div className="group aspect-square bg-lab-surface border border-lab-border rounded-lab overflow-hidden cursor-pointer hover:border-lab-border-hover hover:shadow-lab-glow-subtle transition-all duration-200 relative flex-shrink-0" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <img src={src} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover" />
            <ActionButtons />
            <FeedbackButtons />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl bg-lab-surface border-lab-border">
          <div className="relative group">
            <img src={src} alt={`Generated image ${index + 1}`} className="w-full max-h-[80vh] object-contain rounded-lab" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lab flex items-start justify-between p-3">
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm">
                  <Badge className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <SharePopover inDialog={true} />
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="ghost" className="w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm">
                      <Code className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-background border-border shadow-lg z-50">
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground text-sm">Code Snippets</h4>
                      {Object.entries(mockCodeSnippets).map(([lang, code]) => <div key={lang} className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {lang}
                          </div>
                          <pre className="text-xs bg-muted text-muted-foreground p-2 rounded overflow-x-auto">
                            <code>{code}</code>
                          </pre>
                        </div>)}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <FeedbackButtons />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Prominent Share Button */}
      <div className="mt-2 flex-shrink-0">
        <SharePopover />
      </div>
    </div>;
};
const ResultsCanvas = ({
  images = [],
  isGenerating = false
}: {
  images?: string[];
  isGenerating?: boolean;
}) => {
  const hasResults = images.length > 0;

  // Show loading state when generating
  if (isGenerating) {
    return (
      <div className="h-full bg-lab-surface border border-lab-border rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lab-primary mx-auto mb-4"></div>
          <p className="text-lab-text-secondary">Generating images...</p>
        </div>
      </div>
    );
  }

  // Mock function to simulate image generation
  const mockImages = ["https://picsum.photos/512/512?random=1", "https://picsum.photos/512/512?random=2", "https://picsum.photos/512/512?random=3", "https://picsum.photos/512/512?random=4"];
  if (!hasResults) {
    return <div className="w-full h-full bg-lab-surface rounded-lg shadow-lg flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-lab-interactive-hover rounded-lg flex items-center justify-center">
            <Grid3X3 className="w-8 h-8 text-lab-text-muted" />
          </div>
          <h3 className="text-lg font-medium text-lab-text-primary mb-2">
            System Ready for Generation
          </h3>
          <p className="text-sm text-lab-text-secondary mb-4">Input experiment specification or prompt in the left panel to run an experiment.</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm text-lab-primary hover:text-lab-primary-hover hover:bg-lab-primary/10 transition-all duration-200">
                <HelpCircle className="w-4 h-4 mr-2" />
                Learn about Bria 4
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-lab-surface border-lab-border">
              <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lab-text-primary">
                <Code className="w-5 h-5 text-lab-primary" />
                Bria 4 Developer Reference
              </DialogTitle>
                <DialogDescription className="text-lab-text-secondary">
                  Technical specifications and integration guide
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 text-lab-text-primary max-h-[70vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-lab-primary" />
                        Model Architecture
                      </h4>
                      <div className="text-sm text-lab-text-secondary space-y-1">
                        <p>• Diffusion-based architecture (UNet backbone)</p>
                        <p>• 1.2B parameters optimized for generation</p>
                        <p>• CLIP text encoder with 77 token limit</p>
                        <p>• VAE latent space: 512x512 → 64x64</p>
                        <p>• Inference steps: 20-50 (recommended: 28)</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-lab-primary" />
                        Training Data
                      </h4>
                      <div className="text-sm text-lab-text-secondary space-y-1">
                        <p>• Licensed stock imagery dataset</p>
                        <p>• 45M curated image-text pairs</p>
                        <p>• Commercial-safe, copyright cleared</p>
                        <p>• Filtered for quality and diversity</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">API Integration Example</h4>
                      <div className="bg-lab-interactive-active rounded p-3 text-xs font-mono text-lab-text-secondary">
                        <pre>{`import { pipeline } from '@huggingface/transformers';

// Load model
const generator = await pipeline(
  'text-to-image',
  'bria-ai/bria-4-base',
  { device: 'webgpu' }
);

// Generate image
const result = await generator(
  "portrait of a developer coding",
  {
    num_inference_steps: 28,
    guidance_scale: 7.5,
    width: 512,
    height: 512
  }
);`}</pre>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Experiment Spec Schema</h4>
                      <div className="bg-lab-interactive-active rounded p-3 text-xs font-mono text-lab-text-secondary">
                        <pre>{`{
  "prompt": "string",
  "negative_prompt": "string?",
  "width": 512 | 768 | 1024,
  "height": 512 | 768 | 1024,
  "guidance_scale": 1.0-20.0,
  "num_inference_steps": 20-50,
  "seed": "number?",
  "style": "photographic" | "digital_art"
}`}</pre>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-lab-border pt-4">
                  <h4 className="font-medium mb-3">Resources & Documentation</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" className="bg-lab-surface hover:bg-lab-interactive-hover border-lab-border text-lab-text-primary" asChild>
                      <a href="https://huggingface.co/bria-ai" target="_blank" rel="noopener noreferrer">
                        🤗 Hugging Face Model Hub
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="bg-lab-surface hover:bg-lab-interactive-hover border-lab-border text-lab-text-primary" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        📄 Research Paper (arXiv:2024.xxxxx)
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="bg-lab-surface hover:bg-lab-interactive-hover border-lab-border text-lab-text-primary" asChild>
                      <a href="https://docs.bria.ai/api" target="_blank" rel="noopener noreferrer">
                        📚 API Documentation
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>;
  }
  return <div className="w-full h-full bg-lab-surface rounded-lg shadow-lg p-6 overflow-auto">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-lab-text-primary">
          Generated Images
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-6 min-h-full">
        {Array.from({
        length: 4
      }).map((_, index) => <div key={index} className="flex flex-col">
            <ImageCard src={images[index]} index={index} />
          </div>)}
      </div>
    </div>;
};
export default ResultsCanvas;