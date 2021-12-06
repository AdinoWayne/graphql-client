import api from "api";
import { useQuery, useMutation, useQueryClient, UseMutationResult } from "react-query";
import { Device } from "services/types";


export interface SpecialDeviceResponse {
    status: number;
    data: Device;
}
// Get device by id
const getDeviceById = async (
    deviceId?: string | undefined
): Promise<SpecialDeviceResponse> => {
    if (!deviceId) {
        return Promise.reject(new Error("Invalid device Id"));
    }
  
    const { data } = await api.get(`/devices/${deviceId}`);

    return data;
};

export function useGetSpecificDevice(id: string) {
    return useQuery(["specificDevice", id], () => getDeviceById(id));
}
