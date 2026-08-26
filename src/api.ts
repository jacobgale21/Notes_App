import axios from "axios";
import { getAccessToken, setAccessToken } from "./auth";
export const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // send HttpOnly cookie on /user/refresh
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) throw error;
    original._retry = true;
    const { data } = await api.post("/user/refresh"); // cookie goes automatically
    setAccessToken(data.access_token);
    original.headers.Authorization = `Bearer ${data.access_token}`;
    return api.request(original);
  },
);

export const getNotes = async () => {
  const response = await api.get("/");
  return response.data;
};

interface User {
  email: string;
  password: string;
}

export const signup = async (user: User) => {
  const { data } = await api.post("/user/signup", user);
  setAccessToken(data.access_token);
};

export const login = async (user: User) => {
  const { data } = await api.post("/user/login", user);
  setAccessToken(data.access_token);
};

export const refresh = async () => {
  const { data } = await api.post("/user/refresh");
  setAccessToken(data.access_token);
};
