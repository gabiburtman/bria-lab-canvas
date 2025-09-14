import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, Share, ThumbsUp, ThumbsDown, Code, Grid3X3, Badge, HelpCircle, Sparkles, Zap, Shield } from "lucide-react";
import { FaReddit, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { ApiReferenceDialog } from "@/components/ApiReferenceDialog";
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
  if (!src) {
    return <div className="aspect-square bg-lab-interactive-hover border border-lab-border rounded-lab flex items-center justify-center">
        <div className="w-8 h-8 bg-lab-interactive-active rounded-lab animate-pulse"></div>
      </div>;
  }
  const handleDefineAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Define action logic here
    console.log('Define action triggered for image', index + 1);
  };
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (src) {
      const link = document.createElement('a');
      link.href = src;
      link.download = `generated-image-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const ActionButtons = () => <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lab flex items-start justify-between p-3">
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={handleDefineAction} className="w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm">
          <Badge className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleDownload} className="w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm">
          <Download className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex gap-2">
        <ApiReferenceDialog trigger={<Button size="sm" variant="ghost" onClick={e => e.stopPropagation()} className="w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm">
              <Code className="w-4 h-4" />
            </Button>} />
      </div>
    </div>;
  const FeedbackButtons = () => <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={e => {
        e.stopPropagation();
        setLiked(true);
      }} className={cn("w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm", liked === true && "bg-green-500 text-white border-green-500 hover:bg-green-600")}>
          <ThumbsUp className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={e => {
        e.stopPropagation();
        setLiked(false);
      }} className={cn("w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm", liked === false && "bg-red-500 text-white border-red-500 hover:bg-red-600")}>
          <ThumbsDown className="w-4 h-4" />
        </Button>
      </div>
    </div>;
  const SharePopover = ({
    inDialog = false
  }: {
    inDialog?: boolean;
  }) => {
    const shareMessage = "Check out this amazing image generated with Bria AI! 🎨✨ #AIArt #BriaAI #GenerativeAI";
    const imageUrl = encodeURIComponent(src || '');
    const encodedMessage = encodeURIComponent(shareMessage);
    const handleLinkedInShare = (e: React.MouseEvent) => {
      e.stopPropagation();
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${imageUrl}&title=${encodedMessage}`;
      window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
    };
    const handleXShare = (e: React.MouseEvent) => {
      e.stopPropagation();
      const xUrl = `https://x.com/intent/tweet?text=${encodedMessage}&url=${imageUrl}`;
      window.open(xUrl, '_blank', 'noopener,noreferrer');
    };
    const handleRedditShare = (e: React.MouseEvent) => {
      e.stopPropagation();
      const redditUrl = `https://reddit.com/submit?url=${imageUrl}&title=${encodedMessage}`;
      window.open(redditUrl, '_blank', 'noopener,noreferrer');
    };
    return <Popover>
      <PopoverTrigger asChild>
        <Button variant={inDialog ? "ghost" : "outline"} size={inDialog ? "sm" : "default"} className={inDialog ? "w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm" : "w-full bg-lab-surface hover:bg-lab-interactive-hover border-lab-border hover:border-lab-border-hover text-lab-text-primary transition-all duration-200"}>
          <Share className={inDialog ? "w-4 h-4" : "w-4 h-4 mr-2"} />
          {!inDialog && "Share"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-lab-surface border-lab-border shadow-lg p-2">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-[#0077B5] hover:text-[#005885] hover:bg-lab-interactive-hover transition-colors duration-200" onClick={handleLinkedInShare}>
            <FaLinkedin className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-white hover:text-gray-300 hover:bg-lab-interactive-hover transition-colors duration-200" onClick={handleXShare}>
            <FaXTwitter className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-[#FF4500] hover:text-[#CC3700] hover:bg-lab-interactive-hover transition-colors duration-200" onClick={handleRedditShare}>
            <FaReddit className="w-4 h-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>;
  };
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
                
                <ApiReferenceDialog trigger={<Button size="sm" variant="ghost" className="w-8 h-8 rounded-full p-0 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm">
                      <Code className="w-4 h-4" />
                    </Button>} />
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
    return <div className="h-full bg-lab-surface border border-lab-border rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lab-primary mx-auto mb-4"></div>
          <p className="text-lab-text-secondary">Generating images...</p>
        </div>
      </div>;
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
          <p className="text-sm text-lab-text-secondary">Input experiment specification or prompt in the left panel to run an experiment.</p>
        </div>
      </div>;
  }
  return <div className="w-full h-full bg-lab-surface rounded-lg shadow-lg p-6 flex flex-col">
      <div className="mb-4 flex-shrink-0">
        
      </div>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {Array.from({
        length: 4
      }).map((_, index) => <div key={index} className="flex flex-col">
            <ImageCard src={images[index]} index={index} />
          </div>)}
      </div>
    </div>;
};
export default ResultsCanvas;