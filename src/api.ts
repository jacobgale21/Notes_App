import axios from "axios";
import { getAccessToken, setAccessToken } from "./auth";
import type {
  Graph,
  NodeCreateInput,
  User,
  GraphNode,
  RelationCreate,
  Relation,
  NodePatchInput,
  RelationPatchInput,
} from "./data/types";
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
    const url = String(original?.url ?? "");
    const isAuthRoute =
      url.includes("/user/refresh") ||
      url.includes("/user/login") ||
      url.includes("/user/signup");
    if (error.response?.status !== 401 || original._retry || isAuthRoute) {
      throw error;
    }
    original._retry = true;
    try {
      const { data } = await api.post("/user/refresh");
      setAccessToken(data.access_token);
      original.headers.Authorization = `Bearer ${data.access_token}`;
      return api.request(original);
    } catch (refreshError) {
      setAccessToken(null);
      throw refreshError;
    }
  },
);

export const getNotes = async () => {
  const response = await api.get("/");
  return response.data;
};

export const signup = async (user: User) => {
  try {
    const { data } = await api.post("/user/signup", user);
    setAccessToken(data.access_token);
  } catch (error) {
    setAccessToken(null);
    throw error;
  }
};

export const login = async (user: User) => {
  try {
    const { data } = await api.post("/user/login", user);
    setAccessToken(data.access_token);
  } catch (error) {
    setAccessToken(null);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post("/user/logout");
  } finally {
    setAccessToken(null);
  }
};

export const refresh = async () => {
  try {
    const { data } = await api.post("/user/refresh");
    setAccessToken(data.access_token);
  } catch (error) {
    setAccessToken(null);
    throw error;
  }
};

export const createGraph = async (): Promise<Graph> => {
  try {
    const { data } = await api.post<Graph>("/graph");
    return data;
  } catch (error) {
    throw error;
  }
};

export const getGraphById = async (id: string) => {
  console.log("getGraphById", id);
  try {
    const { data } = await api.get(`/graph/get/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getGraphs = async () => {
  try {
    const { data } = await api.get("/graph/getall");
    return data;
  } catch (error) {
    throw error;
  }
};

export const storeGraph = async (formData: FormData): Promise<Graph> => {
  try {
    const { data } = await api.post<Graph>("/graph/generate", formData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteGraph = async (id: string) => {
  try {
    await api.delete(`/graph/delete/${id}`);
  } catch (error) {
    throw error;
  }
};

export const createNode = async (node: NodeCreateInput): Promise<GraphNode> => {
  try {
    const { data } = await api.post<GraphNode>(
      `/graph/${node.graph_id}/node`,
      node,
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const createEdge = async (edge: RelationCreate): Promise<Relation> => {
  try {
    const { data } = await api.post<Relation>(
      `/graph/${edge.graph_id}/edge`,
      edge,
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const patchNode = async (
  graph_id: string,
  node_id: string,
  node: NodePatchInput,
): Promise<GraphNode> => {
  try {
    const { data } = await api.patch<GraphNode>(
      `/graph/${graph_id}/node/${node_id}`,
      node,
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteNode = async (graph_id: string, node_id: string) => {
  try {
    await api.delete(`/graph/${graph_id}/node/${node_id}`);
  } catch (error) {
    throw error;
  }
};

export const deleteEdge = async (graph_id: string, edge_id: string) => {
  try {
    await api.delete(`/graph/${graph_id}/edge/${edge_id}`);
  } catch (error) {
    throw error;
  }
};

export const patchEdge = async (
  graph_id: string,
  edge_id: string,
  edge: RelationPatchInput,
): Promise<Relation> => {
  try {
    const { data } = await api.patch<Relation>(
      `/graph/${graph_id}/edge/${edge_id}`,
      edge,
    );
    return data;
  } catch (error) {
    throw error;
  }
};
