import { useQuery } from "@tanstack/react-query";
import { createGraph, getGraph } from "../api";

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
