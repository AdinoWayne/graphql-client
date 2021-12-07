import graphql from "api.graphql";
import api from "api";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "react-query";
import { IPostResponse, SpecialSeniorResponse, StoreRequest, StoreResponse } from "services/types";
import { notification } from "antd";

var config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data"
    }
};

export const addSeniorAPI = async (value: string): Promise<StoreResponse> => {
	if (!value) {
		return Promise.reject(new Error("Invalid parameter"));
	}

    const { data } = await api.post(
        `/seniors/create`, { name: value}
    );
    return data;
};

export const getSeniorList = async (queryString: string): Promise<IPostResponse> => {
	let params:string = queryString;
	const PAGE = 'page';
	if (queryString) {
		let queryURl = new URLSearchParams(queryString);
		let page:(string | null | number) = queryURl.get(PAGE);
		if (page) {
			page = parseInt(page, 10) - 1;
			if (page < 0) {
                page = 0;
            }
			queryURl.set(PAGE, page.toString());
		}
		params = '?' + queryURl.toString();
	}
	const query:string = `{
		posts {
		  name
		  text
		  date
		}
	  }`;
	const variables:object = {};

	const response = await graphql.request(query, variables);
	return response;
}; 

const deleteDevices = async (seniorIds: Array<string>): Promise<{ status: number; data: string}> => {
	if (seniorIds && seniorIds.length === 0) {
		return Promise.reject(new Error("Invalid parameter"));
	}
	const { data } = await api.post(
		`/seniors/delete`, { seniorIds: seniorIds}
	);

	return data;
};

export const useDeleteListSenior = () => {
	const queryClient = useQueryClient();

	return useMutation((arr: Array<string>) => deleteDevices(arr), {
		onSuccess: () => {
            queryClient.invalidateQueries("devices");
            queryClient.invalidateQueries("seniors");
            queryClient.invalidateQueries(["search_device"]);
            queryClient.removeQueries("specificSenior");
            queryClient.removeQueries('specificDevice');
		},
	});
};

export const useStoreSenior = (): UseMutationResult<StoreResponse, any, StoreRequest, any> => {
	const queryClient = useQueryClient();
  
	return useMutation((data:StoreRequest) => addSeniorAPI(data.name), {
	  onSuccess: () => {
		queryClient.invalidateQueries("seniors");
		notification.success({
			message:'Create senior',
			description:'Added successfully!'
		});
	  },
	});
  };

// Get senior by id
const getSeniorById = async (
	seniorId?: string | undefined
  ): Promise<SpecialSeniorResponse> => {
	if (!seniorId) {
	  return Promise.reject(new Error("Invalid senior Id"));
	}
	const { data } = await api.get(`/seniors/${seniorId}`, config);
  
	return data;
  };
  
  export function useGetSpecificSenior(id: string) {
	return useQuery(["specificSenior", id], () => getSeniorById(id));
}