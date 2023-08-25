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

export const addItemToComposition = async (composition_id: number, item_id: number, quantity: number) => {
    await Api.post(`/composition/item/add`, { composition_id, item_id, quantity });
}

export const removeItemFromComposition = async (composition_id: number, item_id: number) => {
    await Api.post(`/composition/item/remove`, { composition_id, item_id });
}

export const updateItemQuantityInComposition = async (composition_id: number, item_id: number, quantity: number) => {
    await Api.post(`/composition/item/update`, { composition_id, item_id, quantity });
}

