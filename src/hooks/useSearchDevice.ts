import api from "api";
import { useQuery } from "react-query";


export interface ConnectDevice {
    deviceId: number;
    imei: string;
}

export interface SearchDeviceResponse {
    data: Array<ConnectDevice>,
    total: number
}

// get connect device list
const searchDeviceApi = async (searchText?: string): Promise<SearchDeviceResponse> => {
    const { data } = await api.get(
        `/devices/search?imei=${searchText}`
    );
    return data;
}

export function useSearchDevice(searchText?: string | undefined) {
    return useQuery(['search_device', searchText], () => searchDeviceApi(searchText) , { retry: 1});
}