"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef, useState } from "react";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";

const colors = ["red-400", "blue-400", "green-400", "yellow-400"];
const colorNames = ["RED", "BLUE", "GREEN", "YELLOW"];

export function MainPanel() {
  const [current, setCurrent] = useState(1);
  const total = colors.length;
  const swiperRef = useRef<any>(null);

  return (
    <div className="relative w-full h-[480px]">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        slidesPerView={1}
        loop
        onSlideChange={(s) => setCurrent((s.realIndex % total) + 1)}
        className="w-full h-full"
        onInit={(s) => {
          swiperRef.current = s;
        }}
      >
        {colors.map((color, idx) => (
          <SwiperSlide key={idx}>
            <div
              className={`w-full h-full flex items-center justify-center text-4xl font-bold text-white rounded-xl ${
                color === "red-400"
                  ? "bg-red-400"
                  : color === "blue-400"
                  ? "bg-blue-400"
                  : color === "green-400"
                  ? "bg-green-400"
                  : "bg-yellow-400"
              }`}
            >
              색{idx + 1} ({colorNames[idx]})
            </div>
          </SwiperSlide>
        ))}

        <button
                  className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-700 hover:text-gray-900 focus:outline-none flex items-center"
                  aria-label="Previous Slide"
                >
                  <CircleChevronLeft size={32} />
                </button>
                <button
                  className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 text-gray-700 hover:text-gray-900 focus:outline-none flex items-center"
                  aria-label="Next Slide"
                >
                  <CircleChevronRight size={40} strokeWidth={3} />
                </button>
      </Swiper>

      <div className="absolute right-4 bottom-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full select-none z-20">
        {current} / {total}
      </div>
    </div>
  );
}
