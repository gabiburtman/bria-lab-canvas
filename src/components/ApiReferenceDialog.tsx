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
      <DialogContent className="max-w-5xl h-[85vh] bg-gray-900 border-gray-700 text-white">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Code className="w-5 h-5" />
            API Reference - GAIA Image Generation
          </DialogTitle>
          <div className="text-sm text-gray-400 mt-2">
            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-mono mr-3">POST</span>
            <span className="font-mono">/v2/image/generate</span>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Example Type and Language Selectors */}
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300">Example:</label>
              <Select value={selectedExample} onValueChange={(value) => setSelectedExample(value as ExampleType)}>
                <SelectTrigger className="w-64 bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {Object.entries(examples).map(([key, example]) => {
                    const Icon = example.icon;
                    return (
                      <SelectItem 
                        key={key} 
                        value={key}
                        className="text-white hover:bg-gray-700 focus:bg-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {example.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              
              <label className="text-sm font-medium text-gray-300">Language:</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
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
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

          {/* Example Description */}
          <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <ExampleIcon className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-white">{currentExample.name}</span>
            </div>
            <p className="text-sm text-gray-400">{currentExample.description}</p>
          </div>
          
          {/* Code Block */}
          <div className="flex-1 overflow-auto">
            <div className="bg-gray-950 rounded-lg border border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <IconComp className="w-4 h-4" />
                  <span className="text-sm font-medium">{currentLanguage.name}</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <pre className="p-4 text-sm text-gray-100 overflow-auto leading-relaxed">
                <code className={`language-${selectedLanguage}`}>
                  {currentCode}
                </code>
              </pre>
            </div>
          </div>
          
          {/* Footer Links */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700 mt-4">
            <div className="flex items-center gap-4 text-sm">
              <Button
                variant="link"
                className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                onClick={() => window.open('https://docs.bria.ai/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                API Documentation
              </Button>
              <Button
                variant="link"
                className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                onClick={() => window.open('https://platform.bria.ai/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Get API Key
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              Need help? Check our documentation or contact support.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};