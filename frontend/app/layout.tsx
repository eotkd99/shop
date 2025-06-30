"use client"; 

import { ReactNode } from "react";
import { MainHeader } from "@/components/MainHeader";
import { MainCategory } from "@/components/MainCategory";
import { usePathname } from "next/navigation"; 
import "@/app/globals.css";

const excludedPaths = ["/login", "/join"];

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const shouldRenderHeader = !excludedPaths.includes(pathname); // 제외된 경로 확인

  return (
    <html lang="ko">
      <body>
        <div className="bg-white w-full z-50">
          {shouldRenderHeader && <MainHeader />}
          {shouldRenderHeader && <MainCategory />}
          {children}
        </div>
      </body>
    </html>
  );
}
