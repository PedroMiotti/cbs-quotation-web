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
    created_at: string;
    updated_at: string;
}

export interface QuotationTable {
  id: number;
  name: string;
  compositions: number;
  type: string;
  tag?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateQuotationRequest extends Omit<Quotation, "id" | 'Composition' | 'created_at' | 'updated_at'> {}
