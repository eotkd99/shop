"use client";

import { usePathname } from "next/navigation";
import { MainHeader } from "@/components/MainHeader";
import { MainCategory } from "@/components/MainCategory";

const excludedPaths = ["/login", "/join"];

export default function HeaderWrapper() {
  const pathname = usePathname();
  const shouldRenderHeader = !excludedPaths.includes(pathname);

  return (
    <>
      {shouldRenderHeader && <MainHeader />}
      {shouldRenderHeader && <MainCategory />}
    </>
  );
}
