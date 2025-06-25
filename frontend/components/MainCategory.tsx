"use client";

import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

type MainCategory = { id: number; name: string; path: string };
type Leaf = { id: string; name: string };
type Sub = { id: number; name: string; leaves: Leaf[] };
type MainMenu = { id: number; name: string; icon_name: string; subs: Sub[] };

export function MainCategory() {
  const [open, setOpen] = useState(false);
  const [mainCats, setMainCats] = useState<MainCategory[]>([]);
  const [menus, setMenus] = useState<MainMenu[]>([]);
  const [cat, setCat] = useState<MainMenu | null>(null);
  const [sub, setSub] = useState<Sub | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/resources/main_grid_panel/")
      .then(r => r.json())
      .then(setMainCats);
    fetch("http://localhost:8000/api/main_menu/")
      .then(r => r.json())
      .then(setMenus);
  }, []);

  return (
    <header className="h-8 flex items-center px-4 w-7/10 mx-auto bg-white mt-5 mb-5">
      <div className="flex-1 flex justify-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setOpen(o => !o);
                setCat(null);
                setSub(null);
              }}
              className="flex items-center justify-center h-full w-[50%]"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </a>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            side="bottom"
            sideOffset={12}
            className={[
              "p-0 h-[460px] overflow-hidden border-0 shadow-md rounded-r-md",
              sub ? "w-[900px]" : cat ? "w-[480px]" : "w-48"
            ].join(" ")}
            onMouseLeave={() => {
              setOpen(false);
              setCat(null);
              setSub(null);
            }}
          >
            <div className="flex h-full">
              {/* 1st column: main menu */}
              <div className="w-48 bg-emerald-600 text-white">
                {menus.map(m => {
                  const Icon = LucideIcons[m.icon_name as keyof typeof LucideIcons] as React.ComponentType<any>;
                  return (
                    <a
                      key={m.id}
                      href="#"
                      onMouseEnter={() => {
                        setCat(m);
                        setSub(null);
                      }}
                      className={[
                        "flex items-center gap-2 px-4 py-3 cursor-pointer",
                        cat?.id === m.id ? "bg-white text-emerald-600" : ""
                      ].join(" ")}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      <span className="truncate">{m.name}</span>
                    </a>
                  );
                })}
              </div>
              {/* 2nd column: sub menu */}
              {cat && (
                <div className="flex-1 flex">
                  <div className={sub ? "w-1/3 overflow-y-auto bg-white" : "w-full overflow-y-auto bg-white"}>
                    {cat.subs.map(s => (
                      <a
                        key={s.id}
                        href="#"
                        onMouseEnter={() => setSub(s)}
                        className={[
                          "block px-6 py-3 cursor-pointer",
                          sub?.id === s.id ? "bg-gray-100 text-emerald-600" : ""
                        ].join(" ")}
                      >
                        {s.name}
                      </a>
                    ))}
                  </div>
                  {/* 3rd column: leaf menu */}
                  {sub && (
                    <div className="w-2/3 overflow-y-auto bg-white">
                      <ul className="grid grid-cols-2 gap-x-6 gap-y-2 p-6">
                        {sub.leaves.map(leaf => (
                          <li key={leaf.id}>
                            <a href="#" className="text-sm hover:underline block">
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

        {/* Main category icons */}
        {mainCats.map(c =>
          c.path?.trim() ? (
            <a
              key={c.id}
              href="#"
              className="flex items-center justify-center h-full w-full"
            >
              <Image
                src={c.path}
                alt={c.name}
                width={16}
                height={16}
                className="mr-1"
              />
              {c.name}
            </a>
          ) : (
            <a
              key={c.id}
              href="#"
              className="flex items-center justify-center h-full w-full"
            >
              {c.name}
            </a>
          )
        )}
      </div>
    </header>
  );
}
