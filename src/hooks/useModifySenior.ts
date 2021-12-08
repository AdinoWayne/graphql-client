import { notification } from "antd";
import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { storeComment, storeLike } from "services/seniorService";
import { ISpecialPostResponse, IStoreCommentRequest, IStoreLikeRequest } from "utils/types";

export const useModifySenior = (): UseMutationResult<ISpecialPostResponse, any, IStoreCommentRequest, any> => {
    const queryClient = useQueryClient();

    return useMutation((data: IStoreCommentRequest) => storeComment(data.postId, data.data), {
        onSuccess: () => {
            queryClient.invalidateQueries("specificSenior");
        },
        onError: () => {
            notification.error({
                message:'Update Comment',
                description:'Update Comment error'
            })
        }
    });
};

export const usePostLike = (): UseMutationResult<ISpecialPostResponse, any, IStoreLikeRequest, any> => {

    return useMutation((data: IStoreLikeRequest) => storeLike(data.postId), {
        onError: () => {
            notification.error({
                message:'Update Like',
                description:'Update Like error'
            })
        }
    });
};