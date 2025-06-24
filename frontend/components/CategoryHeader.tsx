"use client"
import { useState } from "react";
import { Menu } from "lucide-react";
import { HamburgerMenu } from "./HamburgerMenu";

export function CategoryHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="h-12 flex items-center px-4 w-4/5 mx-auto bg-white">
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center justify-center h-full w-full"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          {/* 카테고리들 */}
          <div className="flex items-center justify-center h-full w-full">베스트</div>
          <div className="flex items-center justify-center h-full w-full">쇼킹딜</div>
          <div className="flex items-center justify-center h-full w-full">마트플러스</div>
          <div className="flex items-center justify-center h-full w-full text-pink-500">쿠폰/기획전</div>
          <div className="flex items-center justify-center h-full w-full">9900원샵</div>
          <div className="flex items-center justify-center h-full w-full">리퍼클럽</div>
          <div className="flex items-center justify-center h-full w-full">T공식대리점</div>
          <div className="flex items-center justify-center h-full w-full">아마존</div>
        </div>
      </header>
      <HamburgerMenu open={menuOpen} setOpen={setMenuOpen} />
    </>
  );
}
