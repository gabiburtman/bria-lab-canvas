import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, User, Settings, LogOut, MessageSquare, FileText } from "lucide-react";
import briaLogo from "@/assets/bria-logo.png";

const Header = () => {
  return (
    <header className="w-full h-16 bg-lab-surface border-b border-lab-border px-6 flex items-center justify-between">
      {/* Left Group - Logo & Title */}
      <div className="flex items-center gap-3">
        <img src={briaLogo} alt="Bria Logo" className="w-8 h-8" />
        <h1 className="text-xl font-google-sans font-medium text-lab-text-primary">
          Bria 4 Lab
        </h1>
      </div>

      {/* Right Group - Navigation & User */}
      <div className="flex items-center gap-2">
        {/* Primary CTA */}
        <Button 
          variant="default" 
          className="bg-lab-primary hover:bg-lab-primary-hover text-lab-primary-foreground font-medium px-4 hover:shadow-lab-glow-primary transition-all"
        >
          Bria Platform
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>

        {/* External Links */}
        <div className="flex items-center gap-1 ml-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9 hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary"
              >
                <img 
                  src="/lovable-uploads/d7168b47-d969-4810-b373-9a25ca8d305d.png" 
                  alt="Hugging Face" 
                  className="w-4 h-4"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hugging Face</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9 hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Discord</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9 hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary"
              >
                <FileText className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Documentation</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-9 h-9 rounded-full hover:bg-lab-interactive-hover text-lab-text-secondary hover:text-lab-text-primary ml-2"
            >
              <User className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-lab-surface border-lab-border shadow-lab-glow-subtle">
            <DropdownMenuItem className="cursor-pointer hover:bg-lab-interactive-hover">
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-lab-interactive-hover">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;