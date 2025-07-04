"use client";

import { useEffect, useState, useCallback } from "react";
import { Menu } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import axios from "axios";

type ProductCategory = {
    id: number;
    name: string;
    parent: number | null;
    depth: number;
    subcategories?: ProductCategory[];
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function MainMenuPopover() {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [cat, setCat] = useState<ProductCategory | null>(null);
    const [sub, setSub] = useState<ProductCategory | null>(null);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/products/categories/`)
            .then(res => setCategories(res.data));
    }, []);

    const categoryTree = useCallback(() => {
        const map: { [key: number]: ProductCategory } = {};
        const roots: ProductCategory[] = [];
        categories.forEach(c => { map[c.id] = { ...c, subcategories: [] }; });
        categories.forEach(c => c.parent ? map[c.parent]?.subcategories?.push(map[c.id]) : roots.push(map[c.id]));
        return roots;
    }, [categories])();

    const close = () => { setOpen(false); setCat(null); setSub(null); };

    return (
        <div className="flex justify-center items-center h-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setOpen((v) => !v);
                            setCat(null);
                            setSub(null);
                        }}
                        className="w-full h-full flex flex-col items-center justify-center hover:bg-gray-200 transition"
                    >
                        <Menu className="w-6 h-6 text-gray-700" />
                        <span className="mt-1 text-xs text-gray-700">메뉴</span>
                    </a>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    side="bottom"
                    sideOffset={8}
                    className={`${sub ? "w-[900px]" : cat ? "w-[480px]" : "w-44"} p-0 m-0 overflow-hidden shadow-lg border border-gray-200 z-50`}
                    onMouseLeave={close}
                >
                    <div className="flex h-full">
                        <div className="w-44 bg-white text-black">
                            {categoryTree.map(m => (
                                <a key={m.id} href="#"
                                    onMouseEnter={() => { setCat(m); setSub(null); }}
                                    className={[
                                        "flex items-center gap-2 px-4 py-3 cursor-pointer border-b border-gray-200 transition",
                                        cat?.id === m.id ? "bg-white text-gray-900 font-semibold"
                                            : "hover:bg-gray-800 hover:text-white"
                                    ].join(" ")}>   
                                    <span className="truncate">{m.name}</span>
                                </a>
                            ))}
                        </div>
                        {cat && (
                            <div className="flex-1 flex">
                                <div className={`${sub ? "w-1/3" : "w-full"} overflow-y-auto bg-white ${!sub ? "border-r border-gray-200" : ""}`}>
                                    {(cat.subcategories || []).map(s => (
                                        <a key={s.id} href="#"
                                            onMouseEnter={() => setSub(s)}
                                            className={[
                                                "block px-6 py-3 cursor-pointer border-b border-gray-100 transition",
                                                sub?.id === s.id ? "bg-gray-100 text-gray-900 font-semibold"
                                                    : "hover:bg-gray-50 hover:text-black"
                                            ].join(" ")}
                                        >{s.name}</a>
                                    ))}
                                </div>
                                {sub && (
                                    <div className="w-2/3 overflow-y-auto bg-white border-l border-gray-100">
                                        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 p-6">
                                            {(sub.subcategories || []).map(f => (
                                                <li key={f.id} className="border-b border-gray-100 pb-2">
                                                    <a href="#" className="text-sm hover:underline hover:text-black text-gray-700 transition block">
                                                        {f.name}
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
        </div>
    );
}
