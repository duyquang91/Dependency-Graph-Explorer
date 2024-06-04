import Graph, { GraphEdge, GraphNode } from 'reagraph'
import { CocoaPodsProvider } from './CocoaPodsProvider'

type Graph = {
    nodes: Graph.GraphNode[]
    edges: Graph.GraphEdge[]
}

export interface DependencyProviderInterface {
  name: string
  resolvedFileName: string
  isValid: Boolean
  graph: Graph | undefined
  /**
    Update `isValid` & `graph` in this func
  */
  updateResolvedFile(file: string): void
}

  /**
    Return a new sub-graph from a roor node
  */
export function getSubgraph(nodeId: string, graphData: Graph): Graph {
    const visited = new Set<string>()
    const subgraphNodes: GraphNode[] = []
    const subgraphEdges: GraphEdge[] = []
  
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