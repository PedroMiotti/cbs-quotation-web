import {
  CreateQuotationRequest,
  Quotation,
  QuotationTable,
} from "../types/Quotation";
import { Api } from "./Axios";

export const createQuotation = async (quotation: CreateQuotationRequest) => {
  const response = await Api.post<Quotation>("/quotation", quotation);
  return response.data;
};

export const fetchAllQuotations = async () => {
  const response = await Api.get<QuotationTable[]>("/quotation");
  return response.data;
};

export const deleteQuotation = async (quotationId: number) => {
  const response = await Api.delete(`/quotation/${quotationId}`);
  return response.data;
};
