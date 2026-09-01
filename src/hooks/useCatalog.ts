import { useQuery } from "@tanstack/react-query";
import {
  createNode,
  deleteGraph,
  getGraphById,
  getGraphs,
  storeGraph,
  createEdge,
} from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Graph,
  GraphSummary,
  NodeCreateInput,
  GraphNode,
  Relation,
  RelationCreate,
} from "../data/types";

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

export function useCreateNode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (node_input: NodeCreateInput) => createNode(node_input),
    onSuccess: (createdNode, variables) => {
      queryClient.setQueryData(
        ["graphs", variables.graph_id],
        (old: Graph | undefined) => {
          if (!old) return old;
          return {
            ...old,
            nodes: [
              ...old.nodes,
              {
                ...createdNode,
                id: String(createdNode.id),
                graph_id: variables.graph_id,
              },
            ],
          };
        },
      );
    },
  });
}

export function useCreateEdge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (edge_input: RelationCreate) => createEdge(edge_input),
    onSuccess: (createdEdge, variables) => {
      queryClient.setQueryData(
        ["graphs", variables.graph_id],
        (old: Graph | undefined) => {
          if (!old) return old;
          return {
            ...old,
            edges: [
              ...old.edges,
              {
                id: String(createdEdge.id),
                source: String(createdEdge.source),
                target: String(createdEdge.target),
                rel_type: createdEdge.rel_type,
                graph_id: variables.graph_id,
              },
            ],
          };
        },
      );
    },
  });
}
