"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Package } from "lucide-react";
import { Select, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select";

type MainMenu = { id: number; name: string };
type MainMenuSub = { id: number; seq: number; name: string; menu: number };
type MainMenuLeaf = { id: number; seq: number; name: string; sub: number };

type Filters = {
  mainMenu: string;
  mainMenuSub: string;
  mainMenuLeaf: string;
  status: string;
  rating: string;
  priceOrder: string;
};

const ProductsList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [mainMenus, setMainMenus] = useState<MainMenu[]>([]);
  const [mainMenuSubs, setMainMenuSubs] = useState<MainMenuSub[]>([]);
  const [mainMenuLeaves, setMainMenuLeaves] = useState<MainMenuLeaf[]>([]);
  const [filters, setFilters] = useState<Filters>({
    mainMenu: "All",
    mainMenuSub: "All",
    mainMenuLeaf: "All",
    status: "All",
    rating: "All",
    priceOrder: "Price",
  });
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  // 1. 메인 메뉴만 최초 로딩
  useEffect(() => {
    axios.get("http://localhost:8000/main_menu/").then(r => setMainMenus(r.data));
  }, []);

  // 2. mainMenu가 변경되면 서브카테고리만 다시 불러오기, 하위 All로 리셋
  useEffect(() => {
    if (filters.mainMenu !== "All") {
      axios
        .get("http://localhost:8000/main_menu_sub/", { params: { menu_id: filters.mainMenu } })
        .then(r => setMainMenuSubs(r.data));
      setFilters((prev) => ({ ...prev, mainMenuSub: "All", mainMenuLeaf: "All" }));
    } else {
      setMainMenuSubs([]);
      setFilters((prev) => ({ ...prev, mainMenuSub: "All", mainMenuLeaf: "All" }));
    }
    setMainMenuLeaves([]);
  }, [filters.mainMenu]);

  // 3. mainMenuSub가 변경되면 리프카테고리만 다시 불러오기, 하위 All로 리셋
  useEffect(() => {
    if (filters.mainMenuSub !== "All") {
      axios
        .get("http://localhost:8000/main_menu_leaf/", { params: { sub_id: filters.mainMenuSub } })
        .then(r => setMainMenuLeaves(r.data));
      setFilters((prev) => ({ ...prev, mainMenuLeaf: "All" }));
    } else {
      setMainMenuLeaves([]);
      setFilters((prev) => ({ ...prev, mainMenuLeaf: "All" }));
    }
  }, [filters.mainMenuSub]);

  // 상품 데이터 로딩
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/products/", {
        params: {
          mainMenu: filters.mainMenu !== "All" ? filters.mainMenu : undefined,
          mainMenuSub: filters.mainMenuSub !== "All" ? filters.mainMenuSub : undefined,
          mainMenuLeaf: filters.mainMenuLeaf !== "All" ? filters.mainMenuLeaf : undefined,
          status: filters.status !== "All" ? filters.status : undefined,
          rating: filters.rating !== "All" ? filters.rating : undefined,
          ordering: filters.priceOrder !== "Price" ? filters.priceOrder : undefined,
        },
      })
      .then((r) => setProducts(r.data))
      .finally(() => setLoading(false));
  }, [filters]);

  const handleFilterChange = (value: string, name: keyof Filters) => {
    if (name === "mainMenu") {
      setFilters({
        ...filters,
        mainMenu: value,
        mainMenuSub: "All",
        mainMenuLeaf: "All",
      });
    } else if (name === "mainMenuSub") {
      setFilters({
        ...filters,
        mainMenuSub: value,
        mainMenuLeaf: "All",
      });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-x-4 flex">
          {/* 메인 카테고리 */}
          <Select value={filters.mainMenu} onValueChange={v => handleFilterChange(v, "mainMenu")}>
            <SelectTrigger>
              <span>Main Menu</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {mainMenus.map(m => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* 서브 카테고리 */}
          <Select value={filters.mainMenuSub} onValueChange={v => handleFilterChange(v, "mainMenuSub")} disabled={filters.mainMenu === "All"}>
            <SelectTrigger>
              <span>Main Menu Sub</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {mainMenuSubs.map(s => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* 리프 카테고리 */}
          <Select value={filters.mainMenuLeaf} onValueChange={v => handleFilterChange(v, "mainMenuLeaf")} disabled={filters.mainMenuSub === "All"}>
            <SelectTrigger>
              <span>Main Menu Leaf</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {mainMenuLeaves.map(l => (
                <SelectItem key={l.id} value={String(l.id)}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* 기타 필터 */}
          <Select value={filters.status} onValueChange={v => handleFilterChange(v, "status")}>
            <SelectTrigger>
              <span>Status</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="In Stock">In Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.rating} onValueChange={v => handleFilterChange(v, "rating")}>
            <SelectTrigger>
              <span>Rating</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="4.5">4.5 Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.priceOrder} onValueChange={v => handleFilterChange(v, "priceOrder")}>
            <SelectTrigger>
              <span>Price</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Price">Default</SelectItem>
              <SelectItem value="price">Low to High</SelectItem>
              <SelectItem value="-price">High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button onClick={() => setViewType("grid")}>Grid View</Button>
          <Button onClick={() => setViewType("list")}>List View</Button>
        </div>
      </div>

      <div
        className={
          viewType === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-6"
        }
      >
        {products.map((product) => (
          <Card key={product.id} className="border rounded-lg p-4">
            <CardHeader className="flex justify-center items-center">
              <Package className="text-gray-500 h-24 w-24" />
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold text-xl">${product.price}</span>
                {product.stock === 0 ? (
                  <Badge className="bg-red-500">Out of Stock</Badge>
                ) : (
                  <Badge className="bg-green-500">In Stock</Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-4">
              <Button size="sm" onClick={() => {}}>
                Add to Wishlist
              </Button>
              <Button size="sm" variant="outline" onClick={() => {}}>
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
