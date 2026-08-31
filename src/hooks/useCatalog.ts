import { useQuery } from "@tanstack/react-query";
import { deleteGraph, getGraphById, getGraphs, storeGraph } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Graph, GraphSummary } from "../data/types";

export function useStoreGraph() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const graph = await storeGraph(formData);
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

export function useDeleteGraph() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGraph(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ["graphs", id] });
      queryClient.setQueryData(["graphs"], (old: GraphSummary[] | undefined) =>
        old?.filter((g) => g.id !== id),
      );
    },
  });
}
