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
                        onClick={e => {
                            e.preventDefault();
                            setOpen(v => !v);
                            setCat(null);
                            setSub(null);
                        }}
                        className="w-full h-full flex flex-col items-center justify-center hover:bg-gray-100 rounded-md transition"
                    >
                        <Menu className="w-6 h-6 ttext-black" />
                        <span className="mt-1 text-xs text-black font-semibold">메뉴</span>
                    </a>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    side="bottom"
                    sideOffset={8}
                    className={`
                        ${sub ? "w-[900px]" : cat ? "w-[480px]" : "w-56"}
                        bg-white rounded-2xl shadow-2xl border-0 p-2 m-0 z-50
                        transition-all
                    `}
                    onMouseLeave={close}
                >
                    <div className="flex h-full gap-2">
                        <div className="w-56 bg-gray-50 rounded-xl shadow-md p-2 flex flex-col gap-1">
                            {categoryTree.map(m => (
                                <a
                                    key={m.id}
                                    href="#"
                                    onMouseEnter={() => { setCat(m); setSub(null); }}
                                    className={[
                                        "flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer font-medium transition",
                                        cat?.id === m.id
                                            ? "bg-indigo-600 text-white shadow"
                                            : "bg-white hover:bg-indigo-50 text-gray-900"
                                    ].join(" ")}
                                >
                                    <span className="truncate">{m.name}</span>
                                </a>
                            ))}
                        </div>
                        {cat && (
                            <div className="flex-1 flex gap-2">
                                <div className={[
                                    sub ? "w-1/3" : "w-full",
                                    "bg-gray-50 rounded-xl shadow-md p-2 flex flex-col gap-1",
                                    !sub ? "border-r border-gray-100" : ""
                                ].join(" ")}>
                                    {(cat.subcategories || []).map(s => (
                                        <a
                                            key={s.id}
                                            href="#"
                                            onMouseEnter={() => setSub(s)}
                                            className={[
                                                "block px-6 py-2 rounded-lg cursor-pointer transition font-medium",
                                                sub?.id === s.id
                                                    ? "bg-indigo-100 text-indigo-800 shadow"
                                                    : "bg-white hover:bg-indigo-50 text-gray-900"
                                            ].join(" ")}
                                        >{s.name}</a>
                                    ))}
                                </div>
                                {sub && (
                                    <div className="w-2/3 bg-gray-50 rounded-xl shadow-md p-4 border-l border-gray-100">
                                        <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                                            {(sub.subcategories || []).map(f => (
                                                <li key={f.id}>
                                                    <a
                                                        href="#"
                                                        className="block text-sm font-medium text-gray-800 bg-white rounded-md px-3 py-2 hover:bg-indigo-50 hover:text-indigo-800 transition"
                                                    >
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
