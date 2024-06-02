import { GraphNode, GraphEdge } from 'reagraph';
import { DependencyProviderInterface } from './DependencyProvider'
import YAML from 'yaml'

export class CocoaPodsProvider implements DependencyProviderInterface {
    name: string
    resolvedFileName: string
    isValid: Boolean
    graph: { nodes: GraphNode[]; edges: GraphEdge[]; } | undefined

    updateResolvedFile(file: string) {
        this.isValid = true
        // const data = YAML.parse(file) as Map<string,any>
        // const dependencies = data.get('DEPENDENCIES') as string[]
        // console.log(dependencies)
    }

    constructor() {
        this.name = 'CocoaPods'
        this.resolvedFileName = 'Podfile.lock'
        this.isValid = false
    }
}