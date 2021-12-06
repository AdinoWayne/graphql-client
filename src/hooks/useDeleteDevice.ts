import { notification } from "antd";
import api from "api";
import { useQuery, useMutation, useQueryClient, UseMutationResult } from "react-query";


// Delete device by id
const deleteDeviceById = async (deviceId?: string | undefined): Promise<""> => {
    if (!deviceId) {
        return Promise.reject(new Error("Invalid device Id"));
    }
    var config = {
        headers: { "Access-Control-Allow-Origin": "*" },
    };
    const { data } = await api.post(
        `/devices/${deviceId}/delete`,
        config
    );
    return data;
};


export const useDeleteDevice = () => {
    const queryClient = useQueryClient();

    return useMutation((index?: string | undefined) => deleteDeviceById(index), {
        onSuccess: () => {
            queryClient.invalidateQueries("devices");
            queryClient.invalidateQueries("seniors");
            queryClient.invalidateQueries(["search_device"]);
            queryClient.removeQueries("specificSenior");
            queryClient.removeQueries('specificDevice');
            notification.success({
                message: 'Delete device',
                description: 'Delete devices successfully'
            })
        },
        onError: () => {
            notification.error({
                message: 'Delete device',
                description: 'Delete devices error!'
            })
        }
    });
};
