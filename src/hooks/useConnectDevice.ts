import { notification } from "antd";
import api from "api";
import { useQuery, useMutation, useQueryClient, UseMutationResult } from "react-query";

// Connect device
const connectDeviceToSenior = async (deviceId: string, seniorId: string): Promise<{ status: number; data: string }> => {
    if (!deviceId || !seniorId) {
        return Promise.reject(new Error("Invalid deviceId  or seniorId"));
    }
   
    const { data } = await api.post(
        `/seniors/${seniorId}/connect`, {
        deviceId
    }
    );
    return data;
};

export const useConnectDevice = (): UseMutationResult<{ status: number; data: string }, any, { deviceId: string, seniorId: string }, any> => {
    const queryClient = useQueryClient();

    return useMutation((data: { deviceId: string, seniorId: string }) => connectDeviceToSenior(data.deviceId, data.seniorId), {
        onSuccess: (_data, variables, _context) => {
            queryClient.invalidateQueries(["search_device"]);
            queryClient.invalidateQueries(["seniors"]);
            queryClient.invalidateQueries(["devices"]);
            queryClient.removeQueries(["specificSenior", variables.seniorId]);
            queryClient.removeQueries(["specificDevice", variables.deviceId]);

            notification.success({
                message:'Connect Senior',
                description:'Connect Senior successfully'
            })
        },
        onError: () => {
            notification.error({
                message:'Connect Senior',
                description:'Connect Senior error'
            })
        }
    });
};
