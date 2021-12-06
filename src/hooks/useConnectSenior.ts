import { notification } from "antd";
import api from "api";
import { useQuery, useMutation, useQueryClient, UseMutationResult } from "react-query";

// Connect Senior
const connectSeniorToDevice = async (deviceId: string, seniorId: number): Promise<{ status: number; data: string }> => {
    if (!deviceId || !seniorId) {
        return Promise.reject(new Error("Invalid deviceId  or seniorId"));
    }
   
    const { data } = await api.post(
        `/devices/${deviceId}/connect`, {
        seniorId
    }
    );
    return data;
};

export const useConnectSenior = (): UseMutationResult<{ status: number; data: string }, any, { deviceId: string, seniorId: number }, any> => {
    const queryClient = useQueryClient();

    return useMutation((data: { deviceId: string, seniorId: number }) => connectSeniorToDevice(data.deviceId, data.seniorId), {
        onSuccess: (_data, variables, _context) => {
            queryClient.invalidateQueries(["search_device"]);
            queryClient.invalidateQueries("seniors");
            queryClient.invalidateQueries("devices");
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
