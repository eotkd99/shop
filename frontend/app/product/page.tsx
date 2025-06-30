"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";  // lucide-react에서 Loader2 import

// lucide-react 아이콘 임포트
import { Package } from "lucide-react";  // 아이콘으로 Package 사용

// Select와 SelectItem 컴포넌트의 임포트
import { Select, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select";  // Select 관련 임포트 추가

// Filters 인터페이스 정의
interface Filters {
  category: string;
  priceOrder: string;
  search: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);  // 상품 목록
  const [filters, setFilters] = useState<Filters>({
    category: "All Categories", // 기본값을 "All Categories"로 설정
    priceOrder: "Price", // 기본값을 "Price"로 설정
    search: "",
  });
  const [loading, setLoading] = useState(false);  // 로딩 상태
  const [viewType, setViewType] = useState<"grid" | "list">("grid");  // 그리드/리스트 뷰 선택

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/products/", {
          params: {
            category: filters.category !== "All Categories" ? filters.category : undefined,
            ordering: filters.priceOrder !== "Price" ? filters.priceOrder : undefined,
            search: filters.search,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (value: string, name: string) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleViewTypeChange = (view: "grid" | "list") => {
    setViewType(view);
  };

  const handleAddToWishlist = (productId: number) => {
    console.log(`Product ${productId} added to wishlist`);
  };

  const handleAddToCart = (productId: number) => {
    console.log(`Product ${productId} added to cart`);
  };

  // 로딩 중일 경우 Loader2 컴포넌트로 스피너 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12">
      {/* 검색 기능 */}
      <div className="mb-8 flex items-center justify-between">
        <Input
          type="text"
          name="search"
          placeholder="Search products..."
          className="w-1/3"
          onChange={(e) => handleFilterChange(e.target.value, "search")}
        />
        <div className="space-x-4">
          {/* 필터링 기능 */}
          <Select value={filters.category} onValueChange={(value: string) => handleFilterChange(value, "category")}>
            <SelectTrigger>
              <span>Category</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.priceOrder} onValueChange={(value: string) => handleFilterChange(value, "priceOrder")}>
            <SelectTrigger>
              <span>Price</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Price">Price</SelectItem>
              <SelectItem value="price">Low to High</SelectItem>
              <SelectItem value="-price">High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 그리드/리스트 뷰 전환 */}
        <div>
          <Button onClick={() => handleViewTypeChange("grid")}>Grid View</Button>
          <Button onClick={() => handleViewTypeChange("list")}>List View</Button>
        </div>
      </div>

      {/* 상품 카드 디자인 */}
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
              <Package className="text-gray-500 h-24 w-24" /> {/* 아이콘으로 대체 */}
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
              <Button size="sm" onClick={() => handleAddToWishlist(product.id)}>
                Add to Wishlist
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleAddToCart(product.id)}>
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
