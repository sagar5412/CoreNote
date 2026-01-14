import { DotsHorizontal } from "../ui/DotsHorizontal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useState } from "react";
import { useDeletePage } from "@/hooks/use-delete-page";
import { useRestorePage } from "@/hooks/use-restore-page";
import { toast } from "sonner";

interface ThreeDotsMenuProps {
  pageId: string;
  pageTitle?: string;
}

export function ThreeDotsMenu({ pageId, pageTitle }: ThreeDotsMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const deletePage = useDeletePage();
  const restorePage = useRestorePage();

  const handleDeletePage = () => {
    setIsDropdownOpen(false);

    deletePage.mutate(pageId, {
      onSuccess: () => {
        toast.success(`"${pageTitle || "Page"}" deleted`, {
          action: {
            label: "Undo",
            onClick: () => restorePage.mutate(),
          },
          duration: 5000,
        });
      },
      onError: (error) => {
        toast.error("Failed to delete page");
        console.error(error);
      },
    });
  };

  return (
    <TooltipProvider>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <Tooltip open={isDropdownOpen ? false : undefined}>
          <TooltipTrigger>
            <DropdownMenuTrigger asChild>
              <div className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-[#E5E5E5] cursor-pointer">
                <DotsHorizontal />
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-[#2B2B2B] text-[#EBE8E8]">
            <p>delete, rename, and more...</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent className="w-34 p-1">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleDeletePage}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Rename</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
