// src/components/sidebar/PageActions.tsx
import { DotsHorizontal } from "@/components/ui/DotsHorizontal";
import { PlusIcon } from "@/components/ui/PlusIcon";
import { ThreeDotsMenu } from "./ThreeDotsMenu";

type Props = {
  pageId: string;
  pageTitle?: string;
  onAddChild: () => void;
};

export function PageActions({ onAddChild, pageId }: Props) {
  return (
    <div className="absolute right-1 flex items-center gap-0.5 opacity-0 group-hover/page:opacity-100 rounded text-[#9B9A97] hover:text-[#37352F] cursor-pointer">
      <ThreeDotsMenu pageId={pageId} />
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
