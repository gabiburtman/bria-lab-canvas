import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Download, 
  Share, 
  ThumbsUp, 
  ThumbsDown, 
  Code, 
  Grid3X3,
  Badge
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCardProps {
  src?: string;
  index: number;
}

const ImageCard = ({ src, index }: ImageCardProps) => {
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
    return (
      <div className="aspect-square bg-lab-interactive-hover border border-lab-border rounded-lab flex items-center justify-center">
        <div className="w-8 h-8 bg-lab-interactive-active rounded-lab animate-pulse"></div>
      </div>
    );
  }

  const ActionButtons = () => (
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lab flex items-start justify-between p-3">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/90 hover:bg-white text-lab-text-primary h-8 px-2 shadow-lab-glow-subtle"
        >
          <Badge className="w-3 h-3 mr-1" />
          CR
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/90 hover:bg-white text-lab-text-primary h-8 px-2 shadow-lab-glow-subtle"
        >
          <Download className="w-3 h-3" />
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/90 hover:bg-white text-lab-text-primary h-8 px-2 shadow-lab-glow-subtle"
        >
          <Share className="w-3 h-3" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-lab-text-primary h-8 px-2 shadow-lab-glow-subtle"
            >
              <Code className="w-3 h-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-lab-surface border-lab-border shadow-lab-glow-subtle">
            <div className="space-y-3">
              <h4 className="font-medium text-lab-text-primary text-sm">Code Snippets</h4>
              {Object.entries(mockCodeSnippets).map(([lang, code]) => (
                <div key={lang} className="space-y-1">
                  <div className="text-xs font-medium text-lab-text-secondary uppercase tracking-wide">
                    {lang}
                  </div>
                  <pre className="text-xs bg-lab-code-bg text-lab-code-text p-2 rounded-lab-sm overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  const FeedbackButtons = () => (
    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setLiked(true)}
          className={cn(
            "bg-white/90 hover:bg-white text-lab-text-primary h-8 px-2 shadow-lab-glow-subtle",
            liked === true && "bg-lab-status-success text-white hover:bg-lab-status-success"
          )}
        >
          <ThumbsUp className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setLiked(false)}
          className={cn(
            "bg-white/90 hover:bg-white text-lab-text-primary h-8 px-2 shadow-lab-glow-subtle",
            liked === false && "bg-lab-status-error text-white hover:bg-lab-status-error"
          )}
        >
          <ThumbsDown className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          className="group aspect-square bg-lab-surface border border-lab-border rounded-lab overflow-hidden cursor-pointer hover:border-lab-border-hover hover:shadow-lab-glow-subtle transition-all duration-200 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img 
            src={src} 
            alt={`Generated image ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <ActionButtons />
          <FeedbackButtons />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-lab-surface border-lab-border">
        <div className="relative group">
          <img 
            src={src} 
            alt={`Generated image ${index + 1}`}
            className="w-full max-h-[80vh] object-contain rounded-lab"
          />
          <ActionButtons />
          <FeedbackButtons />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ResultsCanvas = () => {
  // Mock generated images - in real app this would come from props/state
  const [images, setImages] = useState<string[]>([]);
  const hasResults = images.length > 0;

  // Mock function to simulate image generation
  const mockImages = [
    "https://picsum.photos/512/512?random=1",
    "https://picsum.photos/512/512?random=2", 
    "https://picsum.photos/512/512?random=3",
    "https://picsum.photos/512/512?random=4"
  ];

  // Temporary demo function
  const loadMockImages = () => {
    setImages(mockImages);
  };

  if (!hasResults) {
    return (
      <div className="w-full h-full bg-lab-surface border-r border-lab-border flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-lab-interactive-hover rounded-lab flex items-center justify-center">
            <Grid3X3 className="w-8 h-8 text-lab-text-muted" />
          </div>
          <h3 className="text-lg font-medium text-lab-text-primary mb-2">
            System Ready for Generation
          </h3>
          <p className="text-sm text-lab-text-secondary mb-4">
            Define parameters and prompt in the left panel to run an experiment.
          </p>
          {/* Temporary demo button */}
          <Button 
            onClick={loadMockImages}
            variant="outline"
            size="sm"
            className="border-lab-border hover:bg-lab-interactive-hover text-lab-text-secondary"
          >
            Load Demo Images
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-lab-surface border-r border-lab-border p-6">
      <div className="grid grid-cols-2 gap-4 h-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <ImageCard 
            key={index}
            src={images[index]}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsCanvas;