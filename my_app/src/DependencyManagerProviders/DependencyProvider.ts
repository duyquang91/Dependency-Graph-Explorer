import Graph from 'reagraph'
import { SwiftPackageManagerProvider } from './SwiftPackageManagerProvider'

type Graph = {
    nodes: Graph.GraphNode[]
    edges: Graph.GraphEdge[]
}

export interface DependencyProviderInterface {
    name: string
    resolvedFileName: string
    resolvedFile: string | undefined
    isValid: Boolean
    graph: Graph | undefined
}

export const dependencyManagerProviders = [
    new SwiftPackageManagerProvider()
]

export class MockDependencyProvider implements DependencyProviderInterface {
    name: string
    resolvedFileName: string
    resolvedFile: string | undefined
    isValid: Boolean
    graph: Graph | undefined
    
    constructor() {
        this.name = 'Mock'
        this.resolvedFileName = 'Mock'
        this.resolvedFile = 'Mock'
        this.isValid = true
        this.graph = {
            nodes: [
                {
                    id: 'n-1',
                    label: '1'
                },
                {
                    id: 'n-2',
                    label: '2'
                }
            ],
            edges: [
                {
                    id: '1->2',
                    source: 'n-1',
                    target: 'n-2',
                    label: 'Edge 1-2'
                }
            ]
        }
    }
}