import { Brand, CreateBrandRequest } from "../types/Brand";
import { Api } from "./Axios";


export const createBrand = async (brand: CreateBrandRequest) => {
    const response = await Api.post<Brand>('/brand', brand);
    return response.data;
}