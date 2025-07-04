"use client";

import { usePathname } from "next/navigation";
import { MainHeader } from "@/components/main/MainHeader";
import { MainMenuPopover } from "@/components/main/MainMenuPopover";      // 쪼갠 컴포넌트 1
import { MainCategoryBar } from "@/components/main/MainCategoryBar";      // 쪼갠 컴포넌트 2

const excludedPaths = ["/login", "/join"];
const mainCategoryExcludedPaths = ["/products"];

export default function HeaderWrapper() {
  const pathname = usePathname();
  const shouldRenderHeader = !excludedPaths.includes(pathname);
  const shouldRenderMainCategory = !excludedPaths.includes(pathname);

  return (
    <div className="w-7/10 mx-auto flex flex-col gap-1 mb-5">
      {shouldRenderHeader && <MainHeader />}
      {shouldRenderMainCategory && (
        <div className="flex overflow-hidden items-center w-full h-20 bg-gradient-to-b from-white to-gray-50 shadow-sm">
          <div className="flex-[1.5] h-full">
            <MainMenuPopover />
          </div>
          <div className="flex-[8.5] h-full">
            <MainCategoryBar />
          </div>
        </div>
      )}
    </div>
  );

}