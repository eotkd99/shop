"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MainCategory = {
  id: number;
  name: string;
  image: string;
  alt_text: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function MainCategoryBar() {
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/main/resources/main_category/`)
      .then(res => setMainCategories(res.data));
  }, []);

  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  const updateScrollStatus = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 0);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollStatus);
    updateScrollStatus();
    return () => el.removeEventListener("scroll", updateScrollStatus);
  }, [mainCategories]);

  return (
    <div className="flex items-center w-full h-full overflow-hidden bg-white">
      <Button
        variant="ghost"
        onClick={() => scrollBy(-180)}
        disabled={atStart}
        className="w-10 h-10 p-0 flex items-center justify-center rounded-none transition 
        disabled:opacity-40 disabled:pointer-events-none hover:bg-gray-200 text-gray-600"
      >
        <ChevronLeft strokeWidth={1} className="w-5 h-5" />
      </Button>

      <div className="relative flex-1 h-full overflow-hidden">
        {!atStart && (
          <div className="absolute top-0 left-0 w-10 h-full bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        )}
        {!atEnd && (
          <div className="absolute top-0 right-0 w-10 h-full bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
        )}

        <div
          ref={scrollRef}
          className="relative z-10 flex overflow-x-auto w-full h-full custom-scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="flex items-center gap-5 h-full">
            {mainCategories.map((cat, i) => (
              <Card
                key={cat.id}
                className="flex items-center justify-center h-[50%] px-0 py-0 bg-white hover:bg-gray-100 transition shadow-none rounded-none border-none min-w-fit cursor-pointer"
              >
                <div className="flex items-center gap-1 h-[50%]">
                  <img src={cat.image} alt={cat.alt_text} className="w-4 h-4" />
                  <span className="text-xs text-gray-700 whitespace-nowrap">
                    {`카테고리 ${i + 1}`}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={() => scrollBy(180)}
        disabled={atEnd}
        className="w-10 h-10 p-0 flex items-center justify-center rounded-none transition 
        disabled:opacity-40 disabled:pointer-events-none hover:bg-gray-200 text-gray-600"
      >
        <ChevronRight strokeWidth={1} className="w-5 h-5" />
      </Button>

      <style jsx>{`
      .custom-scrollbar-hide {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .custom-scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `}</style>
    </div>
  );
}

function ScrollButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={`mx-1 transition
        ${disabled
          ? "pointer-events-none"
          : "hover:bg-gray-200 text-gray-600"}`}
    >
      <Icon strokeWidth={1} className="w-8! h-8!" />
    </Button>
  );
}

function FadeOverlay({ position }: { position: "left" | "right" }) {
  const base = "absolute top-0 h-full w-12 bg-gradient-to-";
  const className =
    position === "left"
      ? `${base}r from-white to-transparent left-0`
      : `${base}l from-white to-transparent right-0`;
  return <div className={`${className} z-20 pointer-events-none`} />;
}
