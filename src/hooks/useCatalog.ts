import { useQuery } from "@tanstack/react-query";
import { createGraph, getGraph, getGraphs } from "../api";

export function createGraphHook() {
  return useQuery({
    queryKey: ["graphs"],
    queryFn: createGraph,
  });
}

export function useGraph(id: string) {
  return useQuery({
    queryKey: ["graphs"],
    queryFn: () => getGraph(id),
  });
}

export function useGetGraphs() {
  return useQuery({
    queryKey: ["graphs"],
    queryFn: () => getGraphs(),
  });
}
