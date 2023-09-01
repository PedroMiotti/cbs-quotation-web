export interface Quotation {
  id: number;
  name: string;
  type: string;
  tag?: string;
}

export interface QuotationTable {
  id: number;
  name: string;
  compositions: number;
  created_at: string;
  type: string;
  tag?: string;
}

export interface CreateQuotationRequest extends Omit<Quotation, "id"> {}
