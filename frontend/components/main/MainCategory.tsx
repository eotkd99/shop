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

type MainCategory = {
  id: number;
  name: string;
  image: string;
  alt_text: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"; // 환경 변수 처리

export function MainCategory() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [cat, setCat] = useState<ProductCategory | null>(null);
  const [sub, setSub] = useState<ProductCategory | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRes = await axios.get(`${BASE_URL}/api/products/categories/`);
        setCategories(categoriesRes.data);
        
        const mainCategoriesRes = await axios.get(`${BASE_URL}/api/main/resources/main_category/`);
        setMainCategories(mainCategoriesRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const buildCategoryTree = useCallback((categories: ProductCategory[]) => {
    const categoryMap: { [key: number]: ProductCategory } = {};
    const rootCategories: ProductCategory[] = [];

    categories.forEach((category) => {
      categoryMap[category.id] = category;
      category.subcategories = [];
    });

    categories.forEach((category) => {
      if (category.parent) {
        categoryMap[category.parent]?.subcategories?.push(category);
      } else {
        rootCategories.push(category);
      }
    });

    return rootCategories;
  }, []);

  const categoryTree = buildCategoryTree(categories);

  const handleCategoryMouseEnter = (category: ProductCategory) => {
    setCat(category);
    setSub(null);
  };

  const handleSubcategoryMouseEnter = (subcategory: ProductCategory) => {
    setSub(subcategory);
  };

  const handlePopoverClose = () => {
    setOpen(false);
    setCat(null);
    setSub(null);
  };

  return (
    <header className="flex flex-col justify-center items-center px-4 w-7/10 mx-auto mt-5 mb-5">
      <div className="w-full flex justify-between items-center">
        <div className="w-1/10 flex justify-center">
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
                className="flex items-center justify-center"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </a>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side="bottom"
              sideOffset={12}
              className={[sub ? "w-[900px]" : cat ? "w-[480px]" : "w-48", "p-0 m-0"].join(" ")}
              onMouseLeave={handlePopoverClose}
            >
              <div className="flex h-full">
                <div className="w-48 bg-white text-black border-r border-gray-200">
                  {categoryTree.map((m) => (
                    <a
                      key={m.id}
                      href="#"
                      onMouseEnter={() => handleCategoryMouseEnter(m)}
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
                    <div className={[sub ? "w-1/3" : "w-full", "overflow-y-auto bg-white", !sub ? "border-r border-gray-200" : ""].join(" ")}>
                      {(cat.subcategories || []).map((s) => (
                        <a
                          key={s.id}
                          href="#"
                          onMouseEnter={() => handleSubcategoryMouseEnter(s)}
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
                      <div className="w-2/3 overflow-y-auto bg-white border-l border-gray-100">
                        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 p-6">
                          {(sub.subcategories || []).map((filterType) => (
                            <li key={filterType.id} className="border-b border-gray-100 pb-2">
                              <a
                                href="#"
                                className="text-sm hover:underline hover:text-black text-gray-700 transition block"
                              >
                                {filterType.name}
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

        <div className="w-9/10 flex justify-evenly items-center gap-4">
          {mainCategories.slice(0, 6).map((category, index) => (
            <div key={category.id} className="w-[120px] h-[30px] border border-gray-200 rounded-md flex items-center justify-center bg-gray-100">
              <img src={category.image} alt={category.alt_text} className="w-[25px] h-[25px] object-contain" />
              <span className="text-center text-sm ml-2">{`카테고리 ${index + 1}`}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
