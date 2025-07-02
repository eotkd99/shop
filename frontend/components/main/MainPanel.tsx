"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Pause, Play } from "lucide-react";
import axios from "axios";

type MainPanelItem = {
  id: number;
  name: string;
  path: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"; // 환경 변수 처리

export function MainPanel() {
  const [current, setCurrent] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [data, setData] = useState<MainPanelItem[]>([]);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/main/resources/panel`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching main panel data:", error);
      }
    };

    fetchData();
  }, []);

  const togglePlay = () => {
    if (!swiperRef.current) return;
    playing ? swiperRef.current.autoplay.stop() : swiperRef.current.autoplay.start();
    setPlaying(!playing);
  };

  const badgeBase =
    "absolute bottom-4 bg-black/60 text-white px-4 py-2 rounded-full z-20 select-none h-10 flex items-center justify-center";

  return (
    <div
      className="relative w-full h-[520px] overflow-hidden"
      style={{
        "--swiper-navigation-color": "white",
        "--swiper-navigation-size": "48px",
        "--swiper-navigation-sides-offset": "24px",
      } as React.CSSProperties}
    >
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        slidesPerView={1}
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={(s) => setCurrent((s.realIndex % data.length) + 1)}
        className="w-full h-full"
      >
        {data.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className="w-full h-full flex items-center justify-center text-4xl font-bold text-white rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url(${item.path})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={`${badgeBase} right-[105px]`}>
        <button onClick={togglePlay} className="w-5 h-5 flex items-center justify-center">
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>

      <div className={`${badgeBase} right-6`}>
        <span className="text-xl leading-none">
          {current} / {data.length}
        </span>
      </div>
    </div>
  );
}
