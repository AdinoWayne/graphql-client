import { notification } from "antd";
import api from "api";
import { useQuery, useMutation, useQueryClient, UseMutationResult } from "react-query";
import { Device, Wearers } from "services/types";

export interface DeviceResponse {
  data: Array<Device>;
  total: number;
  status: number;
}
export interface StoreResponse {
  status: number;
  data: Device;
}

export interface StoreRequest {
  imei: number | string;
}

const addDeviceAPI = async (value: number | string): Promise<StoreResponse> => {
  if (!value) {
    return Promise.reject(new Error("Invalid parameter"));
  }
  const { data } = await api.post(`/devices/create`, { imei: value });
  return data;
};


export const useStoreDevice = (): UseMutationResult<StoreResponse, any, StoreRequest, any> => {
  const queryClient = useQueryClient();

  return useMutation((data: StoreRequest) => addDeviceAPI(data.imei), {
    onSuccess: () => {
      queryClient.invalidateQueries("devices");
      notification.success({
        message:'Create device',
        description:'Added successfully!'
      });
    },
  });
};

const disconnectSenior = async (deviceId: string, seniorId: string): Promise<{ status: number; data: string}> => {
	const { data } = await api.post(
		`/seniors/${seniorId}/removeDevice`, { deviceId: deviceId }
	);

	return data;
};

export const useDisconnectSenior = () => {
	const queryClient = useQueryClient();

	return useMutation((data: { deviceId: string, seniorId: string }) => disconnectSenior(data.deviceId, data.seniorId), {
		onSuccess: (_data, variables, _context) => {
		  queryClient.invalidateQueries("devices");
      queryClient.removeQueries(["specificSenior", variables.seniorId]);
      queryClient.removeQueries(["specificDevice", variables.deviceId]);
      queryClient.invalidateQueries(["search_device"]);
      queryClient.invalidateQueries(["seniors"]);
		},
	});
};



