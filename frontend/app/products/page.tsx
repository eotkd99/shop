"use client";

import "@/app/globals.css";
import { useState, useEffect } from "react";
import axios from "axios";
import CategorySidebar from "@/components/products/CategorySidebar";
import FilterSidebar from "@/components/products/FilterSidebar";
import ProductGrid from "@/components/products/ProductGrid";
import { Category, FilterType, Product } from "@/types/products";

const SORTS = [
  { id: "ranking", label: "쿠팡 랭킹순" },
  { id: "low_price", label: "낮은가격순" },
  { id: "high_price", label: "높은가격순" },
  { id: "sales", label: "판매량순" },
  { id: "new", label: "최신순" },
];

function buildCategoryTree(flatList: Category[]): Category[] {
  const map = new Map<number, Category & { children?: Category[] }>();
  flatList.forEach((cat) => map.set(cat.id, { ...cat, children: [] }));
  const tree: Category[] = [];
  flatList.forEach((cat) => {
    if (cat.parent) {
      const parent = map.get(cat.parent);
      if (parent) parent.children!.push(map.get(cat.id)!);
    } else {
      tree.push(map.get(cat.id)!);
    }
  });
  return tree;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesTree, setCategoriesTree] = useState<Category[]>([]);
  const [filterTypes, setFilterTypes] = useState<FilterType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // 대분류별 필터 상태: { filterTypeName: [filterValueId, ...], ... }
  const [selectedFilters, setSelectedFilters] = useState<Record<string, number[]>>({});
  const [sort, setSort] = useState("ranking");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [catRes, filtRes] = await Promise.all([
          api.get("/api/products/categories/"),
          api.get("/api/products/filter-types/"),
        ]);
        setCategories(catRes.data);
        setCategoriesTree(buildCategoryTree(catRes.data));
        setFilterTypes(filtRes.data);
      } catch {
        setCategories([]);
        setCategoriesTree([]);
        setFilterTypes([]);
      }
    }
    loadMeta();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory.toString());

      Object.entries(selectedFilters).forEach(([filterType, ids]) => {
        ids.forEach((id) => {
          params.append(`filter_${filterType}`, id.toString());
        });
      });

      params.append("sort", sort);

      try {
        const res = await api.get(`/api/products/products/?${params.toString()}`);
        setProducts(Array.isArray(res.data) ? res.data : res.data.results ?? []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory, selectedFilters, sort]);

  function onFilterChange(filterType: string, filterValueId: number, checked: boolean) {
    setSelectedFilters((prev) => {
      const prevValues = prev[filterType] || [];
      let newValues: number[];
      if (checked) {
        if (!prevValues.includes(filterValueId)) {
          newValues = [...prevValues, filterValueId];
        } else {
          newValues = prevValues;
        }
      } else {
        newValues = prevValues.filter((id) => id !== filterValueId);
      }
      return { ...prev, [filterType]: newValues };
    });
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto flex flex-col py-8 px-6">
        <div className="flex flex-row gap-8">
          <aside className="w-[270px] flex-shrink-0 bg-white rounded-2xl shadow p-5 h-fit sticky top-8">
            <CategorySidebar
              categories={categoriesTree}
              onSelect={setSelectedCategory}
              selectedId={selectedCategory}
            />
            <FilterSidebar
              filterTypes={filterTypes}
              selectedFilters={selectedFilters}
              onFilterChange={onFilterChange}
            />
          </aside>
          <main className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-3">
              {SORTS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSort(opt.id)}
                  className={
                    "px-3 py-1 rounded-full text-[15px] font-semibold border transition-colors " +
                    (sort === opt.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-100")
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <ProductGrid products={products} loading={loading} />
          </main>
        </div>
      </div>
    </div>
  );
}
