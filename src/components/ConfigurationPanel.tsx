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
import { ArrowRight, Upload, FileText, Copy, Lock, Unlock, Sliders, Crop, Wand2, Languages, Hash, Target, Sprout, Zap, Image, X } from "lucide-react";
import { cn } from "@/lib/utils";
import AspectRatioIcon from "./AspectRatioIcon";
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

// Function to extract image concepts from prompt
const extractImageConcepts = (prompt: string): string[] => {
  const concepts = ['nature', 'landscape', 'forest', 'mountain', 'ocean', 'beach', 'sunset', 'sunrise', 'city', 'urban', 'building', 'architecture', 'street', 'road', 'bridge', 'person', 'people', 'portrait', 'face', 'woman', 'man', 'child', 'animal', 'cat', 'dog', 'bird', 'horse', 'wildlife', 'flower', 'plant', 'tree', 'garden', 'park', 'food', 'coffee', 'restaurant', 'kitchen', 'technology', 'computer', 'phone', 'car', 'vehicle', 'art', 'painting', 'music', 'book', 'library', 'water', 'river', 'lake', 'rain', 'snow', 'cloud', 'sky', 'light', 'shadow', 'fire', 'candle'];
  const promptLower = prompt.toLowerCase();
  const foundConcepts = concepts.filter(concept => promptLower.includes(concept) || promptLower.includes(concept + 's') || promptLower.includes(concept + 'ing'));
  return foundConcepts.length > 0 ? foundConcepts : ['nature']; // Default to nature if no concepts found
};

// Function to get concept-based image ID from picsum.photos
const getConceptImageId = (prompt: string): number => {
  const concepts = extractImageConcepts(prompt);

  // Curated picsum.photos image IDs mapped to concepts
  const conceptMap: Record<string, number[]> = {
    nature: [1018, 1025, 1026, 1036],
    landscape: [1018, 1025, 1026, 1036],
    forest: [441, 453, 473, 478],
    mountain: [490, 519, 582, 588],
    ocean: [147, 167, 200, 212],
    beach: [147, 167, 200, 212],
    sunset: [734, 740, 757, 775],
    sunrise: [734, 740, 757, 775],
    city: [384, 416, 493, 500],
    urban: [384, 416, 493, 500],
    building: [250, 274, 292, 321],
    architecture: [250, 274, 292, 321],
    street: [324, 342, 378, 384],
    road: [324, 342, 378, 384],
    bridge: [342, 378, 416, 493],
    person: [91, 177, 338, 415],
    people: [91, 177, 338, 415],
    portrait: [91, 177, 338, 415],
    face: [91, 177, 338, 415],
    woman: [177, 338, 415, 494],
    man: [91, 177, 338, 415],
    child: [177, 338, 415, 494],
    animal: [237, 433, 659, 718],
    cat: [237, 433, 659, 718],
    dog: [237, 433, 659, 718],
    bird: [433, 659, 718, 790],
    horse: [237, 433, 659, 718],
    wildlife: [237, 433, 659, 718],
    flower: [158, 160, 169, 198],
    plant: [158, 160, 169, 198],
    tree: [441, 453, 473, 478],
    garden: [158, 160, 169, 198],
    park: [441, 453, 473, 478],
    food: [312, 326, 431, 439],
    coffee: [312, 326, 431, 439],
    restaurant: [312, 326, 431, 439],
    kitchen: [312, 326, 431, 439],
    technology: [518, 574, 608, 684],
    computer: [518, 574, 608, 684],
    phone: [518, 574, 608, 684],
    car: [111, 193, 244, 280],
    vehicle: [111, 193, 244, 280],
    art: [102, 123, 139, 152],
    painting: [102, 123, 139, 152],
    music: [102, 123, 139, 152],
    book: [102, 123, 139, 152],
    library: [102, 123, 139, 152],
    water: [147, 167, 200, 212],
    river: [147, 167, 200, 212],
    lake: [147, 167, 200, 212],
    rain: [734, 740, 757, 775],
    snow: [734, 740, 757, 775],
    cloud: [734, 740, 757, 775],
    sky: [734, 740, 757, 775],
    light: [734, 740, 757, 775],
    shadow: [734, 740, 757, 775],
    fire: [734, 740, 757, 775],
    candle: [734, 740, 757, 775]
  };

  // Get a random ID from the first matching concept, or default nature concept
  const primaryConcept = concepts[0];
  const conceptIds = conceptMap[primaryConcept] || conceptMap.nature;
  return getRandomItem(conceptIds);
};

