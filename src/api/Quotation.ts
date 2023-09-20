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

export const fetchQuotation = async (id: number) => {
  const response = await Api.get<Quotation>(`/quotation/${id}`);
  return response.data;
};

export const deleteQuotation = async (quotationId: number) => {
  const response = await Api.delete(`/quotation/${quotationId}`);
  return response.data;
};

export const exportQuotation = async (quotationId: number) => {
  const response = await Api.get(`/quotation/${quotationId}/export`, {
    responseType: "blob",
  });
  return response.data;
}