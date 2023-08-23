import { Brand, CreateBrandRequest } from "../types/Brand";
import { CreateProductPriceRequest, CreateProductRequest, Product } from "../types/Product";
import { Api } from "./Axios";

export const createProduct = async (product: CreateProductRequest) => {
    const response = await Api.post<Product>('/product', product);
    return response.data;
}