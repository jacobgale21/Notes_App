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
