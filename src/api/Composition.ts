import { Composition, CreateCompositionRequest } from "../types/Composition";
import { Api } from "./Axios";

export const createComposition = async (composition: CreateCompositionRequest) => {
    const response = await Api.post<Composition>('/composition', composition);
    return response.data;
}

export const deleteComposition = async (id: number) => {
    await Api.delete(`/composition/${id}`);
}

export const updateComposition = async (id: number, composition: Partial<CreateCompositionRequest>) => {
    const response = await Api.patch<Composition>(`/composition/${id}`, composition);
    return response.data;
}

export const addItemToComposition = async (composition_id: number, product_id: number, quantity: number) => {
    const response =  await Api.post(`/composition/${composition_id}/item/add`, { product_id, quantity });
    return response.data;
}

export const removeItemFromComposition = async (itemId: number) => {
    await Api.delete(`/composition/item/${itemId}/remove`);
}

export const updateItemQuantityInComposition = async (item_id: number, quantity: number) => {
    await Api.patch(`/composition/item/${item_id}/update`, { quantity: +quantity });
}

export const moveItem = async (item_id: number, new_composition_id: number) => {
    await Api.patch(`/composition/${new_composition_id}/item/${item_id}/move`);
}

