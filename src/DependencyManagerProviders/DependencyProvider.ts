
export type Node = {
  id: string
}

export type Edge = {
  id: string,
  source: string,
  target: string
}
export type GraphData = {
    nodes: Node[]
    edges: Edge[]
}

export interface DependencyProviderInterface {
  name: string
  resolvedFileName: string
  isValid: Boolean
  graph: GraphData | undefined
  /**
    Update `isValid` & `graph` in this func
  */
  updateResolvedFile(file: string): void
}

  /**
    Return a new sub-graph from a roor node
  */
export function getSubgraph(nodeId: string, graphData: GraphData): GraphData {
    const visited = new Set<string>()
    const subgraphNodes: Node[] = []
    const subgraphEdges: Edge[] = []
  
    const traverse = (currentNode: any) => {
      visited.add(currentNode.id);
      subgraphNodes.push(currentNode);
  
      const childEdges = graphData.edges.filter(
        (edge) => edge.source === currentNode.id
      );
  
      for (const edge of childEdges) {
        if (!visited.has(edge.target)) {
          traverse(graphData.nodes.find((node) => node.id === edge.target));
        }
        subgraphEdges.push(edge);
      }
    }
  
    traverse(graphData.nodes.find((node) => node.id === nodeId));
    return { nodes: subgraphNodes, edges: subgraphEdges };
  }