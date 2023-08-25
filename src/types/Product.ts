import { Brand } from "./Brand";

export interface Product {
  id: number;
  name: string;
  weight: string;
  brand_id: number;
  Brand: Brand;
  ProductPrice: ProductPrice[];
  created_at: string;
  updated_at?: string;
}

export interface CreateProductRequest {
  name: string;
  weight: string;
  brand_id: number;
  price: { price: number; is_current: boolean };
}

export interface ProductPrice {
  id: number;
  product_id: number;
  price: number;
  is_current?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductPriceRequest
  extends Omit<ProductPrice, "id" | "created_at" | "updated_at"> {}
