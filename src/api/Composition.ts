import { Composition, CreateCompositionRequest } from "../types/Composition";
import { Api } from "./Axios";

export const createComposition = async (composition: CreateCompositionRequest) => {
    const response = await Api.post<Composition>('/composition', composition);
    return response.data;
}