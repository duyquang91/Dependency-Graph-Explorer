
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
  * If `prefix` is empty then return original graph otherwise filter out unmatched nodes
  */
  abstract setGraphFromFile(file: string, prefix:string): void

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