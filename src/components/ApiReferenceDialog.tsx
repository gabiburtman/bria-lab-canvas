import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, ExternalLink, Code, Wand2, RotateCcw, Edit } from "lucide-react";
import { FaPython, FaJs, FaNodeJs, FaJava, FaPhp, FaGolang } from "react-icons/fa6";
import { SiCurl } from "react-icons/si";
import { Code2 } from "lucide-react";
import { toast } from "sonner";

interface ApiReferenceDialogProps {
  trigger: React.ReactNode;
  structuredPromptUrl?: string;
  seed?: string;
}

type ExampleType = 'generate' | 'regenerate' | 'refine';

interface LanguageConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ExampleConfig {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const languages: Record<string, LanguageConfig> = {
  python: {
    name: "Python",
    icon: FaPython
  },
  javascript: {
    name: "JavaScript",
    icon: FaJs
  },
  nodejs: {
    name: "Node.js",
    icon: FaNodeJs
  },
  curl: {
    name: "cURL",
    icon: SiCurl
  },
  java: {
    name: "Java",
    icon: FaJava
  },
  csharp: {
    name: "C#",
    icon: Code2
  },
  php: {
    name: "PHP",
    icon: FaPhp
  },
  go: {
    name: "Go",
    icon: FaGolang
  }
};

const examples: Record<ExampleType, ExampleConfig> = {
  generate: {
    name: "Generate another image",
    description: "Create a new image with a text prompt",
    icon: Wand2
  },
  regenerate: {
    name: "Regenerate this image",
    description: "Recreate the exact same image using structured prompt and seed",
    icon: RotateCcw
  },
  refine: {
    name: "Refine this image",
    description: "Create a new version by refining the structured prompt",
    icon: Edit
  }
};

const getCodeExample = (language: string, example: ExampleType, structuredPromptUrl?: string, seed?: string): string => {
  const apiUrl = "https://engine.prod.bria-api.com/v2/image/generate";
  const defaultSeed = seed || "123456789";
  const defaultStructuredPrompt = structuredPromptUrl || "https://cdn.bria.ai/prompts/your-previous-prompt.json";

  switch (language) {
    case 'python':
      switch (example) {
        case 'generate':
          return `import requests

url = "${apiUrl}"

payload = {
    "prompt": "A photorealistic product shot of a minimalist oak coffee table in a bright, airy living room.",
    "aspect_ratio": "16:9"
}

headers = {
    "Content-Type": "application/json",
    "api_token": "YOUR_API_TOKEN"
}

response = requests.post(url, json=payload, headers=headers)

data = response.json()
print(data)`;

        case 'regenerate':
          return `import requests

url = "${apiUrl}"

payload = {
    "structured_prompt": "${defaultStructuredPrompt}",
    "seed": ${defaultSeed}
}

headers = {
    "Content-Type": "application/json",
    "api_token": "YOUR_API_TOKEN"
}

response = requests.post(url, json=payload, headers=headers)

data = response.json()
print(data)`;

        case 'refine':
          return `import requests

url = "${apiUrl}"

payload = {
    "prompt": "Make the aesthetics more minimalist and change the style to impressionistic.",
    "structured_prompt": "${defaultStructuredPrompt}",
    "seed": ${defaultSeed}
}

headers = {
    "Content-Type": "application/json",
    "api_token": "YOUR_API_TOKEN"
}

response = requests.post(url, json=payload, headers=headers)

data = response.json()
print(data)`;
      }
      break;

    case 'javascript':
      switch (example) {
        case 'generate':
          return `const generateImage = async () => {
  const response = await fetch('${apiUrl}', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api_token': 'YOUR_API_TOKEN'
    },
    body: JSON.stringify({
      prompt: 'A photorealistic product shot of a minimalist oak coffee table in a bright, airy living room.',
      aspect_ratio: '16:9'
    })
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  const data = await response.json();
  console.log(data);
  return data;
};

generateImage().catch(console.error);`;

        case 'regenerate':
          return `const regenerateImage = async () => {
  const response = await fetch('${apiUrl}', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api_token': 'YOUR_API_TOKEN'
    },
    body: JSON.stringify({
      structured_prompt: '${defaultStructuredPrompt}',
      seed: ${defaultSeed}
    })
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  const data = await response.json();
  console.log(data);
  return data;
};

regenerateImage().catch(console.error);`;

        case 'refine':
          return `const refineImage = async () => {
  const response = await fetch('${apiUrl}', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api_token': 'YOUR_API_TOKEN'
    },
    body: JSON.stringify({
      prompt: 'Make the aesthetics more minimalist and change the style to impressionistic.',
      structured_prompt: '${defaultStructuredPrompt}',
      seed: ${defaultSeed}
    })
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  const data = await response.json();
  console.log(data);
  return data;
};

refineImage().catch(console.error);`;
      }
      break;

    case 'curl':
      switch (example) {
        case 'generate':
          return `curl -X POST "${apiUrl}" \\
  -H "Content-Type: application/json" \\
  -H "api_token: YOUR_API_TOKEN" \\
  -d '{
    "prompt": "A photorealistic product shot of a minimalist oak coffee table in a bright, airy living room.",
    "aspect_ratio": "16:9"
  }'`;

        case 'regenerate':
          return `curl -X POST "${apiUrl}" \\
  -H "Content-Type: application/json" \\
  -H "api_token: YOUR_API_TOKEN" \\
  -d '{
    "structured_prompt": "${defaultStructuredPrompt}",
    "seed": ${defaultSeed}
  }'`;

        case 'refine':
          return `curl -X POST "${apiUrl}" \\
  -H "Content-Type: application/json" \\
  -H "api_token: YOUR_API_TOKEN" \\
  -d '{
    "prompt": "Make the aesthetics more minimalist and change the style to impressionistic.",
    "structured_prompt": "${defaultStructuredPrompt}",
    "seed": ${defaultSeed}
  }'`;
      }
      break;

    default:
      return `# ${example} example for ${language}
# Implementation coming soon

url = "${apiUrl}"
api_token = "YOUR_API_TOKEN"

# This example will be available soon for ${language}`;
  }
  
  return '';
};

export const ApiReferenceDialog = ({ trigger, structuredPromptUrl, seed }: ApiReferenceDialogProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [selectedExample, setSelectedExample] = useState<ExampleType>("generate");
  const [copied, setCopied] = useState(false);

  const currentCode = getCodeExample(selectedLanguage, selectedExample, structuredPromptUrl, seed);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const currentLanguage = languages[selectedLanguage];
  const currentExample = examples[selectedExample];
  const IconComp = currentLanguage.icon;
  const ExampleIcon = currentExample.icon;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[85vh] p-0 gap-0">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 border-r border-border bg-muted/30">
            <div className="p-6 border-b border-border">
              <DialogTitle className="text-xl font-semibold mb-3">API Reference</DialogTitle>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 font-mono text-xs px-2 py-1">
                  POST
                </Badge>
                <code className="text-sm text-muted-foreground font-mono">/v2/image/generate</code>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                Examples
              </h3>
              <div className="space-y-2">
                {Object.entries(examples).map(([key, example]) => {
                  const Icon = example.icon;
                  const isSelected = selectedExample === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedExample(key as ExampleType)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        isSelected 
                          ? 'bg-primary/10 border-primary/30 text-primary shadow-sm' 
                          : 'bg-background border-border hover:bg-muted/50 hover:border-muted-foreground/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm mb-1">{example.name}</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            {example.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Code Block Header */}
            <div className="p-4 border-b border-border bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Code Example</span>
                  <div className="w-px h-4 bg-border"></div>
                  <span className="text-xs text-muted-foreground capitalize">{examples[selectedExample].name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-36 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(languages).map(([key, lang]) => {
                        const Icon = lang.icon;
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {lang.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-9 px-3"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Code Content */}
            <div className="flex-1 bg-muted/10 rounded-none overflow-auto">
              <pre className="p-6 text-sm leading-relaxed font-mono">
                <code className={`language-${selectedLanguage}`}>
                  {currentCode}
                </code>
              </pre>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                    onClick={() => window.open('https://docs.bria.ai/', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    API Documentation
                  </Button>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                    onClick={() => window.open('https://platform.bria.ai/', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Get API Key
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Need help? Check our documentation or contact support.
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};