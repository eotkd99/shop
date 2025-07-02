"use client";

import { usePathname } from "next/navigation";
import { MainHeader } from "@/components/main/MainHeader";
import { MainCategory } from "@/components/main/MainCategory";

const excludedPaths = ["/login", "/join"];
const mainCategoryExcludedPaths = ["/products"];

export default function HeaderWrapper() {
  const pathname = usePathname();
  const shouldRenderHeader = !excludedPaths.includes(pathname);
  const shouldRenderMainCategory = !excludedPaths.includes(pathname);

  return (
    <>
      {shouldRenderHeader && <MainHeader />}
      {shouldRenderMainCategory && <MainCategory />}
    </>
  );
}
