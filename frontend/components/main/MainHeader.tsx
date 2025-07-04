"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Heart, ShoppingCart, Bell, User, LogOut, UserPlus } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

type LogoResource = { id: number; name: string; path: string };

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function MainHeader() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, setAuthenticated, logout, searchKeyword, setSearchKeyword, depthOneCategories, setDepthOneCategories } = useUserStore();

  const [logo, setLogo] = useState<LogoResource | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchKeyword);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoriesForSelect, setCategoriesForSelect] = useState([{ value: "all", label: "All" }]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/main/resources/logo`);
        if (Array.isArray(res.data) && res.data.length > 0) setLogo(res.data[0]);
      } catch { }
      try {
        const res = await axios.get(`${BASE_URL}/api/users/check-auth/`, { withCredentials: true });
        setUser(res.data.user || null);
        setAuthenticated(res.data.isAuthenticated);
      } catch {
        setUser(null);
        setAuthenticated(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (depthOneCategories.length > 0) {
      const opts = depthOneCategories.map(cat => ({ value: String(cat.id), label: cat.name }));
      setCategoriesForSelect([{ value: "all", label: "All" }, ...opts]);
    } else {
      axios.get(`${BASE_URL}/api/products/categories/depth-one/`).then(res => {
        const data = res.data ?? [];
        setDepthOneCategories(data);
        const opts = data.map((cat: { id: number; name: string }) => ({ value: String(cat.id), label: cat.name }));
        setCategoriesForSelect([{ value: "all", label: "All" }, ...opts]);
      }).catch(() => {
        setDepthOneCategories([]);
        setCategoriesForSelect([{ value: "all", label: "All" }]);
      });
    }
  }, [depthOneCategories]);

  useEffect(() => {
    setSearchQuery(searchKeyword);
  }, [searchKeyword]);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/users/logout/`, {}, { withCredentials: true });
      logout();
      router.push("/");
    } catch { }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const kw = searchQuery.trim();
    if (!kw && selectedCategory === "all") return;
    const query: Record<string, string> = {};
    if (kw) query.search = kw;
    if (selectedCategory !== "all") query.category = selectedCategory;
    router.push(`/products?${new URLSearchParams(query).toString()}`);
  };

  const AuthLinks = () => (
    <div className="flex gap-2">
      <a href="/login" className="flex flex-col items-center justify-center w-20 h-16 bg-white rounded-md hover:shadow-md transition">
        <User className="w-6 h-6 text-gray-600 mb-1" />
        <span className="text-xs text-gray-700">로그인</span>
      </a>
      <a href="/join" className="flex flex-col items-center justify-center w-20 h-16 bg-white rounded-md hover:shadow-md transition">
        <UserPlus className="w-6 h-6 text-gray-600 mb-1" />
        <span className="text-xs text-gray-700">회원가입</span>
      </a>
    </div>
  );

  const AuthenticatedLinks = () => (
    <div className="flex w-[80%] h-16">
      <a href="/account" className="flex flex-col items-center justify-center w-20 bg-white rounded-md hover:shadow-md transition">
        <User className="w-6 h-6 text-gray-600 mb-1" />
        <span className="text-xs text-gray-700">마이</span>
      </a>
      <a href="/alarm" className="flex flex-col items-center justify-center w-20 bg-white rounded-md hover:shadow-md transition">
        <Bell className="w-6 h-6 text-gray-600 mb-1" />
        <span className="text-xs text-gray-700">알림</span>
      </a>
      <a href="/cart" className="flex flex-col items-center justify-center w-20 bg-white rounded-md hover:shadow-md transition">
        <ShoppingCart className="w-6 h-6 text-gray-600 mb-1" />
        <span className="text-xs text-gray-700">장바구니</span>
      </a>
      <button
        onClick={handleLogout}
        className="flex flex-col items-center justify-center w-20 bg-white rounded-md hover:shadow-md transition"
      >
        <LogOut className="w-6 h-6 text-gray-600 mb-1" />
        <span className="text-xs text-gray-700">로그아웃</span>
      </button>
    </div>
  );
  return (
    <header className="flex overflow-hidden items-center w-full h-25 bg-gradient-to-b from-white to-gray-50 shadow-sm">
      <div className="flex-[2.5] items-center justify-center h-20 w-fit px-2">
        {logo ? (
          <a href="/" className="h-full flex items-center justify-center">
            <img src={logo.path} alt={logo.name} className="h-[70%] object-contain transition-transform hover:scale-105" />
          </a>
        ) : <div className="w-full h-full bg-gray-200 animate-pulse" />}
      </div>
      <div className="flex items-center justify-center flex-[5]">
        <form onSubmit={handleSearchSubmit} className="flex w-[95%] h-10 border border-gray-300 rounded-md bg-white overflow-hidden shadow-sm">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="min-w-[100px] h-full px-3 text-gray-800 text-sm bg-white border-none focus:ring-0 focus:outline-none transition cursor-pointer rounded-none">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              {categoriesForSelect.map(cat => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <input type="text" placeholder="Search" className="flex-1 h-full px-3 bg-white text-gray-700 text-base border-none focus:ring-0 focus:outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <button type="submit" className="h-full w-12 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 transition cursor-pointer border-l border-gray-300">
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>
      <div className="flex-[2.5] flex items-center justify-evenly h-full">
        {!isAuthenticated ? <AuthLinks /> : <AuthenticatedLinks />}
      </div>
    </header>
  );
}
