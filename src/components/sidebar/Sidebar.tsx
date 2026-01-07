"use client";

import { TopSection } from "./TopSection";
import { PagesSection } from "./PagesSection";

export function Sidebar() {
  return (
    <div className="flex flex-col h-screen">
      <div className="group/sidebar w-[236.938px] h-screen bg-[#F9F8F7] py-[6px] flex flex-col relative overflow-hidden pb-0">
        <TopSection />
        <div className="flex flex-col px-[8px]">
          <div>Search</div>
          <div>Home</div>
          <div>Meetings</div>
        </div>
        <PagesSection />
      </div>
      <div className="h-[48px] max-h-[48px] border-t">page info</div>
    </div>
  );
}
