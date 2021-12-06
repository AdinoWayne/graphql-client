import api from "api";
import { useQuery, useMutation, useQueryClient, UseMutationResult } from "react-query";


export interface ConnectSenior {
    wearerId: number;
    name: string;
}

export interface SearchSeniorResponse {
    data: Array<ConnectSenior>,
    total: number
}

// get connect senior list
const searchSeniorApi = async (searchText?: string): Promise<SearchSeniorResponse> => {
    const { data } = await api.get(
        `/seniors/search?seniorName=${searchText}`
    );
    return data;
}

export function useSearchSenior(searchText?: string | undefined) {
    console.log("searchText:" + searchText);
    return useQuery(['search_senior', searchText], () => searchSeniorApi(searchText));
}