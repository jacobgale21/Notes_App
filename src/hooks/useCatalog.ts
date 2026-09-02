import { useQuery } from "@tanstack/react-query";
import {
  createNode,
  deleteGraph,
  getGraphById,
  getGraphs,
  storeGraph,
  createEdge,
  patchNode,
  deleteNode,
} from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Graph,
  GraphSummary,
  NodeCreateInput,
  RelationCreate,
  UpdateNodeVariables,
  GraphNode,
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
    onSuccess: (createdNode) => {
      queryClient.setQueryData(
        ["graphs", createdNode.graph_id],
        (old: Graph | undefined) => {
          if (!old) return old;
          return {
            ...old,
            nodes: [...old.nodes, createdNode],
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
    onSuccess: (createdEdge) => {
      queryClient.setQueryData(
        ["graphs", createdEdge.graph_id],
        (old: Graph | undefined) => {
          if (!old) return old;
          return {
            ...old,
            edges: [...old.edges, createdEdge],
          };
        },
      );
    },
  });
}

export function usePatchNode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ graph_id, node_id, node }: UpdateNodeVariables) =>
      patchNode(graph_id, node_id, node),
    onSuccess: (updatedNode) => {
      queryClient.setQueryData(
        ["graphs", updatedNode.graph_id],
        (old: Graph | undefined) => {
          if (!old) return old;
          return {
            ...old,
            nodes: old.nodes.map((node) =>
              node.id === updatedNode.id ? updatedNode : node,
            ),
          };
        },
      );
    },
  });
}

export function useDeleteNode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (node: GraphNode) => deleteNode(node.graph_id, node.id),
    onSuccess: (_data, deleted) => {
      queryClient.setQueryData(
        ["graphs", deleted.graph_id],
        (old: Graph | undefined) => {
          if (!old) return old;
          return {
            ...old,
            nodes: old.nodes.filter((n) => n.id !== deleted.id),
            edges: old.edges.filter(
              (e) => e.source !== deleted.id && e.target !== deleted.id,
            ),
          };
        },
      );
    },
  });
}
