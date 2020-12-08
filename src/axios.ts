import axios from "axios";
import { Store } from "redux";
import { refreshToken, logout } from "./reducers/auth";

const API_URL = "http://127.0.0.1:8001/v1";

export function setupAxios(store: any) {
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.interceptors.response.use(
    (response) => {
      console.log("intercept response", response);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        originalRequest.url === `${API_URL}/jwt/refresh`
      ) {
        store.dispatch(logout());
        return Promise.reject(error);
      }
      if (originalRequest._retry) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      await store.dispatch(refreshToken());
      return await axios(originalRequest);
    }
  );
  axios.defaults.baseURL = API_URL;
}
export default setupAxios;
