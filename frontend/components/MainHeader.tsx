// components/MainHeader.tsx
import { Menu, Search, Heart, ShoppingCart, Bell, User, Bot } from "lucide-react";

export function MainHeader() {
  return (
    <header className="h-18 flex items-center px-4 w-4/5 mx-auto bg-white">
      <div className="flex items-center justify-center flex-[1]">
        <Bot className="w-6 h-6 text-gray-600" />
      </div>
      <div className="flex items-center justify-center  flex-[5]">
        <form className="flex w-[90%] h-10">
              <select className="h-full px-3 bg-gray-200 text-gray-700 text-sm border-none rounded-l-md focus:ring-0 focus:outline-none">
                <option>All</option>
                <option>Books</option>
                <option>Electronics</option>
              </select>
              <input
                type="text"
                placeholder="Search Amazon"
                className="flex-1 h-full px-3 bg-gray-50 text-gray-700 text-base border-none focus:ring-0 focus:outline-none"
              />
              <button
                type="submit"
                className="h-full w-12 flex items-center justify-center bg-amber-300 hover:bg-amber-400 text-gray-800 rounded-r-md transition"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
      </div>
      <div className="flex-[3] flex h-full">
        <div className="flex-1 flex justify-center items-center">
          <Heart className="w-7 h-7 text-gray-500" />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <ShoppingCart className="w-7 h-7 text-gray-500" />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Bell className="w-7 h-7 text-gray-500" />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <User className="w-7 h-7 text-gray-500" />
        </div>
      </div>
    </header>
  );
}
