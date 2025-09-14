import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, ExternalLink, Code } from "lucide-react";
import { FaPython, FaJs, FaNodeJs, FaJava, FaPhp, FaGolang } from "react-icons/fa6";
import { SiCurl } from "react-icons/si";
import { Code2 } from "lucide-react";
import { toast } from "sonner";

interface ApiReferenceDialogProps {
  trigger: React.ReactNode;
}

interface LanguageConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  code: string;
}

const languages: Record<string, LanguageConfig> = {
  python: {
    name: "Python",
    icon: FaPython,
    code: `import requests
import json

url = "https://api.bria.ai/v1/text-to-image/base/2.3/base"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

payload = {
    "api": {
        "json": {
            "prompt": "A serene landscape with mountains",
            "num_results": 1,
            "sync": True,
            "width": 1024,
            "height": 1024,
            "seed": 123456,
            "aspect_ratio": "1:1",
            "steps": 20,
            "cfg": 7.5
        }
    }
}

try:
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    result = response.json()
    print(f"Image URL: {result['result'][0]['urls'][0]}")
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")`
  },
  javascript: {
    name: "JavaScript",
    icon: FaJs,
    code: `const generateImage = async () => {
  const response = await fetch('https://api.bria.ai/v1/text-to-image/base/2.3/base', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api: {
        json: {
          prompt: 'A serene landscape with mountains',
          num_results: 1,
          sync: true,
          width: 1024,
          height: 1024,
          seed: 123456,
          aspect_ratio: '1:1',
          steps: 20,
          cfg: 7.5
        }
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  const data = await response.json();
  console.log('Image URL:', data.result[0].urls[0]);
  return data;
};

generateImage().catch(console.error);`
  },
  nodejs: {
    name: "Node.js",
    icon: FaNodeJs,
    code: `const https = require('https');

const options = {
  hostname: 'api.bria.ai',
  port: 443,
  path: '/v1/text-to-image/base/2.3/base',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
};

const postData = JSON.stringify({
  api: {
    json: {
      prompt: 'A serene landscape with mountains',
      num_results: 1,
      sync: true,
      width: 1024,
      height: 1024,
      seed: 123456,
      aspect_ratio: '1:1',
      steps: 20,
      cfg: 7.5
    }
  }
});

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const result = JSON.parse(data);
    console.log('Image URL:', result.result[0].urls[0]);
  });
});

req.on('error', (e) => {
  console.error(\`Problem with request: \${e.message}\`);
});

req.write(postData);
req.end();`
  },
  curl: {
    name: "cURL",
    icon: SiCurl,
    code: `curl -X POST "https://api.bria.ai/v1/text-to-image/base/2.3/base" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "api": {
      "json": {
        "prompt": "A serene landscape with mountains",
        "num_results": 1,
        "sync": true,
        "width": 1024,
        "height": 1024,
        "seed": 123456,
        "aspect_ratio": "1:1",
        "steps": 20,
        "cfg": 7.5
      }
    }
  }' \\
  | jq '.result[0].urls[0]'`
  },
  java: {
    name: "Java",
    icon: FaJava,
    code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

public class BriaImageGenerator {
    private static final String API_URL = "https://api.bria.ai/v1/text-to-image/base/2.3/base";
    private static final String API_KEY = "YOUR_API_KEY";
    
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        ObjectMapper mapper = new ObjectMapper();
        
        String requestBody = mapper.writeValueAsString(Map.of(
            "api", Map.of(
                "json", Map.of(
                    "prompt", "A serene landscape with mountains",
                    "num_results", 1,
                    "sync", true,
                    "width", 1024,
                    "height", 1024,
                    "seed", 123456,
                    "aspect_ratio", "1:1",
                    "steps", 20,
                    "cfg", 7.5
                )
            )
        ));
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_URL))
            .header("Authorization", "Bearer " + API_KEY)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();
            
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
            
        if (response.statusCode() == 200) {
            System.out.println("Response: " + response.body());
        } else {
            System.err.println("Error: " + response.statusCode());
        }
    }
}`
  },
  csharp: {
    name: "C#",
    icon: Code2,
    code: `using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class BriaImageGenerator 
{
    private static readonly HttpClient client = new HttpClient();
    private const string ApiUrl = "https://api.bria.ai/v1/text-to-image/base/2.3/base";
    private const string ApiKey = "YOUR_API_KEY";
    
    public static async Task Main(string[] args)
    {
        var payload = new
        {
            api = new
            {
                json = new
                {
                    prompt = "A serene landscape with mountains",
                    num_results = 1,
                    sync = true,
                    width = 1024,
                    height = 1024,
                    seed = 123456,
                    aspect_ratio = "1:1",
                    steps = 20,
                    cfg = 7.5
                }
            }
        };
        
        var json = JsonConvert.SerializeObject(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {ApiKey}");
        
        try
        {
            var response = await client.PostAsync(ApiUrl, content);
            response.EnsureSuccessStatusCode();
            
            var result = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Response: {result}");
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine($"Error: {e.Message}");
        }
    }
}`
  },
  php: {
    name: "PHP",
    icon: FaPhp,
    code: `<?php

$url = 'https://api.bria.ai/v1/text-to-image/base/2.3/base';
$api_key = 'YOUR_API_KEY';

$data = array(
    'api' => array(
        'json' => array(
            'prompt' => 'A serene landscape with mountains',
            'num_results' => 1,
            'sync' => true,
            'width' => 1024,
            'height' => 1024,
            'seed' => 123456,
            'aspect_ratio' => '1:1',
            'steps' => 20,
            'cfg' => 7.5
        )
    )
);

$options = array(
    'http' => array(
        'header' => array(
            'Authorization: Bearer ' . $api_key,
            'Content-Type: application/json'
        ),
        'method' => 'POST',
        'content' => json_encode($data)
    )
);

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === FALSE) {
    die('Error occurred');
}

