
export interface Product {
    id: number;
    name: string;
    weight: number;
    is_active: boolean;
    brand_id: number;
    created_at: string;
    updated_at: string;
}

export interface CreateProductRequest extends Omit<Product, 'id' | 'created_at' | 'updated_at'> {}

export interface ProductPrice {
    id: number
    product_id: number;
    price: number;
    is_current: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateProductPriceRequest extends Omit<ProductPrice, 'id' | 'created_at' | 'updated_at'> {}
