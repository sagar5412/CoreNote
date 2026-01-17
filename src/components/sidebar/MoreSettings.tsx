import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaretDown } from "../ui/CaretDown";
import { FileText } from "../ui/FileText";
import { DataBaseIcon } from "../ui/DataBaseIcon";
import { TemplateIcon } from "../ui/TemplateIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function MoreSettings() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <TooltipProvider>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <Tooltip open={isDropdownOpen ? false : undefined}>
          <TooltipTrigger>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center focus:outline-none focus-visible:outline-none">
                <div className="flex items-center hover:bg-[rgba(88,87,87,0.1)] rounded">
                  <CaretDown className="p-2 cursor-pointer" />
                </div>
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 text-white">
            <p>More settings</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent className="w-34 p-1">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <FileText />
              Pages
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DataBaseIcon />
              Database
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <TemplateIcon />
              Templates
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
