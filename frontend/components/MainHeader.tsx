import { Search, Heart, ShoppingCart, Bell, User, Bot } from "lucide-react";

export function MainHeader() {
  return (
    <div>
      <header className="h-24 mt-5 flex items-center px-4 w-7/10 mx-auto bg-white">
        <div className="flex items-center justify-center flex-[2]">
          <img
            src="/Logo.png"
            alt="메뉴"
            className="w-30 h-30 object-contain block"
          />
        </div>
        <div className="flex items-center justify-center  flex-[6]">
          <form className="flex w-[80%] h-10">
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
        <div className="flex-[2] flex h-full">
          <div className="flex-1 flex flex-col items-center justify-center">
            <Heart className="w-6 h-6 text-gray-500" />
            <span className="text-xs text-gray-600 mt-1">찜</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-gray-500" />
            <span className="text-xs text-gray-600 mt-1">장바구니</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <Bell className="w-6 h-6 text-gray-500" />
            <span className="text-xs text-gray-600 mt-1">알림</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <User className="w-6 h-6 text-gray-500" />
            <span className="text-xs text-gray-600 mt-1">마이</span>
          </div>
        </div>
      </header>
    </div>
  );
}
