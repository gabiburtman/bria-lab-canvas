import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StructuredPromptEditor from "./StructuredPromptEditor";
import { ArrowRight, Upload, FileText, Copy, Lock, Unlock, Sliders, Crop, Wand2, Languages, Hash, Target, Sprout, Zap, Image } from "lucide-react";
import { cn } from "@/lib/utils";
const defaultJSON = {
  "short_description": "",
  "objects": [{
    "description": "",
    "location": "",
    "relationship": "",
    "relative_size": "",
    "shape_and_color": "",
    "texture": "",
    "appearance_details": "",
    "pose": "",
    "expression": "",
    "clothing": "",
    "action": "",
    "gender": "",
    "skin_tone_and_texture": "",
    "orientation": "",
    "number_of_objects": ""
  }],
  "background_setting": "",
  "lighting": {
    "conditions": "",
    "direction": "",
    "shadows": ""
  },
  "aesthetics": {
    "composition": "",
    "color_scheme": "",
    "mood_atmosphere": "",
    "preference_score": "",
    "aesthetic_score": ""
  },
  "photographic_characteristics": {
    "depth_of_field": "",
    "focus": "",
    "camera_angle": "",
    "lens_focal_length": ""
  },
  "style_medium": "",
  "text_render": [{
    "text": "",
    "location": "",
    "size": "",
    "color": "",
    "font": "",
    "appearance_details": ""
  }],
  "context": "",
  "artistic_style": ""
};
// Function to get random item from array
const getRandomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Function to generate varied structured prompt data
const generateVariedStructuredPrompt = () => {
  const descriptions = [
    "A serene mountain landscape at sunrise with vibrant colors",
    "A bustling city street at night with neon reflections",
    "A mystical forest clearing with ethereal lighting",
    "A cozy café interior with warm ambient lighting",
    "A futuristic laboratory with holographic displays",
    "A vintage library filled with ancient books",
    "A tranquil beach scene with crystal clear waters",
    "A dramatic stormy sky over rolling hills",
    "A modern architectural marvel with geometric patterns",
    "A whimsical garden with exotic flowers"
  ];

  const objects = [
    {
      "description": "Majestic snow-capped mountain peak",
      "location": "Center background of the image",
      "relationship": "Dominates the skyline",
      "relative_size": "Large, occupying 60% of the frame",
      "shape_and_color": "Triangular peak with white snow and gray rock faces",
      "texture": "Rocky with smooth snow patches",
      "appearance_details": "Sharp edges with dramatic shadows",
      "pose": "Static mountain formation",
      "expression": "N/A",
      "clothing": "N/A",
      "action": "Standing majestically",
      "gender": "N/A",
      "skin_tone_and_texture": "N/A",
      "orientation": "Vertical peak pointing upward",
      "number_of_objects": "1 main peak with 2 smaller peaks"
    },
    {
      "description": "Elegant figure walking through the scene",
      "location": "Center-left of the composition",
      "relationship": "Main focal point of the image",
      "relative_size": "Medium, about 30% of frame height",
      "shape_and_color": "Graceful silhouette in flowing garments",
      "texture": "Soft fabric with subtle wrinkles",
      "appearance_details": "Confident posture with natural movement",
      "pose": "Mid-stride walking pose",
      "expression": "Serene and contemplative",
      "clothing": "Flowing coat in earth tones",
      "action": "Walking purposefully",
      "gender": "Androgynous",
      "skin_tone_and_texture": "Warm medium tone with natural highlights",
      "orientation": "Profile view facing right",
      "number_of_objects": "1 person with subtle shadow"
    }
  ];

  const backgrounds = [
    "Alpine mountain range during golden hour with clear sky",
    "Urban cityscape with towering skyscrapers and busy streets",
    "Dense forest with shafts of sunlight filtering through leaves",
    "Minimalist interior with clean lines and natural materials",
    "Futuristic environment with glowing panels and sleek surfaces",
    "Classic library setting with wooden shelves and vintage furniture",
    "Tropical paradise with palm trees and turquoise water",
    "Dramatic landscape with rolling clouds and open fields",
    "Modern architectural space with glass and steel elements",
    "Enchanted garden with lush vegetation and magical atmosphere"
  ];

  const lightingConditions = [
    "Golden hour sunrise lighting",
    "Dramatic studio lighting with key and fill",
    "Soft natural window lighting",
    "Moody evening twilight",
    "Bright midday sun with harsh shadows",
    "Warm candlelight ambiance",
    "Cool blue moonlight",
    "Colorful neon lighting",
    "Soft overcast daylight",
    "Dramatic rim lighting"
  ];

  const lightingDirections = [
    "Side lighting from the left",
    "Backlighting creating silhouettes",
    "Top-down overhead lighting",
    "Front lighting with even illumination",
    "Three-quarter lighting for dimension",
    "Rim lighting from behind",
    "Window lighting from the right",
    "Multiple light sources",
    "Bounced soft lighting",
    "Directional spotlight"
  ];

  const colorSchemes = [
    "Warm oranges and yellows contrasting with cool blues",
    "Monochromatic blues with subtle variations",
    "High contrast black and white with red accents",
    "Earthy browns and greens with gold highlights",
    "Vibrant purples and magentas",
    "Muted pastels with soft transitions",
    "Bold primary colors with strong saturation",
    "Vintage sepia tones with cream highlights",
    "Cool grays and silvers with blue undertones",
    "Rich jewel tones with deep shadows"
  ];

  const moods = [
    "Peaceful, inspiring, and majestic",
    "Dynamic, energetic, and urban",
    "Mysterious, ethereal, and contemplative",
    "Cozy, intimate, and welcoming",
    "Futuristic, sleek, and innovative",
    "Nostalgic, scholarly, and timeless",
    "Relaxing, tropical, and carefree",
    "Dramatic, powerful, and emotional",
    "Clean, modern, and sophisticated",
    "Whimsical, magical, and enchanting"
  ];

  const cameraAngles = [
    "Low angle looking up at the mountain",
    "High angle bird's eye view",
    "Eye level straight on perspective",
    "Dutch angle for dynamic tension",
    "Extreme close-up detail shot",
    "Wide establishing shot",
    "Medium shot with balanced framing",
    "Over-the-shoulder perspective",
    "Worm's eye view from below",
    "Aerial drone perspective"
  ];

  const styleMediums = [
    "Photorealistic digital photography",
    "Oil painting with visible brushstrokes",
    "Watercolor with soft bleeding effects",
    "Digital art with clean vector lines",
    "Charcoal sketch with textural elements",
    "Acrylic painting with bold colors",
    "Vintage film photography",
    "Modern digital illustration",
    "Mixed media collage",
    "Hyperrealistic rendering"
  ];

  const contexts = [
    "Nature photography showcasing the beauty of mountain landscapes",
    "Street photography capturing urban life and energy",
    "Fine art photography exploring light and shadow",
    "Portrait photography emphasizing human emotion",
    "Architectural photography highlighting design elements",
    "Travel photography documenting cultural experiences",
    "Commercial photography for advertising purposes",
    "Editorial photography telling a story",
    "Documentary photography capturing real moments",
    "Conceptual photography expressing abstract ideas"
  ];

  return {
    "short_description": getRandomItem(descriptions),
    "objects": [getRandomItem(objects)],
    "background_setting": getRandomItem(backgrounds),
    "lighting": {
      "conditions": getRandomItem(lightingConditions),
      "direction": getRandomItem(lightingDirections),
      "shadows": "Long dramatic shadows cast to the right"
    },
    "aesthetics": {
      "composition": "Rule of thirds with mountain peak in upper third",
      "color_scheme": getRandomItem(colorSchemes),
      "mood_atmosphere": getRandomItem(moods),
      "preference_score": (8.0 + Math.random() * 2).toFixed(1),
      "aesthetic_score": (7.5 + Math.random() * 2).toFixed(1)
    },
    "photographic_characteristics": {
      "depth_of_field": "Deep focus with sharp foreground and background",
      "focus": "Sharp focus throughout the scene",
      "camera_angle": getRandomItem(cameraAngles),
      "lens_focal_length": "35mm wide angle"
    },
    "style_medium": getRandomItem(styleMediums),
    "text_render": [{
      "text": "CREATIVE VISION",
      "location": "Bottom left corner",
      "size": "Medium, 24pt font",
      "color": "White with subtle shadow",
      "font": "Modern sans-serif",
      "appearance_details": "Clean, minimalist typography"
    }],
    "context": getRandomItem(contexts),
    "artistic_style": "Contemporary landscape photography with emphasis on natural lighting"
  };
};
const PromptComponent = ({
  value,
  onChange,
  placeholder,
  aspectRatio,
  aspectRatios,
  setAspectRatio,
  steps,
  setSteps,
  guidanceScale,
  setGuidanceScale,
  seed,
  setSeed,
  handleGenerate,
  hasGenerated,
  onUploadDocument,
  isGenerating,
  onSurpriseMe,
  onTranslatePrompt,
  onUploadImage,
  isRefinementMode = false,
  initialInput
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  aspectRatio: string;
  aspectRatios: Array<{
    value: string;
    label: string;
  }>;
  setAspectRatio: (ratio: string) => void;
  steps: number[];
  setSteps: (steps: number[]) => void;
  guidanceScale: number[];
  setGuidanceScale: (guidanceScale: number[]) => void;
  seed: string;
  setSeed: (seed: string) => void;
  handleGenerate: () => void;
  hasGenerated: boolean;
  isGenerating: boolean;
  onSurpriseMe: () => void;
  onTranslatePrompt: () => void;
  onUploadImage: () => void;
  onUploadDocument: () => void;
  isRefinementMode?: boolean;
  initialInput?: { type: 'text' | 'image' | 'brief'; data: string | { url: string; name?: string } } | null;
}) => {
  // Height constants to maintain exact same total height
  const baseEditorHeight = 260; // Increased from 180 to give more space to prompt
  const tabsBarHeight = 40;
  const refinedContentHeight = baseEditorHeight - tabsBarHeight;
  
  const renderViewInput = () => {
    const contentStyle = { minHeight: `${refinedContentHeight}px` };
    
    if (!initialInput) {
      return (
        <div 
          className="p-4 flex items-center justify-center text-lab-text-muted bg-transparent"
          style={contentStyle}
        >
          <p className="text-sm italic">No original input</p>
        </div>
      );
    }
    
    // Handle different input types
    if (initialInput.type === 'image' && typeof initialInput.data === 'object') {
      const imageData = initialInput.data as { url: string; name?: string };
      return (
        <div 
          className="p-4 bg-transparent flex flex-col gap-3"
          style={contentStyle}
        >
          <div className="text-sm text-lab-text-muted mb-2">Uploaded Image:</div>
          <div className="flex items-center gap-3">
            <img 
              src={imageData.url} 
              alt="Uploaded reference" 
              className="w-16 h-16 object-cover rounded-lg border border-lab-border"
            />
            <div className="text-sm text-lab-text-secondary">
              {imageData.name || 'Uploaded Image'}
            </div>
          </div>
        </div>
      );
    }
    
    if (initialInput.type === 'brief' && typeof initialInput.data === 'string') {
      return (
        <div 
          className="p-4 bg-transparent flex flex-col gap-3"
          style={contentStyle}
        >
          <div className="text-sm text-lab-text-muted mb-2">Uploaded Brief:</div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-lab-interactive-hover rounded-lg border border-lab-border flex items-center justify-center">
              <FileText className="w-8 h-8 text-lab-text-secondary" />
            </div>
            <div className="text-sm text-lab-text-secondary">
              {initialInput.data}
            </div>
          </div>
        </div>
      );
    }
    
    // Handle text input
    if (initialInput.type === 'text' && typeof initialInput.data === 'string' && initialInput.data.trim()) {
      return (
        <div 
          className="resize-none bg-transparent border-none text-lab-text-muted p-4 whitespace-pre-wrap overflow-auto cursor-default select-text text-sm opacity-60"
          style={contentStyle}
        >
          {initialInput.data}
        </div>
      );
    }
    
    // Fallback for empty or invalid input
    return (
      <div 
        className="p-4 flex items-center justify-center text-lab-text-muted bg-transparent"
        style={contentStyle}
      >
        <p className="text-sm italic">No original input</p>
      </div>
    );
  };

  return (
    <div className="rounded-lg bg-background overflow-hidden relative">
      {hasGenerated ? (
        <Tabs defaultValue="refine" className="w-full">
          <TabsList className="w-full justify-start rounded-none bg-lab-surface h-10">
            <TabsTrigger value="refine" className="text-sm">Refine</TabsTrigger>
            <TabsTrigger value="input" className="text-sm">View input</TabsTrigger>
          </TabsList>
          
          <TabsContent value="refine" className="mt-0 relative">
            <Textarea 
              placeholder="Refine a specific visual element. Instruct on a change to the mood, colors, or details."
              value={value}
              onChange={e => onChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (value.trim() || hasGenerated) {
                    handleGenerate();
                  }
                }
              }}
              className="resize-none bg-transparent border-none focus:ring-0 text-lab-text-primary placeholder:text-lab-text-muted p-4 pr-28 sm:pr-32 md:pr-36"
              style={{ minHeight: `${refinedContentHeight}px` }}
            />
            
            {/* Surprise Me Button - positioned inside textarea */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={onSurpriseMe} 
                  disabled={isGenerating} 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 w-8 h-8 rounded-full p-0 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#374151] bg-transparent transition-all duration-200"
                >
                  <Wand2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Surprise me with a random prompt</p>
              </TooltipContent>
            </Tooltip>
          </TabsContent>
          
          <TabsContent value="input" className="mt-0">
            {renderViewInput()}
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <Textarea 
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (value.trim() || hasGenerated) {
                  handleGenerate();
                }
              }
            }}
            className="resize-none bg-transparent border-none focus:ring-0 text-lab-text-primary placeholder:text-lab-text-muted p-4 pr-28 sm:pr-32 md:pr-36"
            style={{ minHeight: `${baseEditorHeight}px` }}
          />
          
          {/* Upload Image, Upload Document, and Surprise Me Buttons - positioned inside textarea */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onUploadImage} className="w-8 h-8 rounded-full p-0 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#374151] bg-transparent transition-all duration-200" disabled={isGenerating}>
                  <Image className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload Image</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onUploadDocument} className="w-8 h-8 rounded-full p-0 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#374151] bg-transparent transition-all duration-200" disabled={isGenerating}>
                  <FileText className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload Brief</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={onSurpriseMe} 
                  disabled={isGenerating} 
                  variant="ghost" 
                  size="sm"
                  className="w-8 h-8 rounded-full p-0 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#374151] bg-transparent transition-all duration-200"
                >
                  <Wand2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Surprise me with a random prompt</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </>
      )}
      
      {/* Controls Bar */}
      <TooltipProvider>
        <div className="flex items-center justify-between p-3 border-t border-lab-border bg-background">
          <div className="flex items-center gap-2">
            {/* Aspect Ratio Button */}
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-lab-border hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary flex items-center gap-1">
                      <Crop className="w-3 h-3" />
                      {aspectRatio}
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Aspect Ratio</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-32 bg-lab-surface border-lab-border shadow-lg" align="start">
                <div className="space-y-1">
                  {aspectRatios.map(ratio => <button key={ratio.value} onClick={() => setAspectRatio(ratio.value)} className={cn("w-full text-left px-3 py-2 text-sm rounded-md transition-colors", aspectRatio === ratio.value ? "bg-lab-primary text-lab-primary-foreground" : "hover:bg-lab-interactive-hover text-lab-text-secondary")}>
                      {ratio.label}
                    </button>)}
                </div>
              </PopoverContent>
            </Popover>

            {/* Steps Button */}
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-lab-border hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {steps[0]} Steps
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Steps</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-64 bg-lab-surface border-lab-border shadow-lg">
                <div>
                  <Slider value={steps} onValueChange={setSteps} max={50} min={20} step={1} className="w-full" />
                  <div className="mt-2 text-center text-sm text-lab-text-secondary">{steps[0]} steps</div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Guidance Scale Button */}
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-lab-border hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      CFG {guidanceScale[0]}
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Guidance Scale</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-64 bg-lab-surface border-lab-border shadow-lg">
                <div>
                  <Slider value={guidanceScale} onValueChange={setGuidanceScale} max={10} min={0} step={0.1} className="w-full" />
                  <div className="mt-2 text-center text-sm text-lab-text-secondary">Guidance: {guidanceScale[0]}</div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Seed Button */}
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-lab-border hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary flex items-center gap-1">
                      <Sprout className="w-3 h-3" />
                      {seed || "Random"}
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Set a seed to recreate or vary a result</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-64 bg-lab-surface border-lab-border shadow-lg">
                <div>
                  <Input placeholder="Random" value={seed} onChange={e => setSeed(e.target.value)} className="bg-lab-surface border-lab-border focus:border-lab-border-focus" />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-1">
            {/* Show Structured Prompt Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onTranslatePrompt} disabled={isGenerating || !hasGenerated && !value.trim() || hasGenerated && !value.trim()} variant="link" size="sm" className="text-[#9CA3AF] hover:text-[#F3F4F6] h-auto p-0 font-normal text-sm underline-offset-4">
                  Show Structured Prompt
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Convert prompt to structured format</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};
const ConfigurationPanel = ({
  onImagesGenerated,
  onClearResults,
  initialConfig,
  onGeneratingChange,
  onUploadImage,
  onUploadDocument
}: {
  onImagesGenerated?: (images: string[], config: any) => void;
  onClearResults?: () => void;
  initialConfig?: any;
  onGeneratingChange?: (isGenerating: boolean) => void;
  onUploadImage?: () => void;
  onUploadDocument?: () => void;
}) => {
  const [hasGenerated, setHasGenerated] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState(initialConfig?.mainPrompt || "");
  const [mainPrompt, setMainPrompt] = useState(initialConfig?.mainPrompt || "");
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState(initialConfig?.aspectRatio || "1:1");
  const [steps, setSteps] = useState([initialConfig?.steps || 30]);
  const [guidanceScale, setGuidanceScale] = useState([initialConfig?.guidanceScale || 5]);
  const [seed, setSeed] = useState(initialConfig?.seed || "");
  const [jsonData, setJsonData] = useState(initialConfig?.jsonConfig || JSON.stringify(defaultJSON, null, 2));
  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set());
  const [updatedFields, setUpdatedFields] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [initialInput, setInitialInput] = useState<{ type: 'text' | 'image' | 'brief'; data: string | { url: string; name?: string } } | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedBriefName, setUploadedBriefName] = useState<string | null>(null);

  // File input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const briefInputRef = useRef<HTMLInputElement>(null);

  // Effect to sync with initial config
  useEffect(() => {
    if (initialConfig) {
      setMainPrompt(initialConfig.mainPrompt || "");
      setOriginalPrompt(initialConfig.mainPrompt || "");
      setAspectRatio(initialConfig.aspectRatio || "1:1");
      setSteps([initialConfig.steps || 30]);
      setSeed(initialConfig.seed || "");
      if (initialConfig.jsonConfig) {
        setJsonData(initialConfig.jsonConfig);
      }
    }
  }, [initialConfig]);
  const aspectRatios = [{
    value: "9:16",
    label: "9:16"
  }, {
    value: "2:3",
    label: "2:3"
  }, {
    value: "3:4",
    label: "3:4"
  }, {
    value: "1:1",
    label: "1:1"
  }, {
    value: "4:3",
    label: "4:3"
  }, {
    value: "3:2",
    label: "3:2"
  }, {
    value: "16:9",
    label: "16:9"
  }];

  // Random prompts for the "Surprise Me" feature
  const randomPrompts = ["A majestic mountain landscape at sunrise with golden light", "A cozy coffee shop in a bustling city street during autumn", "A futuristic cityscape with flying cars and neon lights", "A peaceful forest clearing with sunbeams filtering through trees", "A vintage bookstore filled with antique books and warm lighting", "A modern architectural marvel reflecting in still water", "A vibrant market scene with colorful fruits and busy vendors", "A serene beach at sunset with gentle waves and palm trees", "A snow-covered village with twinkling lights and smoke from chimneys", "A mysterious cave entrance with glowing crystals inside"];

  // Refinement suggestions for when in refinement mode
  const refinementSuggestions = ["Add more dramatic lighting with stronger shadows", "Make the colors more vibrant and saturated", "Add atmospheric fog or mist for depth", "Include more detailed textures on surfaces", "Enhance the contrast between light and dark areas", "Add subtle motion blur to suggest movement", "Increase the depth of field for better focus", "Add warm golden hour lighting", "Include more intricate details in the foreground", "Make the composition more dynamic with diagonal lines", "Add reflections for more visual interest", "Enhance the mood with cooler or warmer tones", "Add subtle lens flare effects", "Include more environmental storytelling elements", "Make the scene more cinematic with wider framing"];

  // Handle translate prompt to structured prompt
  const handleTranslatePrompt = useCallback(() => {
    const currentPrompt = hasGenerated ? refinementPrompt : mainPrompt;
    if (!currentPrompt.trim()) return;

    // Capture the initial input if not already done
    if (!hasGenerated) {
      if (mainPrompt.trim()) {
        setInitialInput({ type: 'text', data: mainPrompt });
        setOriginalPrompt(mainPrompt);
      }
      // Switch to refine mode by setting hasGenerated to true
      setHasGenerated(true);
    }

    // Clear previous highlights
    setUpdatedFields(new Set());

    // Show loading state in structured prompt area
    setIsProcessingFile(true);

    // Simulate translation processing
    setTimeout(() => {
      // Populate structured prompt with varied data based on the prompt
      setJsonData(JSON.stringify(generateVariedStructuredPrompt(), null, 2));

      // Mark some fields as updated, but exclude locked fields
      const potentialUpdatedFields = new Set(['short_description', 'background_setting', 'lighting.conditions', 'aesthetics.mood_atmosphere']);
      const fieldsToUpdate = new Set([...potentialUpdatedFields].filter(field => !lockedFields.has(field)));
      setUpdatedFields(fieldsToUpdate);

      // Clear the refinement prompt if in refine mode
      if (hasGenerated) {
        setRefinementPrompt("");
      }

      // Hide loading state
      setIsProcessingFile(false);
    }, 1500); // 1.5 second delay to simulate processing
  }, [hasGenerated, refinementPrompt, mainPrompt, lockedFields]);

  // Handle surprise me functionality
  const handleSurpriseMe = useCallback(() => {
    if (hasGenerated) {
      // In refinement mode - use refinement suggestions
      const randomRefinement = refinementSuggestions[Math.floor(Math.random() * refinementSuggestions.length)];
      setRefinementPrompt(randomRefinement);
    } else {
      // In initial mode - use full scene prompts
      const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
      setMainPrompt(randomPrompt);
    }
  }, [hasGenerated]);

  // Helper function to get image dimensions based on aspect ratio
  const getImageDimensions = (aspectRatio: string) => {
    const baseSize = 512;
    switch (aspectRatio) {
      case "9:16":
        return {
          width: Math.round(baseSize * 9 / 16),
          height: baseSize
        };
      case "2:3":
        return {
          width: Math.round(baseSize * 2 / 3),
          height: baseSize
        };
      case "3:4":
        return {
          width: Math.round(baseSize * 3 / 4),
          height: baseSize
        };
      case "4:3":
        return {
          width: baseSize,
          height: Math.round(baseSize * 3 / 4)
        };
      case "3:2":
        return {
          width: baseSize,
          height: Math.round(baseSize * 2 / 3)
        };
      case "16:9":
        return {
          width: baseSize,
          height: Math.round(baseSize * 9 / 16)
        };
      default:
        return {
          width: baseSize,
          height: baseSize
        };
    }
  };
  const handleGenerate = () => {
    if (!hasGenerated) {
      // Capture the initial input for the first generation
      if (mainPrompt.trim()) {
        setInitialInput({ type: 'text', data: mainPrompt });
        setOriginalPrompt(mainPrompt);
      } else if (uploadedImageUrl) {
        setInitialInput({ type: 'image', data: { url: uploadedImageUrl, name: 'uploaded-image' } });
      } else if (uploadedBriefName) {
        setInitialInput({ type: 'brief', data: uploadedBriefName });
      }
      setHasGenerated(true);
    }
    setIsGenerating(true);
    setIsProcessingFile(true);
    onGeneratingChange?.(true);

    // Simulate generation and populate experiment spec with mock data
    setTimeout(() => {
      setIsGenerating(false);
      setIsProcessingFile(false);
      onGeneratingChange?.(false);

      // Clear previous highlights on new generation
      setUpdatedFields(new Set());

      // Populate structured prompt with varied data based on the prompt
      setJsonData(JSON.stringify(generateVariedStructuredPrompt(), null, 2));

      // Mark some fields as updated, but exclude locked fields
      const potentialUpdatedFields = new Set(['short_description', 'background_setting', 'lighting.conditions', 'aesthetics.mood_atmosphere']);
      const fieldsToUpdate = new Set([...potentialUpdatedFields].filter(field => !lockedFields.has(field)));
      setUpdatedFields(fieldsToUpdate);

      // Generate new mock images with correct aspect ratio
      const timestamp = Date.now();
      const dimensions = getImageDimensions(aspectRatio);
      const mockImages = [`https://picsum.photos/${dimensions.width}/${dimensions.height}?random=${timestamp + 1}`, `https://picsum.photos/${dimensions.width}/${dimensions.height}?random=${timestamp + 2}`, `https://picsum.photos/${dimensions.width}/${dimensions.height}?random=${timestamp + 3}`, `https://picsum.photos/${dimensions.width}/${dimensions.height}?random=${timestamp + 4}`];

      // Notify parent component about generated images
      const config = {
        mainPrompt,
        refinementPrompt,
        aspectRatio,
        steps: steps[0],
        seed,
        jsonConfig: jsonData,
        prompt: hasGenerated ? refinementPrompt : mainPrompt
      };
      if (onImagesGenerated) {
        onImagesGenerated(mockImages, config);
      }
      if (hasGenerated) {
        setRefinementPrompt("");
      }
    }, 3000);
  };
  const handleStartOver = () => {
    setHasGenerated(false);
    setOriginalPrompt("");
    setMainPrompt("");
    setRefinementPrompt("");
    setAspectRatio("1:1");
    setSteps([30]);
    setSeed("");
    setJsonData(JSON.stringify(defaultJSON, null, 2));
    setLockedFields(new Set());
    setUpdatedFields(new Set());
    setIsGenerating(false);
    setInitialInput(null);
    
    // Clean up uploaded file URLs to prevent memory leaks
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
      setUploadedImageUrl(null);
    }
    setUploadedBriefName(null);

    // Clear the results panel without adding to history
    if (onClearResults) {
      onClearResults();
    }
  };
  const handleFieldLock = (field: string, locked: boolean) => {
    const newLockedFields = new Set(lockedFields);
    if (locked) {
      newLockedFields.add(field);
    } else {
      newLockedFields.delete(field);
    }
    setLockedFields(newLockedFields);
  };

  // Handle batch locking of multiple fields (for parent + children)
  const handleBatchFieldLock = (fields: string[], locked: boolean) => {
    const newLockedFields = new Set(lockedFields);
    fields.forEach(field => {
      if (locked) {
        newLockedFields.add(field);
      } else {
        newLockedFields.delete(field);
      }
    });
    setLockedFields(newLockedFields);
  };
  const handleUploadImage = () => {
    // Notify parent (analytics/telemetry) but always open the file dialog here
    onUploadImage?.();
    imageInputRef.current?.click();
  };
  const handleUploadDocument = () => {
    // Notify parent (analytics/telemetry) but always open the file dialog here
    onUploadDocument?.();
    briefInputRef.current?.click();
  };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clean up previous image URL
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    
    // Create object URL for the uploaded image
    const imageUrl = URL.createObjectURL(file);
    setUploadedImageUrl(imageUrl);

    // Set initial input and switch to refine mode
    setInitialInput({ 
      type: 'image', 
      data: { url: imageUrl, name: file.name } 
    });

  // Switch to refine mode immediately
  setHasGenerated(true);

  // Simulate processing the image and extracting experiment spec
  setIsProcessingFile(true);
  setTimeout(() => {
    setIsProcessingFile(false);
    
    // Populate structured prompt with varied data
    const variedData = generateVariedStructuredPrompt();
    setJsonData(JSON.stringify({
      ...variedData,
      short_description: `Analysis of uploaded image: ${file.name}`,
      context: "Image analysis and experiment spec extraction",
      style_medium: "Based on uploaded reference image"
    }, null, 2));

    // Mark fields as updated
    const updatedFieldsSet = new Set(['short_description', 'context', 'style_medium']);
    setUpdatedFields(updatedFieldsSet);
  }, 2000);
  };
  // Helper function to check if structured prompt has meaningful content
  const hasStructuredPromptContent = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonData);
      // Check if any field has non-empty content
      return Object.values(parsed).some(val => {
        if (typeof val === 'string') return val.trim() !== '';
        if (Array.isArray(val)) {
          return val.some(item => {
            if (typeof item === 'string') return item.trim() !== '';
            if (typeof item === 'object' && item !== null) {
              return Object.values(item).some(subVal => typeof subVal === 'string' ? subVal.trim() !== '' : subVal !== null && subVal !== undefined && subVal !== '');
            }
            return item !== null && item !== undefined && item !== '';
          });
        }
        if (typeof val === 'object' && val !== null) {
          return Object.values(val).some(subVal => typeof subVal === 'string' ? subVal.trim() !== '' : subVal !== null && subVal !== undefined && subVal !== '');
        }
        return val !== null && val !== undefined && val !== '';
      });
    } catch {
      return false;
    }
  }, [jsonData]);

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Store the uploaded brief name
    setUploadedBriefName(file.name);

    // Set initial input and switch to refine mode
    setInitialInput({ 
      type: 'brief', 
      data: file.name 
    });

  // Switch to refine mode immediately
  setHasGenerated(true);

  // Simulate processing the brief and extracting structured prompt
  setIsProcessingFile(true);
  setTimeout(() => {
    setIsProcessingFile(false);
    
    // Populate structured prompt with varied data
    const variedData = generateVariedStructuredPrompt();
    setJsonData(JSON.stringify({
      ...variedData,
      short_description: `Structured prompt extracted from brief: ${file.name}`,
      context: "Brief-based structured prompt extraction",
      artistic_style: "Style defined in uploaded brief document"
    }, null, 2));

    // Mark fields as updated
    const updatedFieldsSet = new Set(['short_description', 'context', 'artistic_style']);
    setUpdatedFields(updatedFieldsSet);
  }, 2000);
  };
  return (
    <div className="w-full h-full bg-lab-surface rounded-lg shadow-lg flex flex-col overflow-hidden">
      {/* Hidden file inputs */}
      <input ref={imageInputRef} type="file" accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.svg" onChange={handleImageUpload} className="hidden" />
      <input ref={briefInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.md,.rtf" onChange={handleDocumentUpload} className="hidden" />

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0 p-6 gap-4">{/* Removed header, adjusted padding */}
        {/* Prompt Section - Increased height */}
        <div className="flex-shrink-0" style={{ height: '320px' }}>
          <PromptComponent
            value={hasGenerated ? refinementPrompt : mainPrompt} 
            onChange={hasGenerated ? setRefinementPrompt : setMainPrompt} 
            placeholder={hasGenerated ? "Refine with new instructions..." : "What's your objective? Describe it here, or start with an image or a brief."} 
            aspectRatio={aspectRatio} 
            aspectRatios={aspectRatios} 
            setAspectRatio={setAspectRatio} 
            steps={steps} 
            setSteps={setSteps} 
            guidanceScale={guidanceScale}
            setGuidanceScale={setGuidanceScale}
            seed={seed}
            setSeed={setSeed} 
            handleGenerate={handleGenerate} 
            hasGenerated={hasGenerated} 
            isGenerating={isGenerating} 
            onSurpriseMe={handleSurpriseMe} 
            onTranslatePrompt={handleTranslatePrompt} 
            onUploadImage={handleUploadImage}
            onUploadDocument={handleUploadDocument}
            isRefinementMode={hasGenerated}
            initialInput={initialInput}
          />
        </div>

        {/* Structured Prompt Editor - Limited height */}
        <div className="flex-1 min-h-0 max-h-80 overflow-hidden">
          <div className="h-full">
            <StructuredPromptEditor value={jsonData} onChange={setJsonData} isGenerating={isProcessingFile} lockedFields={lockedFields} onFieldLock={handleFieldLock} onBatchFieldLock={handleBatchFieldLock} onUploadImage={handleUploadImage} onUploadDocument={handleUploadDocument} updatedFields={updatedFields} forceStructuredView={hasGenerated || isGenerating} readOnly={true} />
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex-shrink-0 pt-4 border-t border-lab-border">
          <div className="flex gap-3">
            <Button onClick={handleStartOver} disabled={!hasGenerated} variant="outline" className="text-lab-text-secondary hover:text-lab-text-primary border-lab-border hover:border-lab-border-hover disabled:opacity-50 disabled:cursor-not-allowed">
              Start Over
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating || (!hasGenerated && !mainPrompt.trim() && !hasStructuredPromptContent())} className="flex-1 bg-lab-primary hover:bg-lab-primary/90 text-lab-primary-foreground px-6 py-3 rounded-md font-medium transition-colors">
              {isGenerating ? "Generating..." : hasGenerated ? "Regenerate" : "Generate"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConfigurationPanel;