"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import axios from "axios";

type MainCategory = { id: number; name: string; path: string };
type Leaf = { id: number; name: string };
type Sub = { id: number; name: string; leaves: Leaf[] };
type MainMenu = { id: number; name: string; subs: Sub[] };

export function MainCategory() {
  const [open, setOpen] = useState(false);
  const [mainCats, setMainCats] = useState<MainCategory[]>([]);
  const [menus, setMenus] = useState<MainMenu[]>([]);
  const [cat, setCat] = useState<MainMenu | null>(null);
  const [sub, setSub] = useState<Sub | null>(null);

  useEffect(() => {
    axios.get("http://localhost:8000/resources/main_category/")
      .then(r => setMainCats(r.data))
      .catch(console.error);

    Promise.all([
      axios.get("http://localhost:8000/main_menu/"),
      axios.get("http://localhost:8000/main_menu_sub/"),
      axios.get("http://localhost:8000/main_menu_leaf/")
    ]).then(([menusRes, subsRes, leavesRes]) => {
      // id로 매핑
      const subMap = new Map<number, Sub>();
      subsRes.data.forEach((s: any) => {
        subMap.set(s.id, { id: s.id, name: s.name, leaves: [] });
      });
      leavesRes.data.forEach((l: any) => {
        const sub = subMap.get(l.sub);
        if (sub) sub.leaves.push({ id: l.id, name: l.name });
      });

      const menuMap = new Map<number, MainMenu>();
      menusRes.data.forEach((m: any) => {
        menuMap.set(m.id, { id: m.id, name: m.name, subs: [] });
      });
      subsRes.data.forEach((s: any) => {
        const menu = menuMap.get(s.menu);
        const sub = subMap.get(s.id);
        if (menu && sub) menu.subs.push(sub);
      });

      setMenus(Array.from(menuMap.values()));
    });
  }, []);

  return (
    <header className="h-8 flex items-center px-4 w-7/10 mx-auto bg-white mt-5 mb-5">
      <div className="flex-1 flex justify-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <a
              href="#"
              onClick={e => { e.preventDefault(); setOpen(v => !v); setCat(null); setSub(null); }}
              className="flex items-center justify-center h-full w-[30%]"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </a>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side="bottom"
            sideOffset={12}
            className={[
              "p-0 h-[440px] overflow-hidden shadow-md rounded-r-md bg-white",
              "border border-gray-200",
              sub ? "w-[900px]" : cat ? "w-[480px]" : "w-48",
            ].join(" ")}
            onMouseLeave={() => { setOpen(false); setCat(null); setSub(null); }}
          >
            <div className="flex h-full">
              <div className="w-48 bg-gray-900 text-white border-r border-gray-200 h-full">
                {menus.map((m) => (
                  <a
                    key={m.id}
                    href="#"
                    onMouseEnter={() => { setCat(m); setSub(null); }}
                    className={[
                      "flex items-center gap-2 px-4 py-3 cursor-pointer border-b border-gray-200 transition",
                      cat?.id === m.id
                        ? "bg-white text-gray-900 font-semibold"
                        : "hover:bg-gray-800 hover:text-white",
                    ].join(" ")}
                  >
                    <span className="truncate">{m.name}</span>
                  </a>
                ))}
              </div>
              {cat && (
                <div className="flex-1 flex">
                  <div className={[
                    sub ? "w-1/3" : "w-full",
                    "overflow-y-auto bg-white h-full",
                    !sub ? "border-r border-gray-200" : "",
                  ].join(" ")}>
                    {(cat.subs || []).map((s) => (
                      <a
                        key={s.id}
                        href="#"
                        onMouseEnter={() => setSub(s)}
                        className={[
                          "block px-6 py-3 cursor-pointer border-b border-gray-100 transition",
                          sub?.id === s.id
                            ? "bg-gray-100 text-gray-900 font-semibold"
                            : "hover:bg-gray-50 hover:text-black",
                        ].join(" ")}
                      >
                        {s.name}
                      </a>
                    ))}
                  </div>
                  {sub && (
                    <div className="w-2/3 overflow-y-auto bg-white h-full border-l border-gray-100">
                      <ul className="grid grid-cols-2 gap-x-6 gap-y-2 p-6">
                        {(sub.leaves || []).map((leaf) => (
                          <li key={leaf.id} className="border-b border-gray-100 pb-2">
                            <a
                              href="#"
                              className="text-sm hover:underline hover:text-black text-gray-700 transition block"
                            >
                              {leaf.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        {mainCats.map((c) =>
          c.path?.trim() ? (
            <a
              key={c.id}
              href="#"
              className="flex items-center justify-center h-full w-full text-gray-800 hover:underline"
            >
              <Image src={c.path} alt={c.name} width={16} height={16} className="mr-1" />
              {c.name}
            </a>
          ) : (
            <a
              key={c.id}
              href="#"
              className="flex items-center justify-center h-full w-full text-gray-800 hover:underline"
            >
              {c.name}
            </a>
          )
        )}
      </div>
    </header>
  );
}
