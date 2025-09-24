import { useState } from "react";
import { Button } from "@/components/ui/button";
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
      <DialogContent className="max-w-6xl h-[85vh] bg-gray-900 border-gray-700 text-white">
        <DialogHeader className="border-b border-gray-700 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-semibold text-white flex items-center gap-3 mb-2">
                <Code className="w-6 h-6" />
                API Reference
              </DialogTitle>
              <div className="flex items-center gap-3">
                <span className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-mono">POST</span>
                <span className="font-mono text-gray-300">/v2/image/generate</span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex gap-6">
          {/* Sidebar - Example Selection */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-200 mb-4 uppercase tracking-wide">Examples</h3>
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
                          ? 'bg-blue-600/20 border-blue-500/50 text-white' 
                          : 'bg-gray-800/30 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                        <div>
                          <div className="font-medium text-sm">{example.name}</div>
                          <div className="text-xs text-gray-400 mt-1 leading-relaxed">
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
          
          {/* Main Content - Code Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Code Block */}
            <div className="flex-1 bg-gray-950 rounded-lg border border-gray-700 overflow-hidden">
              {/* Code Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-800/80 border-b border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="h-4 w-px bg-gray-600"></div>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-36 bg-gray-700 border-gray-600 text-white h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {Object.entries(languages).map(([key, lang]) => {
                        const Icon = lang.icon;
                        return (
                          <SelectItem 
                            key={key} 
                            value={key}
                            className="text-white hover:bg-gray-700 focus:bg-gray-700"
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {lang.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 h-8"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              
              {/* Code Content */}
              <div className="overflow-auto">
                <pre className="p-6 text-sm text-gray-100 leading-relaxed">
                  <code className={`language-${selectedLanguage}`}>
                    {currentCode}
                  </code>
                </pre>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-6 mt-4">
              <div className="flex items-center gap-6">
                <Button
                  variant="link"
                  className="text-blue-400 hover:text-blue-300 p-0 h-auto text-sm"
                  onClick={() => window.open('https://docs.bria.ai/', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  API Documentation
                </Button>
                <Button
                  variant="link"
                  className="text-blue-400 hover:text-blue-300 p-0 h-auto text-sm"
                  onClick={() => window.open('https://platform.bria.ai/', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get API Key
                </Button>
              </div>
              <div className="text-xs text-gray-500">
                Need help? Check our documentation or contact support.
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};