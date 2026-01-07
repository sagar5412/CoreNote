import { Avatar, Button, Strong, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { SquarePen } from "../ui/SquarePen";
import { CaretDown } from "../ui/CaretDown";
import { DoubleDownArrowLeft } from "../ui/DoubleDownArrorLeft";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useCreatePage } from "@/hooks/use-create-page";
import { useRouter } from "next/navigation";
import { MoreSettings } from "./MoreSettings";

export function TopSection({
  onClose,
  isHovering,
}: {
  onClose: () => void;
  isHovering?: boolean;
}) {
  const router = useRouter();
  const session = useSession();
  const name = session.data?.user.name;
  const letter = name?.split(" ")[0][0];

  const createRootPage = useCreatePage(null);

  const handleCreatePage = async () => {
    createRootPage.mutate(
      { title: "Untitled" },
      {
        onSuccess: (newPage) => {
          router.push(`/${newPage.id}`);
        },
      }
    );
  };
  return (
    <div className="group px-2 py-[2px] flex flex-row items-center justify-between rounded hover:bg-[#E8E8E8] cursor-pointer">
      <div className="flex flex-row items-center gap-2 w-[100px] flex-shrink-0">
        <div className="flex items-center">
          <Avatar size="1" fallback={letter || "A"} color="gray" />
        </div>

        <div className="flex flex-row items-center">
          <Text
            size="2"
            weight="medium"
            className="flex items-center overflow-hidden"
          >
            <span className="inline-block max-w-[63px] group-hover:max-w-[45px] truncate transition-[max-width] duration-200">
              {name}
            </span>
            <span className="inline-flex w-0 group-hover:w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 overflow-hidden">
              <CaretDown />
            </span>
          </Text>
        </div>
      </div>

      <div
        className={` ${
          isHovering
            ? "opacity-0"
            : "flex items-center text-muted-foreground opacity-0 transition-opacity group-hover/sidebar:opacity-100"
        }`}
      >
        <Tooltip>
          <TooltipTrigger
            className="flex items-center hover:bg-[rgba(88,87,87,0.1)] rounded"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <DoubleDownArrowLeft />
          </TooltipTrigger>
          <TooltipContent
            className={` ${
              isHovering ? "opacity-0" : "bg-gray-800 text-white opacity-100"
            }`}
          >
            <p>Close sidebar</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-row gap-0.1 items-center">
        <Tooltip>
          <TooltipTrigger
            className="flex items-center hover:bg-[rgba(88,87,87,0.1)] rounded"
            onClick={handleCreatePage}
          >
            <SquarePen />
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white" side="bottom">
            <p>Create a new page</p>
          </TooltipContent>
        </Tooltip>
        <MoreSettings />
      </div>
    </div>
  );
}
