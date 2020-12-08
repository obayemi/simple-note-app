import axios from "axios";
import { refreshToken, logout } from "./reducers/auth";

export function setupAxios(store: any) {
  console.log(process.env);
  const API_URL = `${process.env.REACT_APP_API_URL}/v1`;
  console.log("API_URL", API_URL);

  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        originalRequest.url === `${API_URL}/jwt/refresh`
      ) {
        store.dispatch(logout());
        return Promise.reject(error);
      }
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const tokens = await store.dispatch(refreshToken());
        console.log(tokens.payload.acess);
        originalRequest.headers.Authorization = `JWT ${tokens.payload.access}`;
        return await axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );
  axios.defaults.baseURL = API_URL;
}
export default setupAxios;
