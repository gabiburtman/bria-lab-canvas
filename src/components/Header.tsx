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
    <header className="w-full h-16 bg-lab-surface border-b border-lab-border px-6 flex items-center justify-between shadow-lab-sm">
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
          className="bg-lab-primary hover:bg-lab-primary-hover text-lab-primary-foreground font-medium px-4 shadow-lab-sm"
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
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.54 10.5h-.55v-.55h.55v.55zm6.18-7.32c-.9-1.44-3.02-1.44-3.92 0L12 8.48 9.2 3.18c-.9-1.44-3.02-1.44-3.92 0L2.48 9.9c-.9 1.44-.12 3.27 1.44 3.27h1.64v4.37c0 1.38 1.12 2.5 2.5 2.5h1.88v-4.37H12v4.37h1.88c1.38 0 2.5-1.12 2.5-2.5v-4.37h1.64c1.56 0 2.34-1.83 1.44-3.27L16.72 3.18zM12 16.5h-1v-1h1v1zm-1-2h1v-1h-1v1zm1-2h-1v-1h1v1zm0-2h-1v-1h1v1z"/>
                </svg>
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
          <DropdownMenuContent align="end" className="w-48 bg-lab-surface border-lab-border shadow-lab-md">
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