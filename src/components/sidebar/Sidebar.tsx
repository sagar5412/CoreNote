"use client";

import { TopSection } from "./TopSection";
import { PagesSection } from "./PagesSection";

export function Sidebar() {
  return (
    <div className="group/sidebar w-[236.938px] h-[737.600px] bg-[#F9F8F7] px-[10px] py-[6px]">
      <TopSection />
      <PagesSection />
    </div>
  );
}
