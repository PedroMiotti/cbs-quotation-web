import { Product } from "./Product";

export interface Composition {
    id: number;
    name: string;
    margin: number;
    quotation_id: number;
    CompositionItems: CompositionItem[];
    created_at: string;
    updated_at: string;
}

export interface CreateCompositionRequest extends Omit<Composition, 'id' | 'CompositionItems' | 'created_at' | 'updated_at'> {}

export interface CompositionItem {
    product_id: number;
    composition_id: number;
    quantity: number;
    Product: Product;
}

export interface CreateCompositionItemRequest extends Omit<CompositionItem, 'id' | 'created_at' | 'updated_at'> {}