$response = json_decode($result, true);
echo "Image URL: " . $response['result'][0]['urls'][0] . "\\n";

?>`
  },
  go: {
    name: "Go",
    icon: FaGolang,
    code: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
)

type JsonRequest struct {
    Prompt      string  \`json:"prompt"\`
    NumResults  int     \`json:"num_results"\`
    Sync        bool    \`json:"sync"\`
    Width       int     \`json:"width"\`
    Height      int     \`json:"height"\`
    Seed        int     \`json:"seed"\`
    AspectRatio string  \`json:"aspect_ratio"\`
    Steps       int     \`json:"steps"\`
    CFG         float64 \`json:"cfg"\`
}

type ApiRequest struct {
    Json JsonRequest \`json:"json"\`
}

type GenerateRequest struct {
    Api ApiRequest \`json:"api"\`
}

func main() {
    url := "https://api.bria.ai/v1/text-to-image/base/2.3/base"
    apiKey := "YOUR_API_KEY"
    
    payload := GenerateRequest{
        Api: ApiRequest{
            Json: JsonRequest{
                Prompt:      "A serene landscape with mountains",
                NumResults:  1,
                Sync:        true,
                Width:       1024,
                Height:      1024,
                Seed:        123456,
                AspectRatio: "1:1",
                Steps:       20,
                CFG:         7.5,
            },
        },
    }
    
    jsonData, err := json.Marshal(payload)
    if err != nil {
        fmt.Printf("Error marshaling JSON: %v\\n", err)
        return
    }
    
    req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    if err != nil {
        fmt.Printf("Error creating request: %v\\n", err)
        return
    }
    
    req.Header.Set("Authorization", "Bearer "+apiKey)
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Printf("Error making request: %v\\n", err)
        return
    }
    defer resp.Body.Close()
    
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        fmt.Printf("Error reading response: %v\\n", err)
        return
    }
    
    fmt.Printf("Response: %s\\n", body)
}`
  }
};

export const ApiReferenceDialog = ({ trigger }: ApiReferenceDialogProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(languages[selectedLanguage].code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const currentLanguage = languages[selectedLanguage];
  const IconComp = currentLanguage.icon;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] bg-gray-900 border-gray-700 text-white">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Code className="w-5 h-5" />
            API Reference - Text to Image
          </DialogTitle>
          <div className="text-sm text-gray-400 mt-2">
            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-mono mr-3">POST</span>
            <span className="font-mono">/v1/text-to-image/base/2.3/base</span>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Language Selector and Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300">Language:</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
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
            
            <div className="flex items-center gap-2">
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
                  {currentLanguage.code}
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
                onClick={() => window.open('https://docs.bria.ai/api-reference', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                API Documentation
              </Button>
              <Button
                variant="link"
                className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                onClick={() => window.open('https://bria.ai/api-keys', '_blank')}
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