import api from "api";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "react-query";
import { Device, Wearers } from "services/types";
import { notification } from "antd";

var config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data"
    }
};

export interface Tag {
    name: string;
}

export interface UserWearers {
    createdDate: string;
	id: number;
	isDelete: string;
	modifiedDate: string;
	user: {
		nickName: string;
	};
	userId: string;
	userWearerType: string;
}

export interface Senior {
    name: string;
    wearerId: string;
    createdDate: any;
    mainCarer: string;
    subCarer: string;
    site: string;
    tag: Array<Tag>;
    subMobile: string;
	mobile?: string;
    address: string;
    birth: any;
    genderType: string;
    height: string;
    weight: string;
	userWearers: Array<UserWearers | any>
    devices: Array<Device | any>;
    healthAndInactivity: string;
    reminder: string;
    description: string;
}
export interface SeniorResponse {
	data: Array<Senior>;
	total: number;
	status: number;
}
export interface SpecialSeniorResponse {
	status: number;
	data: Senior;
}
export interface StoreResponse {
	status: number;
	data: Senior;
  }
  
export interface StoreRequest {
	name: string;
}
export const addSeniorAPI = async (value: string): Promise<StoreResponse> => {
	if (!value) {
		return Promise.reject(new Error("Invalid parameter"));
	}

    const { data } = await api.post(
        `/seniors/create`, { name: value}
    );
    return data;
};

export const getSeniorList = async (queryString: string): Promise<SeniorResponse> => {
	let params:string = queryString;
	const [PAGE, SENIOR_URL] = ['page', '/seniors'];
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

	const { data } = await api.get(
		`${SENIOR_URL}${params}`, config
	);

	return data;
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

export const getSeniorMainCarers = (senior: Wearers | null) => {
	if (!senior) return [];
	let names = senior?.userWearers?.filter(u => u.userWearerType === 'MAIN').map(e => e.user?.nickName);
	return names || [];
}
  
export const getSeniorSubCarers = (senior: Wearers | null) => {
	if (!senior) return [];
	let names = senior?.userWearers?.filter(u => u.userWearerType === 'SUB').map(e => e.user?.nickName);
	return names || [];
}