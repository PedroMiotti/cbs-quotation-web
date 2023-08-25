import {CreateProductRequest, Product } from "../types/Product";
import { Api } from "./Axios";

export const createProduct = async (product: CreateProductRequest) => {
    const response = await Api.post<Product>('/product', product);
    return response.data;
}

export const fetchAllProducts = async () => {
    const response = await Api.get<Product[]>('/product');
    return response.data;
}
