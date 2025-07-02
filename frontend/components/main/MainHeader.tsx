"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Heart, ShoppingCart, Bell, User, LogOut, UserPlus } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type LogoResource = {
  id: number;
  name: string;
  path: string;
};

export function MainHeader() {
  const [logo, setLogo] = useState<LogoResource | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 로고 데이터 가져오기
    axios
      .get("http://localhost:8000/api/main_resources/logo")
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setLogo(response.data[0]);
        }
      })
      .catch((error) => console.error("Error fetching logo:", error));

    // 인증 상태 확인
    const checkAuthentication = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/check-auth/", {
          withCredentials: true, // 쿠키 전송
        });
        setIsAuthenticated(res.data.isAuthenticated);
      } catch (error) {
        // 인증되지 않은 경우에는 초기 상태 (로그인 필요)
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/logout/",
        {},
        { withCredentials: true } // 로그아웃 요청 시 쿠키 포함
      );
      setIsAuthenticated(false); // 로그아웃 후 인증 상태 false
      window.location.href = "/"; // 홈으로 리다이렉트
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <header className="h-20 mt-5 flex items-center px-4 w-7/10 mx-auto bg-white">
        <div className="flex items-center justify-center flex-[2] h-20 w-full overflow-hidden">
          {logo ? (
            <a href="/" className="w-full h-full">
              <img
                src={logo.path}
                alt={logo.name}
                className="w-full max-w-[90%] object-contain block"
              />
            </a>
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          )}
        </div>

        <div className="flex items-center justify-center flex-[6]">
          <form className="flex w-[85%] h-10 border border-gray-300 rounded-md bg-white overflow-hidden shadow-sm">
            <Select defaultValue="all" onValueChange={() => {}}>
              <SelectTrigger className="h-full px-3 text-gray-800 text-sm bg-white border-none focus:ring-0 focus:outline-none transition cursor-pointer min-w-[100px] rounded-none">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
              </SelectContent>
            </Select>
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
          {!isAuthenticated ? (
            <>
              <a
                href="/login"
                className="flex-1 flex flex-col items-center justify-center"
              >
                <User className="w-6 h-6 text-gray-500" />
                <span className="text-xs text-gray-600 mt-1">로그인</span>
              </a>
              <a
                href="/join"
                className="flex-1 flex flex-col items-center justify-center"
              >
                <UserPlus className="w-6 h-6 text-gray-500" />
                <span className="text-xs text-gray-600 mt-1">회원가입</span>
              </a>
            </>
          ) : (
            <>
              <a
                href="/wish"
                className="flex-1 flex flex-col items-center justify-center"
              >
                <Heart className="w-6 h-6 text-gray-500" />
                <span className="text-xs text-gray-600 mt-1">찜</span>
              </a>
              <a
                href="/cart"
                className="flex-1 flex flex-col items-center justify-center"
              >
                <ShoppingCart className="w-6 h-6 text-gray-500" />
                <span className="text-xs text-gray-600 mt-1">장바구니</span>
              </a>
              <a
                href="/alarm"
                className="flex-1 flex flex-col items-center justify-center"
              >
                <Bell className="w-6 h-6 text-gray-500" />
                <span className="text-xs text-gray-600 mt-1">알림</span>
              </a>
              <a
                href="/account"
                className="flex-1 flex flex-col items-center justify-center"
              >
                <User className="w-6 h-6 text-gray-500" />
                <span className="text-xs text-gray-600 mt-1">마이</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex-1 flex flex-col items-center justify-center hover:bg-gray-50 transition"
                style={{
                  border: "none",
                  background: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                }}
              >
                <LogOut className="w-6 h-6 text-gray-500" />
                <span className="text-xs text-gray-600 mt-1">로그아웃</span>
              </button>
            </>
          )}
        </div>
      </header>
      <hr className="w-14/20 mx-auto my-4 border-gray-200" />
    </div>
  );
}
