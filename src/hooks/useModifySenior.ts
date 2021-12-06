import { notification } from "antd";
import api from "api";
import { useMutation, useQueryClient, UseMutationResult } from "react-query";

// Connect Senior
const ModifySenior = async (seniorId: number | undefined, params: object | undefined): Promise<{ status: number; data: string }> => {
    if (!seniorId || !params) {
        return Promise.reject(new Error("Invalid params  or seniorId"));
    }
   
    const { data } = await api.post(
        `/seniors/${seniorId}/modify`, {
        ...params
    }
    );
    return data;
};

export const useModifySenior = (): UseMutationResult<{ status: number; data: string }, any, { seniorId: number, data: object }, any> => {
    const queryClient = useQueryClient();

    return useMutation((data: { seniorId: number, data: object }) => ModifySenior(data.seniorId, data.data), {
        onSuccess: () => {
            queryClient.invalidateQueries("specificSenior");
            notification.success({
                message:'Update Senior',
                description:'Update Senior successfully'
            })
        },
        onError: () => {
            notification.error({
                message:'Update Senior',
                description:'Update Senior error'
            })
        }
    });
};
