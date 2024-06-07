import { DependencyProviderBase } from './DependencyProviderBase'
import YAML from 'yaml'
import { SimpleSet } from 'typescript-super-set';

export class CocoaPodsProvider extends DependencyProviderBase {

  constructor() {
    super('CocoaPods', 'PodFile.lock')
  }

  removeTextInParentheses(text: string): string {
    return text.replace(/\(.*?\)/g, '').trim()
  }

  setGraphFromFile(file: string) {
    const data = YAML.parse(file) as { PODS: any[] }
    if (typeof data === 'object') {
      let nodes = new Set<string>
      let edges = new SimpleSet<{source:string, target:string}>((obj1, obj2) => obj1.source === obj2.source && obj1.target === obj2.target ? 0 : 1)
      data.PODS.forEach(e => {
        if (typeof e === 'string') {
          nodes.add(this.removeTextInParentheses(e))
        } else {
          for (const key in e) {
            nodes.add(this.removeTextInParentheses(key))
            const valueArray = e[key];
            for (const value of valueArray) {
              nodes.add( this.removeTextInParentheses(value))
              edges.add({source: this.removeTextInParentheses(key), target: this.removeTextInParentheses(value) })
            }
          }
        }
      })
      this.graph = { nodes: Array.from(nodes), edges: Array.from(edges) }
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
    this.setGraphFromFile(mock)
  }
}