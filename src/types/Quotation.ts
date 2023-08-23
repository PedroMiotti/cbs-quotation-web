export interface Quotation {
    id: number;
    name: string;
    type: string;
    tag?: string;
}

export interface CreateQuotationRequest extends Omit<Quotation, 'id'> {}
