import { CreateQuotationRequest, Quotation } from "../types/Quotation";
import { Api } from "./Axios";


export const createQuotation = async (quotation: CreateQuotationRequest) => {
    const response = await Api.post<Quotation>('/quotation', quotation);
    return response.data;
}