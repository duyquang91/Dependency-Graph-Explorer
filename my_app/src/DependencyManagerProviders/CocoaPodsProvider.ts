import { GraphNode, GraphEdge } from 'reagraph';
import { DependencyProviderInterface } from './DependencyProvider'
import YAML from 'yaml'

export class CocoaPodsProvider implements DependencyProviderInterface {
    name: string
    resolvedFileName: string
    isValid: Boolean
    graph: { nodes: GraphNode[]; edges: GraphEdge[]; } | undefined

    updateResolvedFile(file: string) {
        const data = YAML.parse(file) as { PODS: {[key:string]: string[]}[] }
        if (typeof data === 'object') {
            this.isValid = true
            var nodes: {id:string, label:string}[] = []
            data.PODS.forEach(e => 
                { 
                    for (const [key, value] of Object.entries(e)) {
                        nodes.push({id: key, label:key})
                    }
                }
            )
            this.graph = {nodes: nodes, edges:[]}
            console.log(this.graph)
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