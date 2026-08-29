import { useQuery } from "@tanstack/react-query";
import { createGraph, getGraphById, getGraphs } from "../api";

export function createGraphHook() {
  return useQuery({
    queryKey: ["graphs"],
    queryFn: createGraph,
  });
}

export function useGraph(id: string) {
  return useQuery({
    queryKey: ["graphs", id],
    enabled: !!id,
    queryFn: () => getGraphById(id),
  });
}

export function useGetGraphs() {
  return useQuery({
    queryKey: ["graphs"],
    queryFn: () => getGraphs(),
  });
}
