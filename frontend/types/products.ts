export interface Category {
  id: number;
  name: string;
  parent: number | null;
  depth: number;
  children?: Category[];
}

export interface FilterType {
  id: number;
  name: string;
  display_name: string;
  values: FilterValue[];
}

export interface FilterValue {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  main_image_url: string;
  price: number;
  discount_price?: number | null;
  stock: number;
  is_rocket: boolean;
  is_free_shipping: boolean;
  delivery_expect?: string;
  avg_rating: number;
  review_count: number;
  max_point: number;
  sales_count?: number;
  discount_rate?: number | null;
  category: Category;
  filter_values: FilterValue[];
}
