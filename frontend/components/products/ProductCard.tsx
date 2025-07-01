import { Product } from "@/types/products";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="rounded-lg border shadow-sm hover:shadow-lg transition-shadow flex items-center justify-center">
      <CardContent className="flex flex-col items-center justify-center w-full h-full py-8">
        <img
          src={product.main_image_url}
          alt={product.name}
          className="w-32 h-32 object-contain mb-2"
        />
        <div className="text-base font-medium truncate text-center w-full">{product.name}</div>
        <div className="mt-2 mb-1 flex items-center gap-1">
          {product.discount_price && (
            <span className="line-through text-gray-400 text-[13px]">{product.price.toLocaleString()}원</span>
          )}
          <span className="text-lg font-bold text-red-600">
            {(product.discount_price ?? product.price).toLocaleString()}원
          </span>
          {product.discount_rate && (
            <span className="ml-2 text-xs text-blue-500 font-semibold">
              {product.discount_rate}% ↓
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs mt-1">
          {product.is_rocket && <span className="text-blue-500 font-bold">🚀로켓배송</span>}
          {product.is_free_shipping && <span className="text-green-600">무료배송</span>}
        </div>
        {product.delivery_expect && (
          <div className="text-xs text-green-600">{product.delivery_expect}</div>
        )}
        <div className="flex items-center mt-1">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-xs ml-1">{product.avg_rating ?? 0}</span>
          <span className="text-gray-400 text-xs ml-1">({product.review_count ?? 0})</span>
        </div>
        {product.max_point > 0 && (
          <div className="text-[11px] text-gray-400 mt-1">
            최대 {product.max_point.toLocaleString()}원 적립
          </div>
        )}
        <div className="text-xs text-gray-400 mt-1">
          재고: {product.stock}개
        </div>
      </CardContent>
    </Card>
  );
}
