import { Composition } from "./Composition";

export interface Quotation {
    id: number;
    name: string;
    type: string;
    tag?: string;
    Composition: Composition[];
}

export interface CreateQuotationRequest extends Omit<Quotation, 'id'> {}
