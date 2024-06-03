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
            var nodes: { id: string, label: string }[] = []
            data.PODS.forEach(e => {
                if (typeof e === 'string') {
                    nodes.push({ id: e, label: e })
                } else {
                    for (const key in e) {
                        nodes.push({ id: key, label: key })
                        const valueArray = e[key];
                        for (const value of valueArray) {
                            nodes.push({ id: value, label: value })
                        }
                    }
                }
            })
            this.graph = { nodes: nodes, edges: [] }
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