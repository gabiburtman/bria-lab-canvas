import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ParameterEditor from "./ParameterEditor";
import { 
  ArrowRight, 
  Upload, 
  FileText, 
  Copy, 
  Lock, 
  Unlock, 
  Sliders, 
  RectangleHorizontal 
} from "lucide-react";
import { cn } from "@/lib/utils";

const defaultJSON = {
  "short_description": "",
  "objects": [
    {
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
    }
  ],
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
  "text_render": [
    {
      "text": "",
      "location": "",
      "size": "",
      "color": "",
      "font": "",
      "appearance_details": ""
    }
  ],
  "context": "",
  "artistic_style": ""
};

const mockFilledJSON = {
  "short_description": "A serene mountain landscape at sunrise with vibrant colors",
  "objects": [
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
    }
  ],
  "background_setting": "Alpine mountain range during golden hour with clear sky",
  "lighting": {
    "conditions": "Golden hour sunrise lighting",
    "direction": "Side lighting from the left",
    "shadows": "Long dramatic shadows cast to the right"
  },
  "aesthetics": {
    "composition": "Rule of thirds with mountain peak in upper third",
    "color_scheme": "Warm oranges and yellows contrasting with cool blues",
    "mood_atmosphere": "Peaceful, inspiring, and majestic",
    "preference_score": "9.2",
    "aesthetic_score": "8.8"
  },
  "photographic_characteristics": {
    "depth_of_field": "Deep focus with sharp foreground and background",
    "focus": "Sharp focus throughout the scene",
    "camera_angle": "Low angle looking up at the mountain",
    "lens_focal_length": "35mm wide angle"
  },
  "style_medium": "Photorealistic digital photography",
  "text_render": [
    {
      "text": "ALPINE SUNRISE",
      "location": "Bottom left corner",
      "size": "Medium, 24pt font",
      "color": "White with subtle shadow",
      "font": "Modern sans-serif",
      "appearance_details": "Clean, minimalist typography"
    }
  ],
  "context": "Nature photography showcasing the beauty of mountain landscapes",
  "artistic_style": "Contemporary landscape photography with emphasis on natural lighting"
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
  seed,
  setSeed,
  handleGenerate,
  hasGenerated,
  isGenerating
}: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder: string;
  aspectRatio: string;
  aspectRatios: Array<{value: string, label: string}>;
  setAspectRatio: (ratio: string) => void;
  steps: number[];
  setSteps: (steps: number[]) => void;
  seed: string;
  setSeed: (seed: string) => void;
  handleGenerate: () => void;
  hasGenerated: boolean;
  isGenerating: boolean;
}) => {
  return (
    <div className="border border-lab-border rounded-lg bg-lab-surface overflow-hidden">
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] resize-none bg-transparent border-none focus:ring-0 text-lab-text-primary placeholder:text-lab-text-muted p-4"
      />
      
      {/* Controls Bar */}
      <TooltipProvider>
        <div className="flex items-center justify-between p-3 border-t border-lab-border bg-lab-surface">
          <div className="flex items-center gap-2">
            {/* Aspect Ratio Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-lab-border hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary gap-2"
                    >
                      <RectangleHorizontal className="w-4 h-4" />
                      {aspectRatio}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-32 bg-lab-surface border-lab-border shadow-lg" align="start">
                    <div className="space-y-1">
                      {aspectRatios.map((ratio) => (
                        <button
                          key={ratio.value}
                          onClick={() => setAspectRatio(ratio.value)}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                            aspectRatio === ratio.value 
                              ? "bg-lab-primary text-lab-primary-foreground" 
                              : "hover:bg-lab-interactive-hover text-lab-text-secondary"
                          )}
                        >
                          {ratio.label}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change aspect ratio</p>
              </TooltipContent>
            </Tooltip>

            {/* Advanced Settings Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost"
                      size="sm" 
                      className="w-8 h-8 rounded-full p-0 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#374151] bg-transparent transition-all duration-200"
                    >
                      <Sliders className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-lab-surface border-lab-border shadow-lg">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-lab-text-primary mb-2 block">
                          Steps: {steps[0]}
                        </Label>
                        <Slider
                          value={steps}
                          onValueChange={setSteps}
                          max={50}
                          min={20}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-lab-text-primary mb-2 block">
                          Seed
                        </Label>
                        <Input
                          placeholder="Random"
                          value={seed}
                          onChange={(e) => setSeed(e.target.value)}
                          className="bg-lab-surface border-lab-border focus:border-lab-border-focus"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent>
                <p>Advanced settings</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate}
            disabled={(!value.trim() && !hasGenerated) || isGenerating}
            size="sm"
            className="bg-lab-primary hover:bg-lab-primary-hover text-lab-primary-foreground disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </TooltipProvider>
    </div>
  );
};

const ConfigurationPanel = ({ onImagesGenerated }: { onImagesGenerated?: (images: string[]) => void }) => {
  const [hasGenerated, setHasGenerated] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [mainPrompt, setMainPrompt] = useState("");
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [steps, setSteps] = useState([30]);
  const [seed, setSeed] = useState("");
  const [jsonData, setJsonData] = useState(JSON.stringify(defaultJSON, null, 2));
  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set());
  const [updatedFields, setUpdatedFields] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  
  // File input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const briefInputRef = useRef<HTMLInputElement>(null);

  const aspectRatios = [
    { value: "9:16", label: "9:16" },
    { value: "2:3", label: "2:3" },
    { value: "3:4", label: "3:4" },
    { value: "1:1", label: "1:1" },
    { value: "4:3", label: "4:3" },
    { value: "3:2", label: "3:2" },
    { value: "16:9", label: "16:9" },
  ];

  const handleGenerate = () => {
    if (!hasGenerated && mainPrompt.trim()) {
      setOriginalPrompt(mainPrompt);
      setHasGenerated(true);
    }
    setIsGenerating(true);
    
    // Simulate generation and populate parameters with mock data
    setTimeout(() => {
      setIsGenerating(false);
      
      // Populate parameters with mock data based on the prompt
      setJsonData(JSON.stringify(mockFilledJSON, null, 2));
      
      // Mark some fields as updated, but exclude locked fields
      const potentialUpdatedFields = new Set([
        'short_description', 
        'background_setting', 
        'lighting.conditions',
        'aesthetics.mood_atmosphere'
      ]);
      
      const fieldsToUpdate = new Set([...potentialUpdatedFields].filter(field => !lockedFields.has(field)));
      setUpdatedFields(fieldsToUpdate);
      
      // Generate mock images
      const mockImages = [
        "https://picsum.photos/512/512?random=1",
        "https://picsum.photos/512/512?random=2", 
        "https://picsum.photos/512/512?random=3",
        "https://picsum.photos/512/512?random=4"
      ];
      
      // Notify parent component about generated images
      if (onImagesGenerated) {
        onImagesGenerated(mockImages);
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
    
    // Clear the results panel
    if (onImagesGenerated) {
      onImagesGenerated([]);
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

  const handleUploadImage = () => {
    // Trigger file input for images
    imageInputRef.current?.click();
  };

  const handleUploadDocument = () => {
    // Trigger file input for documents
    briefInputRef.current?.click();
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Move to refine state if we're in initial state
      if (!hasGenerated) {
        setOriginalPrompt(`Uploaded image: ${file.name}`);
        setHasGenerated(true);
      }
      
      // Simulate processing the image and extracting parameters
      setIsGenerating(true);
      setTimeout(() => {
        const imageBasedJSON = {
          ...mockFilledJSON,
          short_description: `Analysis of uploaded image: ${file.name}`,
          context: "Image analysis and parameter extraction",
          style_medium: "Based on uploaded reference image"
        };
        
        setJsonData(JSON.stringify(imageBasedJSON, null, 2));
        
        // Mark fields as updated, but exclude locked fields
        const potentialUpdatedFields = new Set(['short_description', 'context', 'style_medium']);
        const fieldsToUpdate = new Set([...potentialUpdatedFields].filter(field => !lockedFields.has(field)));
        setUpdatedFields(fieldsToUpdate);
        setIsGenerating(false);
      }, 2000);
    }
    // Reset the input
    event.target.value = '';
  };

  const handleBriefFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Move to refine state if we're in initial state
      if (!hasGenerated) {
        setOriginalPrompt(`Uploaded brief: ${file.name}`);
        setHasGenerated(true);
      }
      
      // Simulate processing the brief and extracting parameters
      setIsGenerating(true);
      setTimeout(() => {
        const briefBasedJSON = {
          ...mockFilledJSON,
          short_description: `Parameters extracted from brief: ${file.name}`,
          context: "Brief-based parameter extraction",
          artistic_style: "Style defined in uploaded brief document"
        };
        
        setJsonData(JSON.stringify(briefBasedJSON, null, 2));
        
        // Mark fields as updated, but exclude locked fields
        const potentialUpdatedFields = new Set(['short_description', 'context', 'artistic_style']);
        const fieldsToUpdate = new Set([...potentialUpdatedFields].filter(field => !lockedFields.has(field)));
        setUpdatedFields(fieldsToUpdate);
        setIsGenerating(false);
      }, 2000);
    }
    // Reset the input
    event.target.value = '';
  };

  // Clear updated fields highlight after 3 seconds
  useEffect(() => {
    if (updatedFields.size > 0) {
      const timer = setTimeout(() => {
        setUpdatedFields(new Set());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updatedFields]);

  return (
    <div className="w-full h-full bg-lab-surface rounded-lg shadow-lg flex flex-col">
      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageFileChange}
      />
      <input
        ref={briefInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        style={{ display: 'none' }}
        onChange={handleBriefFileChange}
      />
      
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Prompt Area */}
        <div className="space-y-4 mb-4">
          {hasGenerated && (
            <div>
              <h3 className="text-sm font-medium text-lab-text-secondary mb-2">Original Prompt</h3>
              <div className="p-3 bg-lab-interactive-hover border border-lab-border rounded-lg text-sm text-lab-text-primary">
                {originalPrompt}
              </div>
            </div>
          )}
          
          <PromptComponent
            value={hasGenerated ? refinementPrompt : mainPrompt}
            onChange={hasGenerated ? setRefinementPrompt : setMainPrompt}
            placeholder={hasGenerated ? "Refine with new instructions..." : "Describe the image you want to generate..."}
            aspectRatio={aspectRatio}
            aspectRatios={aspectRatios}
            setAspectRatio={setAspectRatio}
            steps={steps}
            setSteps={setSteps}
            seed={seed}
            setSeed={setSeed}
            handleGenerate={handleGenerate}
            hasGenerated={hasGenerated}
            isGenerating={isGenerating}
          />
        </div>

        {/* Parameter Editor */}
        <ParameterEditor
          value={jsonData}
          onChange={setJsonData}
          isGenerating={isGenerating}
          lockedFields={lockedFields}
          onFieldLock={handleFieldLock}
          onUploadImage={handleUploadImage}
          onUploadDocument={handleUploadDocument}
          updatedFields={updatedFields}
        />
      </div>

      {/* Action Buttons - Sticky Bottom */}
      <div className="sticky bottom-0 p-6 pt-3 bg-lab-surface border-t border-lab-border rounded-b-lg">
        <div className="flex gap-3">
          <Button 
            onClick={handleGenerate}
            disabled={(!mainPrompt.trim() && !hasGenerated && !refinementPrompt.trim()) || isGenerating}
            className="flex-1 bg-lab-primary hover:bg-lab-primary-hover text-lab-primary-foreground font-medium hover:shadow-lab-glow-primary transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              'Generate'
            )}
          </Button>
          <Button 
            variant="outline"
            onClick={handleStartOver}
            className="flex-1 border-lab-border hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary"
          >
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;