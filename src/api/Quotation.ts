import { CreateQuotationRequest, Quotation } from "../types/Quotation";
import { Api } from "./Axios";


export const createQuotation = async (quotation: CreateQuotationRequest) => {
    const response = await Api.post<Quotation>('/quotation', quotation);
    return response.data;
}

export const fetchQuotations = async () => {
    const response = await Api.get<Quotation[]>('/quotation');
    return response.data;
}

export const fetchQuotation = async (id: number) => {
    const response = await Api.get<Quotation>(`/quotation/${id}`);
    return response.data;
}

export const updateQuotation = async (id: number, quotation: Partial<CreateQuotationRequest>) => {
    const response = await Api.put<Quotation>(`/quotation/${id}`, quotation);
    return response.data;
}
