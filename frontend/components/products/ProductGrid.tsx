import { Product } from "@/types/products";
import { Card, CardContent } from "@/components/ui/card";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return <div>로딩중...</div>;
  }

  if (products.length === 0) {
    return <div className="text-center py-20 text-gray-400">상품이 없습니다.</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map(p => (
        <Card key={p.id} className="rounded-lg border shadow-sm hover:shadow-lg transition-shadow flex flex-col items-center py-8">
          <CardContent className="flex flex-col items-center">
            <img src={p.main_image_url} alt={p.name} className="w-32 h-32 object-contain mb-2" />
            <div className="text-base font-medium truncate text-center w-full">{p.name}</div>
            <div className="mt-2 mb-1 flex items-center gap-1">
              {p.discount_price && (
                <span className="line-through text-gray-400 text-[13px]">{p.price.toLocaleString()}원</span>
              )}
              <span className="text-lg font-bold text-red-600">
                {(p.discount_price ?? p.price).toLocaleString()}원
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {p.is_rocket && <span className="text-blue-500 font-bold">🚀로켓배송</span>}
              {p.is_free_shipping && <span className="text-green-600">무료배송</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