// Function to generate varied structured prompt data
const generateVariedStructuredPrompt = () => {
  const descriptions = ["A serene mountain landscape at sunrise with vibrant colors", "A bustling city street at night with neon reflections", "A mystical forest clearing with ethereal lighting", "A cozy café interior with warm ambient lighting", "A futuristic laboratory with holographic displays", "A vintage library filled with ancient books", "A tranquil beach scene with crystal clear waters", "A dramatic stormy sky over rolling hills", "A modern architectural marvel with geometric patterns", "A whimsical garden with exotic flowers"];
  const objects = [{
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
  }, {
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
  }];
  const backgrounds = ["Alpine mountain range during golden hour with clear sky", "Urban cityscape with towering skyscrapers and busy streets", "Dense forest with shafts of sunlight filtering through leaves", "Minimalist interior with clean lines and natural materials", "Futuristic environment with glowing panels and sleek surfaces", "Classic library setting with wooden shelves and vintage furniture", "Tropical paradise with palm trees and turquoise water", "Dramatic landscape with rolling clouds and open fields", "Modern architectural space with glass and steel elements", "Enchanted garden with lush vegetation and magical atmosphere"];
  const lightingConditions = ["Golden hour sunrise lighting", "Dramatic studio lighting with key and fill", "Soft natural window lighting", "Moody evening twilight", "Bright midday sun with harsh shadows", "Warm candlelight ambiance", "Cool blue moonlight", "Colorful neon lighting", "Soft overcast daylight", "Dramatic rim lighting"];
  const lightingDirections = ["Side lighting from the left", "Backlighting creating silhouettes", "Top-down overhead lighting", "Front lighting with even illumination", "Three-quarter lighting for dimension", "Rim lighting from behind", "Window lighting from the right", "Multiple light sources", "Bounced soft lighting", "Directional spotlight"];
  const colorSchemes = ["Warm oranges and yellows contrasting with cool blues", "Monochromatic blues with subtle variations", "High contrast black and white with red accents", "Earthy browns and greens with gold highlights", "Vibrant purples and magentas", "Muted pastels with soft transitions", "Bold primary colors with strong saturation", "Vintage sepia tones with cream highlights", "Cool grays and silvers with blue undertones", "Rich jewel tones with deep shadows"];
  const moods = ["Peaceful, inspiring, and majestic", "Dynamic, energetic, and urban", "Mysterious, ethereal, and contemplative", "Cozy, intimate, and welcoming", "Futuristic, sleek, and innovative", "Nostalgic, scholarly, and timeless", "Relaxing, tropical, and carefree", "Dramatic, powerful, and emotional", "Clean, modern, and sophisticated", "Whimsical, magical, and enchanting"];
  const cameraAngles = ["Low angle looking up at the mountain", "High angle bird's eye view", "Eye level straight on perspective", "Dutch angle for dynamic tension", "Extreme close-up detail shot", "Wide establishing shot", "Medium shot with balanced framing", "Over-the-shoulder perspective", "Worm's eye view from below", "Aerial drone perspective"];
  const styleMediums = ["Photorealistic digital photography", "Oil painting with visible brushstrokes", "Watercolor with soft bleeding effects", "Digital art with clean vector lines", "Charcoal sketch with textural elements", "Acrylic painting with bold colors", "Vintage film photography", "Modern digital illustration", "Mixed media collage", "Hyperrealistic rendering"];
  const contexts = ["Nature photography showcasing the beauty of mountain landscapes", "Street photography capturing urban life and energy", "Fine art photography exploring light and shadow", "Portrait photography emphasizing human emotion", "Architectural photography highlighting design elements", "Travel photography documenting cultural experiences", "Commercial photography for advertising purposes", "Editorial photography telling a story", "Documentary photography capturing real moments", "Conceptual photography expressing abstract ideas"];
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
  resultsCount,
  setResultsCount,
  handleGenerate,
  hasGenerated,
  onUploadDocument,
  isGenerating,
  onSurpriseMe,
  onTranslatePrompt,
  onUploadImage,
  panelMode = 'generate',
  initialInput,
  onRemoveUpload,
  isProcessingFile
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
  resultsCount: number;
  setResultsCount: (count: number) => void;
  handleGenerate: () => void;
  hasGenerated: boolean;
  isGenerating: boolean;
  onSurpriseMe: () => void;
  onTranslatePrompt: () => void;
  onUploadImage: () => void;
  onUploadDocument: () => void;
  panelMode?: 'generate' | 'refine';
  initialInput?: {
    type: 'text' | 'image' | 'brief';
    data: string | {
      url: string;
      name?: string;
    };
  } | null;
  onRemoveUpload?: () => void;
  isProcessingFile?: boolean;
}) => {
  // Height constants to maintain exact same total height
  const baseEditorHeight = 180; // Increased from 120 to make prompt field bigger
  const tabsBarHeight = 40;
  const refinedContentHeight = baseEditorHeight - tabsBarHeight;
  const renderViewInput = () => {
    const contentStyle = {
      minHeight: `${refinedContentHeight}px`
    };
    if (!initialInput) {
      return <div className="p-4 flex items-center justify-center text-lab-text-muted bg-transparent" style={contentStyle}>
          <p className="text-sm italic">No original input</p>
        </div>;
    }

    // Handle different input types
    if (initialInput.type === 'image' && typeof initialInput.data === 'object') {
      const imageData = initialInput.data as {
        url: string;
        name?: string;
      };
      return <div className="p-4 bg-transparent flex flex-col gap-3" style={contentStyle}>
          <div className="text-sm text-lab-text-muted mb-2">Uploaded Image:</div>
          <div className="flex items-center gap-3">
            <img src={imageData.url} alt="Uploaded reference" className="w-16 h-16 object-cover rounded-lg border border-lab-border" />
            <div className="text-sm text-lab-text-secondary">
              {imageData.name || 'Uploaded Image'}
            </div>
          </div>
        </div>;
    }
    if (initialInput.type === 'brief' && typeof initialInput.data === 'string') {
      return <div className="p-4 bg-transparent flex flex-col gap-3" style={contentStyle}>
          <div className="text-sm text-lab-text-muted mb-2">Uploaded Brief:</div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-lab-interactive-hover rounded-lg border border-lab-border flex items-center justify-center">
              <FileText className="w-8 h-8 text-lab-text-secondary" />
            </div>
            <div className="text-sm text-lab-text-secondary">
              {initialInput.data}
            </div>
          </div>
        </div>;
    }

    // Handle text input
    if (initialInput.type === 'text' && typeof initialInput.data === 'string' && initialInput.data.trim()) {
      return <div className="resize-none bg-transparent border-none text-lab-text-muted p-4 whitespace-pre-wrap overflow-auto cursor-default select-text text-sm opacity-60" style={contentStyle}>
          {initialInput.data}
        </div>;
    }

    // Fallback for empty or invalid input
    return <div className="p-4 flex items-center justify-center text-lab-text-muted bg-transparent" style={contentStyle}>
        <p className="text-sm italic">No original input</p>
      </div>;
  };

  // Helper function to remove uploaded files
  const removeUpload = () => {
    onRemoveUpload?.();
  };
  return <div className="rounded-lg bg-background overflow-hidden relative">
      {panelMode === 'generate' && initialInput && (initialInput.type === 'image' || initialInput.type === 'brief') ? <div className="flex items-center gap-3 p-4 bg-transparent border-none text-lab-text-primary" style={{
      minHeight: `${baseEditorHeight}px`
    }}>
          {initialInput.type === 'image' && typeof initialInput.data === 'object' && <>
              <img src={initialInput.data.url} alt="Uploaded reference" className="w-16 h-16 object-cover rounded-md border border-border" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">
                  {initialInput.data.name || 'Uploaded Image'}
                </div>
                <div className="text-xs text-muted-foreground">Image uploaded</div>
              </div>
            </>}
          {initialInput.type === 'brief' && typeof initialInput.data === 'string' && <>
              <div className="w-16 h-16 bg-muted rounded-md border border-border flex items-center justify-center">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">
                  {initialInput.data}
                </div>
                <div className="text-xs text-muted-foreground">Document uploaded</div>
              </div>
            </>}
          <Button variant="ghost" size="sm" onClick={removeUpload} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </Button>
        </div> : <Textarea placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} onKeyDown={e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (value.trim()) {
          handleGenerate();
        }
      }
    }} className="resize-none bg-transparent border-none focus:ring-0 text-lab-text-primary placeholder:text-lab-text-muted p-4 pr-28 sm:pr-32 md:pr-36" style={{
      minHeight: `${baseEditorHeight}px`
    }} />}
      
      {/* Action buttons row */}
      <div className="absolute top-3 right-3 flex gap-2 items-center">
        {/* Upload buttons - only show in generate mode */}
        {panelMode === 'generate' && <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onUploadImage} disabled={isGenerating} variant="ghost" size="sm" className="w-8 h-8 rounded-full p-0 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#374151] bg-transparent transition-all duration-200">
                  <Image className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Formats: .jpg, .jpeg, .png, .webp</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload brief document</p>
              </TooltipContent>
            </Tooltip>
          </div>}
         
        {/* Surprise Me button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onSurpriseMe} disabled={isGenerating} variant="ghost" size="sm" className="w-8 h-8 rounded-full p-0 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#374151] bg-transparent transition-all duration-200">
              <Wand2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Surprise me with a random prompt</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
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
              <PopoverContent className="w-40 bg-lab-surface border-lab-border shadow-lg" align="start">
                <div className="space-y-1">
                  {aspectRatios.map(ratio => <button key={ratio.value} onClick={() => setAspectRatio(ratio.value)} className={cn("w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-3", aspectRatio === ratio.value ? "bg-lab-primary text-lab-primary-foreground" : "hover:bg-lab-interactive-hover text-lab-text-secondary")}>
                      <AspectRatioIcon ratio={ratio.value} />
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
                      {guidanceScale[0]}
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
                  <div className="mt-2 text-center text-sm text-lab-text-secondary">Guidance scale: {guidanceScale[0]}</div>
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

            {/* Results Count Button */}
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-lab-border hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {resultsCount} Image{resultsCount > 1 ? 's' : ''}
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of images to generate</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-48 bg-lab-surface border-lab-border shadow-lg">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-lab-text-primary mb-2">Image Count</div>
                  <div className="flex gap-2">
                    <Button variant={resultsCount === 1 ? "default" : "outline"} size="sm" onClick={() => setResultsCount(1)} className={resultsCount === 1 ? "bg-lab-primary text-lab-primary-foreground text-xs" : "bg-lab-surface border-lab-border hover:bg-lab-interactive-hover text-xs"}>
                      1 Image
                    </Button>
                    <Button variant={resultsCount === 4 ? "default" : "outline"} size="sm" onClick={() => setResultsCount(4)} className={resultsCount === 4 ? "bg-lab-primary text-lab-primary-foreground text-xs" : "bg-lab-surface border-lab-border hover:bg-lab-interactive-hover text-xs"}>
                      4 Images
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-1">
            {/* Show Structured Prompt Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onTranslatePrompt} disabled={isGenerating || panelMode !== 'refine' && !value.trim() || panelMode === 'refine' && !value.trim()} variant="link" size="sm" className="text-[#9CA3AF] hover:text-[#F3F4F6] h-auto p-0 font-normal text-sm underline-offset-4">
                  {panelMode === 'refine' ? 'Update Structured Prompt' : 'Examine Structured Prompt'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Convert prompt to structured format</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </div>;
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
  const [panelMode, setPanelMode] = useState<'generate' | 'refine'>('generate');
  const [originalPrompt, setOriginalPrompt] = useState(initialConfig?.mainPrompt || "");
  const [mainPrompt, setMainPrompt] = useState(initialConfig?.mainPrompt || "");
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const [lastGeneratedSeed, setLastGeneratedSeed] = useState("");
  const [aspectRatio, setAspectRatio] = useState(initialConfig?.aspectRatio || "1:1");
  const [steps, setSteps] = useState([initialConfig?.steps || 30]);
  const [guidanceScale, setGuidanceScale] = useState([initialConfig?.guidanceScale || 5]);
  const [seed, setSeed] = useState(initialConfig?.seed || "");
  const [resultsCount, setResultsCount] = useState(initialConfig?.resultsCount || 4);
  const [jsonData, setJsonData] = useState(initialConfig?.jsonConfig || JSON.stringify(defaultJSON, null, 2));
  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set());
  const [updatedFields, setUpdatedFields] = useState<Set<string>>(new Set());
  const [preservedFields, setPreservedFields] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [initialInput, setInitialInput] = useState<{
    type: 'text' | 'image' | 'brief';
    data: string | {
      url: string;
      name?: string;
    };
  } | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedBriefName, setUploadedBriefName] = useState<string | null>(null);
  // Update states when initialConfig changes (e.g., from history click)
  useEffect(() => {
    if (initialConfig) {
      setMainPrompt(initialConfig.mainPrompt || "");
      setAspectRatio(initialConfig.aspectRatio || "1:1");
      setSteps([initialConfig.steps || 30]);
      setGuidanceScale([initialConfig.guidanceScale || 5]);
      setSeed(initialConfig.seed || "");
      setResultsCount(initialConfig.resultsCount || 4);
      setJsonData(initialConfig.jsonConfig || JSON.stringify(defaultJSON, null, 2));

      // Handle refine mode activation from history
      if (initialConfig.panelMode === 'refine') {
        setPanelMode('refine');
        setOriginalPrompt(initialConfig.originalPrompt || initialConfig.mainPrompt || "");
        if (initialConfig.initialInput) {
          setInitialInput(initialConfig.initialInput);
        }
        if (initialConfig.lastGeneratedSeed) {
          setLastGeneratedSeed(initialConfig.lastGeneratedSeed);
        }
        // Clear refinement prompt to start fresh
        setRefinementPrompt("");
      }
    }
  }, [initialConfig]);

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
      setResultsCount(initialConfig.resultsCount || 4);
      if (initialConfig.jsonConfig) {
        setJsonData(initialConfig.jsonConfig);
      }
      if (initialConfig.lastGeneratedSeed) {
        setLastGeneratedSeed(initialConfig.lastGeneratedSeed);
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
  const randomPrompts = ["A social media ad for a new line of sustainable, handcrafted leather boots, with an adventurous and rugged feel.", "A product shot for an e-commerce store, showcasing a minimalist Scandinavian oak coffee table. The setting is a bright, airy living room with soft morning light and elegant props.", "Explore the concept of 'serenity in chaos'.", "A storyboard visualization for a key scene in a sci-fi film. A weary space explorer stands on a Martian ridge, looking out at a vast, alien canyon under two moons. The mood should be one of quiet solitude and awe.", "A photorealistic architectural rendering of a modern glass-and-steel cabin nestled in a snowy pine forest. The time is dusk, with warm light glowing from inside, contrasting with the cool blue of the snow.", "A hero shot for a recipe featuring a rustic, freshly baked apple pie. Key details: visible steam and a golden-brown crust.", "Objective: Test the model's compositional accuracy. Generate an image with a red cube on top of a blue sphere, to the left of a yellow pyramid, with the scene lit from the top right.", "Generate brand mascot concepts for 'Evergreen,' a new eco-friendly cleaning product company. The mascot must be friendly, trustworthy, and inspired by nature.", "An inspirational image for a hotel lobby design. The aesthetic is 'modern art deco,' featuring plush velvet armchairs, geometric brass fixtures, and a dark, moody color palette of deep greens and gold.", "Concept art of an ancient, moss-covered stone golem, glowing with faint magical runes. The golem is standing guard in an enchanted forest, with sunbeams filtering through the dense canopy and illuminating dust motes in the air."];

  // Refinement suggestions for when in refinement mode
  const refinementSuggestions = ["Shift the scene to a dramatic, moonlit night.", "Introduce a sense of tranquility and peace, with soft, diffused morning light.", "Add a mysterious, dense fog to the environment.", "Transform the visual style into a vibrant, impressionist oil painting.", "Re-render the image as a vintage, high-contrast black and white photograph.", "Change the composition to an extreme close-up, focusing on the main subject.", "Reframe this as a cinematic wide shot, revealing more of the surrounding environment.", "Inject a warm, autumnal color palette of reds, oranges, and browns.", "Shift the entire color scheme to be cool and monochromatic.", "Make it more futuristic and add subtle sci-fi elements."];

  // Handle translate prompt to structured prompt
  const handleTranslatePrompt = useCallback(() => {
    const currentPrompt = panelMode === 'refine' ? refinementPrompt : mainPrompt;
    if (!currentPrompt.trim()) return;

    // Capture the initial input if not already done
    if (panelMode === 'generate') {
      if (mainPrompt.trim()) {
        setInitialInput({
          type: 'text',
          data: mainPrompt
        });
        setOriginalPrompt(mainPrompt);
      }
      // Switch to refine mode by setting panelMode to 'refine'
      setPanelMode('refine');
    }

    // Clear previous highlights
    setUpdatedFields(new Set());
    setPreservedFields(new Set());

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

      // Mark preserved fields (fields that weren't updated)
      const allFields = new Set(['short_description', 'objects', 'background_setting', 'lighting.conditions', 'lighting.direction', 'lighting.shadows', 'aesthetics.composition', 'aesthetics.color_scheme', 'aesthetics.mood_atmosphere', 'photographic_characteristics.depth_of_field', 'photographic_characteristics.camera_angle', 'style_medium', 'context']);
      const preservedFields = new Set([...allFields].filter(field => !fieldsToUpdate.has(field) && !lockedFields.has(field)));
      setPreservedFields(preservedFields);

      // Hide loading state
      setIsProcessingFile(false);
    }, 1500); // 1.5 second delay to simulate processing
  }, [panelMode, refinementPrompt, mainPrompt, lockedFields]);

  // Handle surprise me functionality
  const handleSurpriseMe = useCallback(() => {
    if (panelMode === 'refine') {
      // In refinement mode - use refinement suggestions
      const randomRefinement = refinementSuggestions[Math.floor(Math.random() * refinementSuggestions.length)];
      setRefinementPrompt(randomRefinement);
    } else {
      // In initial mode - use full scene prompts
      const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
      setMainPrompt(randomPrompt);
    }
  }, [panelMode]);

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
    console.log('[ConfigurationPanel] handleGenerate', {
      mode: panelMode,
      hasGenerated,
      refinementPrompt
    });
    // Determine the effective seed to use for generation
    let effectiveSeed = seed;
    if (!seed.trim()) {
      // Generate a random seed if none is provided
      effectiveSeed = Math.floor(Math.random() * 1000000).toString();
      // Don't update the UI seed field - keep it clean/random for next generation
    }
    const wasFirstGeneration = !hasGenerated;
    if (wasFirstGeneration) {
      // Capture the initial input for the first generation
      if (mainPrompt.trim()) {
        setInitialInput({
          type: 'text',
          data: mainPrompt
        });
        setOriginalPrompt(mainPrompt);
      } else if (uploadedImageUrl) {
        setInitialInput({
          type: 'image',
          data: {
            url: uploadedImageUrl,
            name: 'uploaded-image'
          }
        });
      } else if (uploadedBriefName) {
        setInitialInput({
          type: 'brief',
          data: uploadedBriefName
        });
      }
    }
    setIsGenerating(true);
    setIsProcessingFile(true);
    onGeneratingChange?.(true);

    // Simulate generation and populate experiment spec with mock data
    setTimeout(() => {
      setIsGenerating(false);
      setIsProcessingFile(false);
      onGeneratingChange?.(false);

      // Set hasGenerated to true only after successful generation
      if (wasFirstGeneration) {
        setHasGenerated(true);
      }

      // Clear previous highlights on new generation
      setUpdatedFields(new Set());
      setPreservedFields(new Set());

      // Populate structured prompt with varied data based on the prompt
      const generatedJSON = generateVariedStructuredPrompt();
      const generatedJSONString = JSON.stringify(generatedJSON, null, 2);
      setJsonData(generatedJSONString);

      // After first generation, capture initial input but stay in generate mode
      if (wasFirstGeneration) {
        // Just capture the initial input for potential future refine mode
        const currentPrompt = panelMode === 'refine' ? refinementPrompt : mainPrompt;
        if (currentPrompt.trim()) {
          setInitialInput({
            type: 'text',
            data: currentPrompt
          });
          setOriginalPrompt(currentPrompt);
        }
        // Don't auto-switch to refine mode - user must manually click the Refine tab
      }

      // Mark some fields as updated, but exclude locked fields
      const potentialUpdatedFields = new Set(['short_description', 'background_setting', 'lighting.conditions', 'aesthetics.mood_atmosphere']);
      const fieldsToUpdate = new Set([...potentialUpdatedFields].filter(field => !lockedFields.has(field)));
      setUpdatedFields(fieldsToUpdate);

      // Mark preserved fields (fields that weren't updated)
      const allFields = new Set(['short_description', 'objects', 'background_setting', 'lighting.conditions', 'lighting.direction', 'lighting.shadows', 'aesthetics.composition', 'aesthetics.color_scheme', 'aesthetics.mood_atmosphere', 'photographic_characteristics.depth_of_field', 'photographic_characteristics.camera_angle', 'style_medium', 'context']);
      const preservedFields = new Set([...allFields].filter(field => !fieldsToUpdate.has(field) && !lockedFields.has(field)));
      setPreservedFields(preservedFields);

      // Generate concept-based mock images with correct aspect ratio
      const dimensions = getImageDimensions(aspectRatio);
      const currentPrompt = panelMode === 'refine' ? refinementPrompt : mainPrompt;
      const conceptImageId = getConceptImageId(currentPrompt);
      const mockImages = Array(resultsCount).fill(`https://picsum.photos/id/${conceptImageId}/${dimensions.width}/${dimensions.height}`);

      // Notify parent component about generated images
      const config = {
        mainPrompt,
        refinementPrompt,
        aspectRatio,
        steps: steps[0],
        seed: effectiveSeed,
        // Use the effective seed (either user-provided or generated)
        lastGeneratedSeed: effectiveSeed,
        resultsCount,
        jsonConfig: generatedJSONString,
        // Use the actual generated JSON string
        prompt: panelMode === 'refine' ? refinementPrompt : mainPrompt,
        panelMode
      };
      if (onImagesGenerated) {
        onImagesGenerated(mockImages, config);
      }
      // Do not clear refinement prompt in refine mode
      if (hasGenerated && panelMode === 'generate') {
        console.log('[ConfigurationPanel] Clearing refinement prompt after Generate run');
        setRefinementPrompt("");
      }
    }, 3000);
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

    // Set initial input but stay in generate mode
    setInitialInput({
      type: 'image',
      data: {
        url: imageUrl,
        name: file.name
      }
    });

    // Stay in generate mode instead of switching to refine

    // Simulate processing the image and extracting experiment spec
    setIsProcessingFile(true);
    setTimeout(() => {
      setIsProcessingFile(false);

      // Populate structured prompt with varied data
      const variedData = generateVariedStructuredPrompt();
      const newJsonData = {
        ...variedData,
        short_description: `Analysis of uploaded image: ${file.name}`,
        context: "Image analysis and experiment spec extraction",
        style_medium: "Based on uploaded reference image"
      };
      setJsonData(JSON.stringify(newJsonData, null, 2));

      // Mark fields as updated
      const updatedFieldsSet = new Set(['short_description', 'context', 'style_medium']);
      setUpdatedFields(updatedFieldsSet);

      // Mark all other fields as preserved
      const preservedFieldsSet = markPreservedFields(newJsonData, updatedFieldsSet, lockedFields);
      setPreservedFields(preservedFieldsSet);
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

    // Set initial input but stay in generate mode
    setInitialInput({
      type: 'brief',
      data: file.name
    });

    // Stay in generate mode instead of switching to refine

    // Simulate processing the brief and extracting structured prompt
    setIsProcessingFile(true);
    setTimeout(() => {
      setIsProcessingFile(false);

      // Populate structured prompt with varied data
      const variedData = generateVariedStructuredPrompt();
      const newJsonData = {
        ...variedData,
        short_description: `Structured prompt extracted from brief: ${file.name}`,
        context: "Brief-based structured prompt extraction",
        artistic_style: "Style defined in uploaded brief document"
      };
      setJsonData(JSON.stringify(newJsonData, null, 2));

      // Mark fields as updated
      const updatedFieldsSet = new Set(['short_description', 'context', 'artistic_style']);
      setUpdatedFields(updatedFieldsSet);

      // Mark all other fields as preserved
      const preservedFieldsSet = markPreservedFields(newJsonData, updatedFieldsSet, lockedFields);
      setPreservedFields(preservedFieldsSet);
    }, 2000);
  };

  // Helper function to remove uploaded files
  const handleRemoveUpload = () => {
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    setUploadedImageUrl(null);
    setUploadedBriefName(null);
    setInitialInput(null);
  };
  return <div className="w-full h-full bg-lab-surface rounded-lg shadow-lg flex flex-col overflow-hidden">
      {/* Hidden file inputs */}
      <input ref={imageInputRef} type="file" accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.svg" onChange={handleImageUpload} className="hidden" />
      <input ref={briefInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.md,.rtf" onChange={handleDocumentUpload} className="hidden" />

      {/* Mode Tabs - affects whole panel */}
      <div className="flex-shrink-0 bg-lab-surface border-b border-lab-border">
        <Tabs value={panelMode} onValueChange={value => {
        const newMode = value as 'generate' | 'refine';
        setPanelMode(newMode);

        // When switching to refine mode, clear the refinement prompt
        if (newMode === 'refine' && panelMode === 'generate') {
          console.log('[ConfigurationPanel] Switched to Refine tab: clearing refinementPrompt');
          setRefinementPrompt(""); // Clear the prompt box only
        }

        // When switching back to generate mode, clear all highlights
        if (newMode === 'generate' && panelMode === 'refine') {
          setUpdatedFields(new Set());
          setPreservedFields(new Set());
        }

        // Seed management based on mode changes
        if (newMode === 'refine' && lastGeneratedSeed && !seed.trim()) {
          // When switching to refine mode after generation, preserve the last generated seed
          setSeed(lastGeneratedSeed);
        } else if (newMode === 'generate' && !seed.trim()) {
          // When switching back to generate mode, clear seed to keep it random (unless user defined)
          setSeed('');
        }
      }} className="w-full">
          <TabsList className="w-full justify-start px-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger 
                  value="generate" 
                  disabled={!hasGenerated && panelMode === 'refine'}
                >
                  <Wand2 className="h-4 w-4" />
                  Generate
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate a new image</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger 
                  value="refine" 
                  disabled={!hasGenerated}
                >
                  <Sliders className="h-4 w-4" />
                  Refine
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refine your generated results</p>
              </TooltipContent>
            </Tooltip>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0 p-6 gap-4">
        {/* Prompt Section - Fixed height */}
        <div className="flex-shrink-0" style={{
        height: '240px'
      }}>
          <PromptComponent value={panelMode === 'refine' ? refinementPrompt : mainPrompt} onChange={panelMode === 'refine' ? setRefinementPrompt : setMainPrompt} placeholder={panelMode === 'refine' ? "Refine with new instructions..." : "Describe your objective, upload an image for inspiration, or combine both."} aspectRatio={aspectRatio} aspectRatios={aspectRatios} setAspectRatio={setAspectRatio} steps={steps} setSteps={setSteps} guidanceScale={guidanceScale} setGuidanceScale={setGuidanceScale} seed={seed} setSeed={setSeed} resultsCount={resultsCount} setResultsCount={setResultsCount} handleGenerate={handleGenerate} hasGenerated={hasGenerated} isGenerating={isGenerating} onSurpriseMe={handleSurpriseMe} onTranslatePrompt={handleTranslatePrompt} onUploadImage={handleUploadImage} onUploadDocument={handleUploadDocument} panelMode={panelMode} initialInput={initialInput} onRemoveUpload={handleRemoveUpload} isProcessingFile={isProcessingFile} />
        </div>

        {/* Structured Prompt Editor - Flexible height that grows */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full">
            <StructuredPromptEditor value={jsonData} onChange={setJsonData} isGenerating={isProcessingFile || isGenerating} lockedFields={lockedFields} onFieldLock={handleFieldLock} onBatchFieldLock={handleBatchFieldLock} onUploadImage={handleUploadImage} onUploadDocument={handleUploadDocument} updatedFields={updatedFields} preservedFields={preservedFields} forceStructuredView={panelMode === 'refine' || isGenerating || isProcessingFile} readOnly={true} onRefineClick={() => {
            setPanelMode('refine');
            // Clear the refinement prompt when switching to refine mode
            setRefinementPrompt("");
            // When switching to refine mode after generation, preserve the last generated seed
            if (lastGeneratedSeed && !seed.trim()) {
              setSeed(lastGeneratedSeed);
            }
          }} currentMode={panelMode} />
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex-shrink-0 pt-4 border-t border-lab-border">
          <div className="flex justify-center">
            <Button onClick={handleGenerate} disabled={isGenerating || isProcessingFile || !hasGenerated && !mainPrompt.trim() && !hasStructuredPromptContent()} className="w-full bg-lab-primary hover:bg-lab-primary/90 text-lab-primary-foreground px-6 py-3 rounded-md font-medium transition-colors">
              {isGenerating ? "Generating..." : panelMode === 'refine' ? "Refine" : "Generate"}
            </Button>
          </div>
        </div>
      </div>
    </div>;
};

// Helper function to mark all preserved fields comprehensively
function markPreservedFields(jsonObj: any, updatedFieldsSet: Set<string>, lockedFieldsSet: Set<string>): Set<string> {
  const preserved = new Set<string>();
  const getAllPaths = (obj: any, basePath: string = ''): string[] => {
    const paths: string[] = [];
    const traverse = (current: any, currentPath: string) => {
      if (currentPath) {
        paths.push(currentPath);
      }
      if (typeof current === 'object' && current !== null) {
        if (Array.isArray(current)) {
          current.forEach((item, index) => {
            const itemPath = currentPath ? `${currentPath}[${index}]` : `[${index}]`;
            traverse(item, itemPath);
          });
        } else {
          Object.entries(current).forEach(([key, value]) => {
            const keyPath = currentPath ? `${currentPath}.${key}` : key;
            traverse(value, keyPath);
          });
        }
      }
    };
    traverse(obj, basePath);
    return paths;
  };
  const isPathPreserved = (path: string): boolean => {
    // If this exact path was updated, it's not preserved
    if (updatedFieldsSet.has(path)) {
      return false;
    }

    // Check if any child of this path was updated
    const allPaths = getAllPaths(jsonObj);
    const hasUpdatedChildren = allPaths.some(childPath => childPath.startsWith(path + '.') || childPath.startsWith(path + '[') || path === '' && updatedFieldsSet.has(childPath));
    return !hasUpdatedChildren;
  };

  // Get all possible paths in the JSON structure
  const allPaths = getAllPaths(jsonObj);

  // Add the root level fields
  if (typeof jsonObj === 'object' && jsonObj !== null && !Array.isArray(jsonObj)) {
    Object.keys(jsonObj).forEach(key => {
      allPaths.unshift(key);
    });
  }

  // Mark each path as preserved if it and its children weren't updated
  allPaths.forEach(path => {
    if (isPathPreserved(path)) {
      preserved.add(path);
    }
  });
  return preserved;
}
;
export default ConfigurationPanel;