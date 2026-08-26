import axios from "axios";
export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
});

export const getNotes = async () => {
  const response = await api.get("/");
  return response.data;
};

interface User {
  email: string;
  password: string;
}

export const signup = async (user: User) => {
  const response = await api.post("/user/signup", user);
  return response;
};

export const login = async (user: User) => {
  const response = await api.post("/user/login", user);
  return response;
};
