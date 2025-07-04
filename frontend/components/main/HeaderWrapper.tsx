"use client";

import { usePathname } from "next/navigation";
import { MainHeader } from "@/components/main/MainHeader";
import { MainMenuPopover } from "@/components/main/MainMenuPopover";
import { MainCategoryBar } from "@/components/main/MainCategoryBar";

const excludedPaths = ["/login", "/join", "/find-id", "/reset-password"];

export default function HeaderWrapper() {
  const pathname = usePathname();
  const shouldRenderHeader = !excludedPaths.some(path => pathname.startsWith(path));
  const shouldRenderMainCategory = !excludedPaths.some(path => pathname.startsWith(path));

  return (
    <div className="w-7/10 mx-auto flex flex-col bg-gradient-to-b from-white to-gray-50 shadow-md mb-3 mt-3">
      {shouldRenderHeader && <MainHeader />}
      {shouldRenderMainCategory && (
        <>
          <hr className="w-full h-px bg-gray-200 border-0" />
          <div className="flex w-full h-20">
            <div className="flex-[1.5] h-full">
              <MainMenuPopover />
            </div>
            <div className="flex-[8.5] h-full">
              <MainCategoryBar />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
