import { GraphNode, GraphEdge } from 'reagraph';
import { DependencyProviderInterface } from './DependencyProvider'
import YAML from 'yaml'
import { string } from 'yaml/dist/schema/common/string';
import { Comparator, SimpleSet } from 'typescript-super-set';

export class CocoaPodsProvider implements DependencyProviderInterface {
    name: string
    resolvedFileName: string
    isValid: Boolean
    graph: { nodes: GraphNode[]; edges: GraphEdge[]; } | undefined

    constructor() {
        this.name = 'CocoaPods'
        this.resolvedFileName = 'Podfile.lock'
        this.isValid = false
    }

    removeTextInParentheses(text: string): string {
        return text.replace(/\(.*?\)/g, '').trim()
    }

    updateResolvedFile(file: string) {
        const data = YAML.parse(file) as { PODS: any[] }
        if (typeof data === 'object') {
            this.isValid = true
            let nodes = new SimpleSet<GraphNode>((obj1, obj2) => obj1.id === obj2.id ? 0 : 1)
            let edges = new SimpleSet<GraphEdge>((obj1, obj2) => obj1.id === obj2.id ? 0 : 1)
            data.PODS.forEach(e => {
                if (typeof e === 'string') {
                    nodes.add({ id: this.removeTextInParentheses(e), label: this.removeTextInParentheses(e) })
                } else {
                    for (const key in e) {
                        nodes.add({ id: this.removeTextInParentheses(key), label: this.removeTextInParentheses(key) })
                        const valueArray = e[key];
                        for (const value of valueArray) {
                            nodes.add({ id: this.removeTextInParentheses(value), label: this.removeTextInParentheses(value) })
                            edges.add({ id: this.removeTextInParentheses(key) + this.removeTextInParentheses(value), source: this.removeTextInParentheses(key), target: this.removeTextInParentheses(value) })
                        }
                    }
                }
            })
            this.graph = { nodes: Array.from(nodes), edges: Array.from(edges) }
        } else {
            this.isValid = false
        }
    }

    updateMockResolvedFile() {
        const mock = `
PODS:
  - 1PasswordExtension (1.8.5)
  - AFNetworking (3.2.1):
    - AFNetworking/NSURLSession (= 3.2.1)
    - AFNetworking/Reachability (= 3.2.1)
    - AFNetworking/Security (= 3.2.1)
    - AFNetworking/Serialization (= 3.2.1)
    - AFNetworking/UIKit (= 3.2.1)
  - AFNetworking/NSURLSession (3.2.1):
    - AFNetworking/Reachability
    - AFNetworking/Security
    - AFNetworking/Serialization
  - AFNetworking/Reachability (3.2.1)
  - AFNetworking/Security (3.2.1)
  - AFNetworking/Serialization (3.2.1)
  - AFNetworking/UIKit (3.2.1):
    - AFNetworking/NSURLSession
  - Particle-SDK (0.8.1):
    - Particle-SDK/Helpers (= 0.8.1)
    - Particle-SDK/SDK (= 0.8.1)
  - Particle-SDK/Helpers (0.8.1):
    - AFNetworking (~> 3.0)
  - Particle-SDK/SDK (0.8.1):
    - AFNetworking (~> 3.0)
    - Particle-SDK/Helpers
  - ParticleSetup (0.9.0):
    - ParticleSetup/Comm (= 0.9.0)
    - ParticleSetup/Core (= 0.9.0)
  - ParticleSetup/Comm (0.9.0)
  - ParticleSetup/Core (0.9.0):
    - 1PasswordExtension
    - Particle-SDK
    - ParticleSetup/Comm
        `
        this.updateResolvedFile(mock)
    }
}