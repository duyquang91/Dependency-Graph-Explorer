import { GraphNode, GraphEdge } from 'reagraph';
import { DependencyProviderInterface } from './DependencyProvider'

export class SwiftPackageManagerProvider implements DependencyProviderInterface {
    name: string
    resolvedFileName: string
    resolvedFile: string | undefined
    isValid: Boolean
    graph: { nodes: GraphNode[]; edges: GraphEdge[]; } | undefined

    constructor() {
        this.name = 'SwiftPackageManager'
        this.resolvedFileName = 'Package.resolved'
        this.isValid = false
    }
}