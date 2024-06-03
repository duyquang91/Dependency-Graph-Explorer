import { GraphNode, GraphEdge } from 'reagraph';
import { DependencyProviderInterface } from './DependencyProvider'
import YAML from 'yaml'
import { string } from 'yaml/dist/schema/common/string';

export class CocoaPodsProvider implements DependencyProviderInterface {
    name: string
    resolvedFileName: string
    isValid: Boolean
    graph: { nodes: GraphNode[]; edges: GraphEdge[]; } | undefined

    updateResolvedFile(file: string) {
        const data = YAML.parse(file) as { PODS: any[] }
        if (typeof data === 'object') {
            this.isValid = true
            var nodes: Set<GraphNode> = new Set()
            nodes.add({ id: 'PODS', label: 'PODS' })
            var edges: Set<GraphEdge> = new Set()
            data.PODS.forEach(e => {
                if (typeof e === 'string') {
                    nodes.add({ id: e, label: e })
                    edges.add({ id: 'PODS'+e, source: 'PODS', target: e})
                } else {
                    for (const key in e) {
                        nodes.add({ id: key, label: key })
                        edges.add({ id: 'PODS'+key, source: 'PODS', target: key})
                        const valueArray = e[key];
                        for (const value of valueArray) {
                            nodes.add({ id: value, label: value })
                            edges.add({ id: key+value, source: key, target: value})
                        }
                    }
                }
            })
            this.graph = { nodes: Array.from(nodes), edges: Array.from(edges) }
        } else {
            this.isValid = false
        }
    }

    constructor() {
        this.name = 'CocoaPods'
        this.resolvedFileName = 'Podfile.lock'
        this.isValid = false
    }
}