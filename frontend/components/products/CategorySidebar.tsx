import React, { useState } from "react";
import { Category } from "@/types/products";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CategorySidebar({
  categories,
  onSelect,
  selectedId,
}: {
  categories: Category[];
  onSelect: (id: number) => void;
  selectedId: number | null;
}) {
  const [open1, setOpen1] = useState<number | null>(null);
  const [open2, setOpen2] = useState<number | null>(null);

  return (
    <div>
      <h3 className="font-semibold mb-2 text-base">카테고리</h3>
      <ul>
        {categories.map(cat1 => (
          <li key={cat1.id}>
            <div className="flex items-center">
              <button
                className={
                  "w-full text-left px-2 py-1 rounded transition-colors flex justify-between items-center " +
                  (open1 === cat1.id
                    ? "font-bold text-blue-700 bg-blue-50"
                    : "text-gray-900 hover:bg-gray-100")
                }
                onClick={() => {
                  if (open1 === cat1.id) {
                    setOpen1(null);
                  } else {
                    setOpen1(cat1.id);
                  }
                  onSelect(cat1.id);
                  setOpen2(null);
                }}
              >
                <span>{cat1.name}</span>
                {cat1.children && cat1.children.length > 0 && open1 !== null && cat1.id === open1 && (
                  <span className="ml-2"><ChevronUp size={18} /></span>
                )}
                {cat1.children && cat1.children.length > 0 && open1 !== null && cat1.id !== open1 && (
                  <span className="ml-2"><ChevronDown size={18} /></span>
                )}
              </button>
            </div>
            {open1 === cat1.id && cat1.children && (
              <ul className="pl-4">
                {cat1.children.map(cat2 => (
                  <li key={cat2.id}>
                    <div className="flex items-center">
                      <button
                        className={
                          "w-full text-left px-2 py-1 rounded transition-colors flex justify-between items-center " +
                          (open2 === cat2.id
                            ? "font-bold text-blue-600 bg-blue-100"
                            : "text-gray-800 hover:bg-gray-100")
                        }
                        onClick={() => {
                          if (open2 === cat2.id) {
                            setOpen2(null);
                          } else {
                            setOpen2(cat2.id);
                          }
                          onSelect(cat2.id);
                        }}
                      >
                        <span>{cat2.name}</span>
                        {cat2.children && cat2.children.length > 0 && open2 !== null && cat2.id === open2 && (
                          <span className="ml-2"><ChevronUp size={16} /></span>
                        )}
                        {cat2.children && cat2.children.length > 0 && open2 !== null && cat2.id !== open2 && (
                          <span className="ml-2"><ChevronDown size={16} /></span>
                        )}
                      </button>
                    </div>
                    {open2 === cat2.id && cat2.children && (
                      <ul className="pl-4">
                        {cat2.children.map(cat3 => (
                          <li key={cat3.id}>
                            <button
                              className={
                                "w-full text-left px-2 py-1 rounded transition-colors " +
                                (selectedId === cat3.id
                                  ? "font-bold text-blue-600 bg-blue-200"
                                  : "text-gray-700 hover:bg-gray-100")
                              }
                              onClick={() => onSelect(cat3.id)}
                            >
                              {cat3.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
