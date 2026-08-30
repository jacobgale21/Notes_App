import { useQuery } from "@tanstack/react-query";
import { createGraph, getGraphById, getGraphs } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storeGraph } from "../api"; // POST, returns Graph
import type { Graph } from "../data/types";

export function useGenerateGraph() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notes: string) => {
      const graph = await storeGraph(notes);
      return graph;
    },
    onSuccess: (graph: Graph) => {
      queryClient.setQueryData(["graphs", graph.id], graph);
      queryClient.invalidateQueries({ queryKey: ["graphs"], exact: true });
    },
  });
}

export function useGraph(id: string) {
  return useQuery({
    queryKey: ["graphs", id],
    enabled: !!id,
    queryFn: () => getGraphById(id),
    staleTime: Infinity,
  });
}

export function useGetGraphs() {
  return useQuery({
    queryKey: ["graphs"],
    queryFn: () => getGraphs(),
  });
}
