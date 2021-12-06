import { notification } from 'antd';
import api from "api";
import { useMutation, UseMutationResult, useQueryClient } from "react-query";

const deleteDevices = async (deviceIds: Array<string>): Promise<{ status: number; data: string }> => {
    if (deviceIds && deviceIds.length === 0) {
        return Promise.reject(new Error("Invalid parameter"));
    }

    const { data } = await api.post(
        `/devices/delete`, { deviceIds: deviceIds }
    );

    return data;
};

export const useDeleteListDevice = (): UseMutationResult<{ status: number; data: string }, null, string[]> => {
    const queryClient = useQueryClient();

    return useMutation((arr: Array<string>) => deleteDevices(arr), {
        onSuccess: () => {
            queryClient.invalidateQueries("devices");
            queryClient.invalidateQueries("seniors");
            queryClient.invalidateQueries(["search_device"]);
            queryClient.removeQueries("specificSenior");
            queryClient.removeQueries('specificDevice');
            notification.success({
                message:'Delete devices',
                description:'Delete devices successfully'
            })
        },
        onError: () => {
            notification.error({
                message:'Delete devices',
                description:'Delete devices error!'
            })
        }
    });
};
