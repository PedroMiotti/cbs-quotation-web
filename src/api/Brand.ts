import { Brand, CreateBrandRequest } from "../types/Brand";
import { Api } from "./Axios";

export const createBrand = async (brand: CreateBrandRequest) => {
  const response = await Api.post<Brand>("/brand", brand);
  return response.data;
};

export const fetchAllBrands = async () => {
  const response = await Api.get<Brand[]>("/brand");
  return response.data;
};

export const updateBrand = async (id: number, name: string) => {
  const response = await Api.patch<Brand>(`/brand/${id}`, { name: name });
  return response.data;
};
