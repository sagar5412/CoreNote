import { CaretDown } from "../ui/CaretDown";
import { FileIcon } from "../ui/FileIcon";
import { FileText } from "../ui/FileText";

type Props = {
  emoji: string | null | undefined;
  hasContent: boolean;
  isHovered: boolean;
  hasChildren: boolean;
  isExpanded: boolean;
  onToggleExpand?: () => void;
};

export function PageIcon({
  emoji,
  hasContent,
  isHovered,
  hasChildren,
  isExpanded,
  onToggleExpand,
}: Props) {
  if (emoji) {
    return <span className="text-sm">{emoji}</span>;
  }
  if (isHovered && hasChildren) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleExpand?.();
        }}
        className="text-muted-foreground hover:text-foreground flex-shrink-0 cursor-pointer flex items-center"
      >
        <span
          className="inline-block"
          style={{ transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)" }}
        >
          <CaretDown />
        </span>
      </button>
    );
  }
  return (
    <span className="cursor-pointer">
      {hasContent ? <FileText /> : <FileText />}
    </span>
  );
}
