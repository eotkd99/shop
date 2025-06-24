// components/HamburgerMenu.tsx
import { X, ChevronRight, ArrowLeft, User } from "lucide-react";

import { useState } from "react";

const mainMenu = [
  {
    title: "Digital Content & Devices",
    items: [
      { name: "Prime Video", submenu: [
        "All Videos", "Included with Prime", "Prime Video Channels", "Rent or Buy",
        "Your Watchlist", "Purchases & Rentals", "Watch Anywhere", "Getting Started"
      ]},
      { name: "Amazon Music" },
      { name: "Kindle E-readers & Books" },
      { name: "Amazon Appstore" },
    ]
  },
  {
    title: "Shop by Department",
    items: [
      { name: "Electronics" },
      { name: "Computers" },
      { name: "Smart Home" },
      { name: "Arts & Crafts" },
      { name: "See all" },
    ]
  },
  {
    title: "Programs & Features",
    items: [
      { name: "Gift Cards" },
      { name: "Shop By Interest" },
      { name: "Amazon Live" },
      { name: "International Shopping" },
      { name: "See all" },
    ]
  }
];

export function HamburgerMenu({ open, setOpen }: { open: boolean, setOpen: (o: boolean) => void }) {
  const [submenu, setSubmenu] = useState<{ name: string, submenu: string[] } | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex">
      {/* 오버레이 영역 */}
      <div className="bg-white w-[350px] max-w-full h-full shadow-xl overflow-y-auto">
        {/* 상단 */}
        <div className="bg-gray-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-lg">
            <span className="rounded-full bg-gray-700 p-2">
              <User className="w-5 h-5" />
            </span>
            Hello, sign in
          </div>
          <button onClick={() => { setOpen(false); setSubmenu(null); }}>
            <X className="w-7 h-7" />
          </button>
        </div>
        {/* 상세 메뉴(서브메뉴) */}
        {submenu ? (
          <div>
            <div className="flex items-center gap-2 px-5 py-3 border-b bg-gray-100 font-semibold">
              <button onClick={() => setSubmenu(null)}>
                <ArrowLeft className="inline-block w-4 h-4 mr-1" />
              </button>
              MAIN MENU
            </div>
            <div className="font-bold px-5 py-4 text-lg border-b">{submenu.name}</div>
            <ul className="px-7 py-3 space-y-3">
              {submenu.submenu.map((s, idx) => (
                <li key={idx} className="hover:underline">{s}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            {/* 전체 메뉴 */}
            {mainMenu.map((group, i) => (
              <div key={i} className="border-b py-3">
                <div className="font-bold px-5 pb-2">{group.title}</div>
                <ul>
                  {group.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-center justify-between px-7 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => item.submenu ? setSubmenu(item as any) : undefined}
                    >
                      {item.name}
                      {item.submenu && <ChevronRight className="w-4 h-4" />}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 메뉴 밖 클릭시 닫기 */}
      <div className="flex-1" onClick={() => { setOpen(false); setSubmenu(null); }} />
    </div>
  );
}
