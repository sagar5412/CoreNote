"use client";

import { TopSection } from "./TopSection";
import { PagesSection } from "./PagesSection";
import { useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { HamburgerMenu } from "../ui/HamburgerMenu";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const showSidebar = isOpen || isHovering;

  const sidebarRef = useRef<HTMLDivElement>(null);
  const hoverZoneRef = useRef<HTMLDivElement>(null);
  // Handle mouse leave from the entire hover zone
  const handleMouseLeave = (e: React.MouseEvent) => {
    // Check if mouse is still within the sidebar or hover zone
    const sidebar = sidebarRef.current;
    const hoverZone = hoverZoneRef.current;

    if (sidebar && hoverZone) {
      const sidebarRect = sidebar.getBoundingClientRect();
      const hoverZoneRect = hoverZone.getBoundingClientRect();

      const isInSidebar =
        e.clientX >= sidebarRect.left &&
        e.clientX <= sidebarRect.right &&
        e.clientY >= sidebarRect.top &&
        e.clientY <= sidebarRect.bottom;

      const isInHoverZone =
        e.clientX >= hoverZoneRect.left &&
        e.clientX <= hoverZoneRect.right &&
        e.clientY >= hoverZoneRect.top &&
        e.clientY <= hoverZoneRect.bottom;

      if (!isInSidebar && !isInHoverZone) {
        setIsHovering(false);
      }
    } else {
      setIsHovering(false);
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      <TooltipProvider>
        <div
          className={`fixed top-2 left-2 z-50 transition-all duration-200 ${
            isOpen ? "opacity-0 pointer-events-none " : "opacity-100"
          }`}
          onMouseEnter={() => setIsHovering(true)}
        >
          <Tooltip>
            <TooltipTrigger
              onClick={() => setIsOpen(true)}
              className="p-2 rounded hover:bg-[#E8E8E8] cursor-pointer bg-white shadow-sm"
            >
              <HamburgerMenu />
            </TooltipTrigger>
            <TooltipContent
              className="bg-gray-800 text-white rounded-lg text-muted-foreground text-xs p-2 m-1 rounded"
              side="right"
            >
              <p>Lock sidebar open</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      {isOpen ? (
        // OPEN STATE: Full height sidebar
        <div className="group/sidebar w-[236.938px] h-screen bg-[#F9F8F7] py-[6px] flex flex-col relative overflow-hidden pb-0">
          <TopSection onClose={() => setIsOpen(false)} />
          {/* <div className="flex flex-col px-[8px]">
            <div>Search</div>
            <div>Home</div>
            <div>Meetings</div>
          </div> */}
          <PagesSection />
          {/* <div className="h-[48px] max-h-[48px] border-t flex-shrink-0">
            page info
          </div> */}
        </div>
      ) : (
        // CLOSED STATE: Floating sidebar (10% from top, 20% from bottom)
        <div
          className={`
            fixed left-0 z-50
            w-[236.938px]
            bg-[#F9F8F7]
            py-[6px]
            flex flex-col
            overflow-hidden
            shadow-xl
            rounded-r-lg
            transition-all duration-200 ease-out
            ${
              isHovering
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4 pointer-events-none"
            }
          `}
          style={{
            top: "10%",
            bottom: "20%",
            height: "auto",
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <TopSection
            onClose={() => setIsOpen(false)}
            isHovering={isHovering}
          />
          {/* <div className="flex flex-col px-[8px]">
            <div>Search</div>
            <div>Home</div>
            <div>Meetings</div>
          </div> */}
          <PagesSection />
          {/* <div className="h-[48px] max-h-[48px] border-t flex-shrink-0">
            page info
          </div> */}
        </div>
      )}
      {!isOpen && (
        <div
          ref={hoverZoneRef}
          className="fixed left-0 z-40 w-[236.938px]"
          style={{
            top: "10%",
            bottom: "20%",
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  );
}
