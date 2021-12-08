import graphql from "api.graphql";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "react-query";
import { IPostResponse, ISpecialPostResponse, StoreRequest, StoreResponse } from "utils/types";
import { notification } from "antd";

export const addSeniorAPI = async (value: string): Promise<StoreResponse> => {
	if (!value) {
		return Promise.reject(new Error("Invalid parameter"));
	}
	const query = `
		mutation($params: postInput) {
			storePost(input: $params) { _id }
		}
	`;
	const variables = {
		params : {
			text: value,
		},
	};
	const response = await graphql.request(query, variables);
	return response;
};

export const getSeniorList = async (queryString: string): Promise<IPostResponse> => {
	let params:Array<{ key: string; value: any}> = [];
	const arrQuery = ['name', 'page', 'startDate', 'endDate']
	if (queryString) {
		let queryURl = new URLSearchParams(queryString);
		// eslint-disable-next-line array-callback-return
		arrQuery.map(element => {
			if (queryURl.get(element)) {
				params.push({
					value: queryURl.get(element),
					key: element
				})
			}
		})

	}
	const query:string = `query($filter: SPost) {
		searchPosts(filter: $filter) {
			_id
			name
			text
			date
		}
	}`;
	const variables:{ filter: object } = {
		filter: {}
	};

	// eslint-disable-next-line array-callback-return
	params.map((element) => {
		variables.filter[element.key] = element.value
	})

	const response = await graphql.request(query, variables);
	return response;
}; 

const destroyPosts = async (postIds: Array<string>): Promise<{ status: number; data: string}> => {
	if (postIds && postIds.length === 0) {
		return Promise.reject(new Error("Invalid parameter"));
	}
	const query:string = `mutation($postIds: [ID!]) {
		destroyArrPost(postIds: $postIds) {
			msg
		}
	}`;
	const variables:{ postIds: string[] } = {
		postIds: postIds,
	};
	const response = await graphql.request(query, variables);
	return response;
};

export const useDeleteListSenior = () => {
	const queryClient = useQueryClient();

	return useMutation((arr: Array<string>) => destroyPosts(arr), {
		onSuccess: () => {
            queryClient.invalidateQueries("seniors");
            queryClient.removeQueries("specificSenior");
		},
	});
};

export const useStoreSenior = (): UseMutationResult<StoreResponse, any, StoreRequest, any> => {
	const queryClient = useQueryClient();
  
	return useMutation((data:StoreRequest) => addSeniorAPI(data.name), {
	  onSuccess: () => {
		queryClient.invalidateQueries("seniors");
		notification.success({
			message:'Create Post',
			description:'Added successfully!'
		});
	  },
	});
  };

// Get senior by id
const getSeniorById = async (
	seniorId?: string | undefined
  ): Promise<ISpecialPostResponse> => {
	if (!seniorId) {
	  return Promise.reject(new Error("Invalid postId"));
	}
	const query:string = `query($id: ID!) {
		post(_id: $id) {
			_id
			name
			text
			date
			likes {
				_id
				user
			}
			comments {
				_id
				text
				name
				avatar
				date
			}
		}
	}`;

	const response = await graphql.request(query, { id: seniorId});

	return response;
};
  
export function useGetSpecificSenior(id: string) {
	return useQuery(["specificSenior", id], () => getSeniorById(id), { retry: 1, refetchOnWindowFocus: false, keepPreviousData: true });
}

export const storeComment = async (postId: string, data: string): Promise<ISpecialPostResponse> => {
	if (!data) {
		return Promise.reject(new Error("Invalid parameter"));
	}
	const query = `
		mutation($postId: ID!, $params: postUpdateInput) {
			storeComment(postId: $postId, input: $params) { _id }
		}
	`;
	const variables = {
		params : {
			text: data,
		},
		postId: postId
	};
	const response = await graphql.request(query, variables);
	return response;
}

export const storeLike = async (postId: string): Promise<ISpecialPostResponse> => {
	if (!postId) {
		return Promise.reject(new Error("Invalid parameter"));
	}
	const query = `
		mutation($postId: ID!) {
			toggleLike(postId: $postId) {
				_id
				likes {
					_id
				} 
			}
		}
	`;
	const variables = {
		postId: postId
	};
	const response = await graphql.request(query, variables);
	return response;
}