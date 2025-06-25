"use client";
import { useEffect, useState } from "react";
import { Search, Heart, ShoppingCart, Bell, User } from "lucide-react";

type LogoResource = {
  id: number;
  name: string;
  path: string;
};

export function MainHeader() {
  const [logo, setLogo] = useState<LogoResource | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/resources/main_logo/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLogo(data[0]);
        }
      });
  }, []);

  return (
    <div>
      <header className="h-24 mt-5 flex items-center px-4 w-7/10 mx-auto bg-white">
        <div className="flex items-center justify-center flex-[2] h-full">
          {logo ? (
            <img
              src={logo.path}
              alt={logo.name}
              className="max-w-full max-h-full w-auto h-20 object-contain block"
              draggable={false}
            />
          ) : (
            <div className="w-32 h-20 bg-gray-200 animate-pulse" />
          )}
        </div>
        <div className="flex items-center justify-center flex-[6]">
          <form className="flex w-[80%] h-10 border border-gray-300 rounded-md bg-white overflow-hidden">
            <select className="h-full px-3 bg-white text-gray-700 text-sm border-none focus:ring-0 focus:outline-none">
              <option>All</option>
              <option>Books</option>
              <option>Electronics</option>
            </select>
            <input
              type="text"
              placeholder="Search Amazon"
              className="flex-1 h-full px-3 bg-white text-gray-700 text-base border-none focus:ring-0 focus:outline-none"
            />
            <button
              type="submit"
              className="h-full w-12 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 transition cursor-pointer border-l border-gray-300"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="flex-[2] flex h-full">
          <a href="" className="flex-1 flex flex-col items-center justify-center">
            <Heart className="w-6 h-6 text-gray-500" />
            <span className="text-xs text-gray-600 mt-1">찜</span>
          </a>
          <a href="" className="flex-1 flex flex-col items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-gray-500" />
            <span className="text-xs text-gray-600 mt-1">장바구니</span>
          </a>
          <a href="" className="flex-1 flex flex-col items-center justify-center">
            <Bell className="w-6 h-6 text-gray-500" />
            <span className="text-xs text-gray-600 mt-1">알림</span>
          </a>
          <a href="" className="flex-1 flex flex-col items-center justify-center">
            <User className="w-6 h-6 text-gray-500" />
            <span className="text-xs text-gray-600 mt-1">마이</span>
          </a>
        </div>
      </header>
      <hr className="w-7/10 mx-auto my-4 border-gray-200" />
    </div>
  );
}
