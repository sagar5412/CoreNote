// src/components/sidebar/PageActions.tsx
import { DotsHorizontal } from "@/components/ui/DotsHorizontal";
import { PlusIcon } from "@/components/ui/PlusIcon";

type Props = {
  onAddChild: () => void;
  onOpenMenu: () => void;
};

export function PageActions({ onAddChild, onOpenMenu }: Props) {
  return (
    <div className="absolute right-1 flex items-center gap-0.5 opacity-0 group-hover/page:opacity-100 rounded text-[#9B9A97] hover:text-[#37352F] cursor-pointer">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenMenu();
        }}
        className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-[#E5E5E5] cursor-pointer"
      >
        <DotsHorizontal />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAddChild();
        }}
        className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-[#E5E5E5] cursor-pointer"
      >
        <PlusIcon />
      </button>
    </div>
  );
}
