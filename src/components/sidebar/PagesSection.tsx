import { useRootPages } from "@/hooks/use-pages";
import { Spinner } from "@radix-ui/themes";
import { PageNode } from "./PageNode";
import { PageActions } from "./PageAction";
import clsx from "clsx";
import { useCreatePage } from "@/hooks/use-create-page";
import "./PageScrollBar.css";
export function PagesSection() {
  const { data, isLoading } = useRootPages();
  const createPage = useCreatePage(null);
  const handleAddPage = () => {
    createPage.mutate({ title: "Untitled" });
  };

  const handleOpenMenu = () => {
    console.log("Open menu for:", "root");
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
      <nav className="space-y-1 p-2">
        {isLoading && (
          <div>
            <Spinner />
          </div>
        )}
        <div
          className={clsx(
            "group/page relative flex items-center gap-2 px-2 py-1 rounded text-[#91918E] text-xs font-medium",
            "hover:bg-[#EDEDED] cursor-pointer"
          )}
        >
          <div className="text-xs font-medium py-0.5">Private</div>
          <PageActions onAddChild={handleAddPage} onOpenMenu={handleOpenMenu} />
        </div>

        {data?.map((page) => (
          <PageNode key={page.id} page={page} level={0} />
        ))}
      </nav>
    </div>
  );
}
