import axios from "axios";
import { notification } from "antd";

export const BASE_URL = `http://localhost:5000/api`; //QA

const instance = axios.create({
    baseURL: BASE_URL,
});
instance.defaults.headers.get["Accept"] = "application/json";
instance.defaults.headers.post["Accept"] = "application/json";
instance.defaults.headers.common['Access-Control-Allow-Origin'] = "*";

instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.common["Access-Token"] = token;
    }
    return config;
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem("refreshToken");
        const rememberMe = localStorage.getItem("remember");

        // Check if refreshToken expire need ridirect to Login
        if (error.response && error.response.status === 401 && (!rememberMe || error.response.config.url.includes('auth/refreshToken'))) {
            return redirectLogin();
        }

        if (
            error.response &&
            error.response.status === 401 &&
            error.config &&
            !error.config.__isRetryRequest
        ) {
            if (rememberMe === "true") {
                originalRequest._retry = true;
                try {
                    const response = await instance.post('/auth/refreshToken', {
                        refreshToken: refreshToken,
                    });
                    const accessToken = response.data.data['id-token'];
                    localStorage.setItem("accessToken", accessToken);
                    return instance(originalRequest);
                } catch (_error) {
                    window.location.href = "/login";
                    //return Promise.reject(_error);
                }
            } else {
                return redirectLogin();
            }
        }

        if (error.response && error.response.data && error.response.data.message) {
            if ([409, 412, 500, 400].includes(error.response.status)) {

                notification.error({
                    message: 'Error',
                    description: error.response.data.message
                })
            }
        }
        return Promise.reject(
            (error.response && error.response.data) || "Something went wrong!"
        );
    }
);

const redirectLogin = () => {
    localStorage.removeItem('accessToken');
    window.location.href = "/login";
    return;
}

export default instance;
