
type GraphType = {
    nodes: string[]
    edges: { source: string, target: string }[]
}

export abstract class DependencyProviderBase {
  name: string
  resolvedFileName: string
  graph?: GraphType

  constructor(name: string, resolvedFileName: string) {
    this.name = name
    this.resolvedFileName = resolvedFileName
  }

  /**
  * Update `graph` in this func otherwise invalid file format will be thrown.
  */
  abstract setGraphFromFile(file: string): void
  
  getNewGraph(prefix: string): GraphType {
    const graph = this.graph ?? { nodes: [], edges: [] }
    return { 
      nodes: graph.nodes.filter(e => e.substring(0, prefix.length-1).toLowerCase === prefix.toLowerCase),
      edges: graph.edges.filter(e => e.source.substring(0, prefix.length-1).toLowerCase === prefix.toLowerCase && e.target.substring(0, prefix.length-1).toLowerCase === prefix.toLowerCase),
    }
  }

  /**
  * Return a new sub-graph from a root node
  */
  getSubgraph(nodeId: string): GraphType {
    const graph = this.graph ?? { nodes: [], edges: [] }
    const visited = new Set<string>()
      const subgraphNodes: string[] = []
      const subgraphEdges: { source: string, target: string }[] = []
    
      const traverse = (currentNode: any) => {
        visited.add(currentNode);
        subgraphNodes.push(currentNode);
    
        const childEdges = graph.edges.filter(
          (edge) => edge.source === currentNode
        );
    
        for (const edge of childEdges) {
          if (!visited.has(edge.target)) {
            traverse(this.graph!.nodes.find((node) => node === edge.target));
          }
          subgraphEdges.push(edge);
        }
      }
    
      traverse(graph.nodes.find((node) => node === nodeId));
      return { nodes: subgraphNodes, edges: subgraphEdges };
  }
}