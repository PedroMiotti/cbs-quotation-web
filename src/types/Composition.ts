
export interface Composition {
    id: number;
    name: string;
    margin: number;
    quotation_id: number;
    created_at: string;
    updated_at: string;
}

export interface CreateCompositionRequest extends Omit<Composition, 'id' | 'created_at' | 'updated_at'> {}

export interface CompositionItem {
    product_id: number;
    composition_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
}

export interface CreateCompositionItemRequest extends Omit<CompositionItem, 'id' | 'created_at' | 'updated_at'> {}


