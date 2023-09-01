import { Composition } from "./Composition";

export enum QuotationType {
  CHRISTMAS = "CHRISTMAS",
  CUSTOM = "CUSTOM",
}

export interface Quotation {
    id: number;
    name: string;
    type: string | QuotationType;
    tag?: string;
    Composition: Composition[];
}

export interface QuotationTable {
  id: number;
  name: string;
  compositions: number;
  created_at: string;
  type: string;
  tag?: string;
}

export interface CreateQuotationRequest extends Omit<Quotation, "id" | 'Composition'> {}
