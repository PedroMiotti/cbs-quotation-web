
export interface Brand {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface CreateBrandRequest extends Omit<Brand, 'id' | 'created_at' | 'updated_at'> {}