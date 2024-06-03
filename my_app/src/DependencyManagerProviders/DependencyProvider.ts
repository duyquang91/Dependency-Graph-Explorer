import Graph from 'reagraph'
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

export class MockDependencyProvider implements DependencyProviderInterface {
    name: string
    resolvedFileName: string
    isValid: Boolean
    graph: Graph | undefined
    updateResolvedFile(file: string) {
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
                }
            ]
        }
    }
    
    constructor() {
        this.name = 'Mock'
        this.isValid = false
        this.resolvedFileName = 'Mock'
        this.updateResolvedFile('')
    }
}