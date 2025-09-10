import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Upload, FileText, Copy, Lock, Unlock } from "lucide-react";
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

const ConfigurationPanel = () => {
  const [hasGenerated, setHasGenerated] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [mainPrompt, setMainPrompt] = useState("");
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [steps, setSteps] = useState([30]);
  const [seed, setSeed] = useState("");
  const [jsonData, setJsonData] = useState(JSON.stringify(defaultJSON, null, 2));
  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  const aspectRatios = [
    { value: "1:1", label: "1:1 (Square)" },
    { value: "3:4", label: "3:4 (Portrait)" },
    { value: "4:3", label: "4:3 (Landscape)" },
    { value: "4:5", label: "4:5 (Portrait)" },
    { value: "5:4", label: "5:4 (Landscape)" },
    { value: "2:3", label: "2:3 (Portrait)" },
    { value: "3:2", label: "3:2 (Landscape)" },
    { value: "9:16", label: "9:16 (Vertical)" },
    { value: "16:9", label: "16:9 (Horizontal)" },
  ];

  const handleGenerate = () => {
    if (!hasGenerated && mainPrompt.trim()) {
      setOriginalPrompt(mainPrompt);
      setHasGenerated(true);
    }
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      setRefinementPrompt("");
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
    setIsGenerating(false);
  };

  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(jsonData);
  };

  return (
    <div className="w-full h-full bg-lab-surface rounded-lg shadow-lab-glow-subtle flex flex-col">
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Prompt Area */}
        <div className="mb-6">
          {!hasGenerated ? (
            <>
              <Label htmlFor="main-prompt" className="text-sm font-medium text-lab-text-primary mb-2 block">
                Main Prompt
              </Label>
              <Textarea
                id="main-prompt"
                placeholder="Enter your prompt here..."
                value={mainPrompt}
                onChange={(e) => setMainPrompt(e.target.value)}
                className="min-h-[120px] resize-none bg-lab-surface border-lab-border focus:border-lab-border-focus text-lab-text-primary placeholder:text-lab-text-muted"
              />
            </>
          ) : (
            <>
              <Label className="text-sm font-medium text-lab-text-primary mb-2 block">
                Original Prompt
              </Label>
              <div className="p-3 bg-lab-interactive-hover border border-lab-border rounded-lab text-sm text-lab-text-secondary mb-4">
                {originalPrompt}
              </div>
              
              <Label htmlFor="refinement-prompt" className="text-sm font-medium text-lab-text-primary mb-2 block">
                Refinement Prompt
              </Label>
              <Textarea
                id="refinement-prompt"
                placeholder="Refine with new instructions..."
                value={refinementPrompt}
                onChange={(e) => setRefinementPrompt(e.target.value)}
                className="min-h-[80px] resize-none bg-lab-surface border-lab-border focus:border-lab-border-focus text-lab-text-primary placeholder:text-lab-text-muted"
              />
            </>
          )}
        </div>

        {/* Parameter Controls */}
        <div className="mb-6 space-y-4">
          <div>
            <Label className="text-sm font-medium text-lab-text-primary mb-2 block">
              Aspect Ratio
            </Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger className="bg-lab-surface border-lab-border focus:border-lab-border-focus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-lab-surface border-lab-border shadow-lab-glow-subtle">
                {aspectRatios.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value} className="hover:bg-lab-interactive-hover">
                    {ratio.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-lab-text-secondary hover:text-lab-text-primary hover:bg-lab-interactive-hover"
              >
                <MoreHorizontal className="w-4 h-4 mr-2" />
                Advanced Options
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-lab-surface border-lab-border shadow-lab-glow-subtle">
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
        </div>

        {/* JSON Editor */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium text-lab-text-primary">
              Parameters
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyJsonToClipboard}
              className="text-lab-text-secondary hover:text-lab-text-primary hover:bg-lab-interactive-hover p-1"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          
          <div className={cn(
            "relative bg-lab-code-bg rounded-lab border border-lab-code-border overflow-hidden",
            isGenerating && "opacity-50 pointer-events-none"
          )}>
            <Textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="w-full h-96 font-mono text-sm bg-transparent text-lab-code-text border-none resize-none focus:ring-0 p-4 leading-6"
              style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
            />
            {isGenerating && (
              <div className="absolute inset-0 bg-lab-code-bg/80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lab-primary"></div>
              </div>
            )}
          </div>
        </div>

        {/* Parameter Input from File */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-lab-text-primary mb-2 block">
            Import Parameters
          </Label>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-lab-border hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary"
            >
              <Upload className="w-4 h-4 mr-2" />
              Image
            </Button>
            <span className="text-lab-text-muted text-sm">or</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-lab-border hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary"
            >
              <FileText className="w-4 h-4 mr-2" />
              Document
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons - Sticky Bottom */}
      <div className="p-6 bg-lab-surface border-t border-lab-border rounded-b-lg">
        <div className="flex gap-3">
          <Button 
            onClick={handleGenerate}
            disabled={(!mainPrompt.trim() && !hasGenerated) || isGenerating}
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
            className="border-lab-border hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary"
          >
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;