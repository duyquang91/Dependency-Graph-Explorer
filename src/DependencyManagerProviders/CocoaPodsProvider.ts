import { DependencyProviderBase } from './DependencyProviderBase'
import YAML from 'yaml'
import { SimpleSet } from 'typescript-super-set';

export class CocoaPodsProvider extends DependencyProviderBase {

  constructor() {
    super('CocoaPods', 'Podfile.lock')
  }

  formatPodName(text: string, prefix: string): { name: string, isValid: boolean } {
    const pod = text.replace(/\(.*?\)/g, '').trim()
    const isValid = prefix === '' || pod.substring(0, prefix.length).toLowerCase() === prefix.toLowerCase()
    return { name: pod.substring(prefix.length), isValid:  isValid}
  }

  setGraphFromFile(file: string, prefix: string) {
    try {
      const data = YAML.parse(file) as { PODS: any[] }
      if (typeof data === 'object') {
        let nodes = new Set<string>
        let edges = new SimpleSet<{ source: string, target: string }>((obj1, obj2) => obj1.source === obj2.source && obj1.target === obj2.target ? 0 : 1)
        data.PODS.forEach(e => {
          if (typeof e === 'string') {
            const pod = this.formatPodName(e, prefix)
            if (pod.isValid) {
              nodes.add(pod.name)
            }
          } else {
            for (const key in e) {
              const pod = this.formatPodName(key, prefix)
              if (pod.isValid) {
                nodes.add(pod.name)
              }
              const valueArray = e[key];
              for (const value of valueArray) {
                const pod = this.formatPodName(value, prefix)
                if (pod.isValid) {
                  nodes.add(pod.name)
                }
                const podKey = this.formatPodName(key, prefix)
                const podValue = this.formatPodName(value, prefix)
                if (podKey.isValid && podValue.isValid) {
                  edges.add({ source: podKey.name, target: podValue.name })
                }
              }
            }
          }
        })
        this.graph = { nodes: Array.from(nodes), edges: Array.from(edges) }
      }
    } catch {
      this.graph = undefined
      console.log('Failed to parse the data')
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
    this.setGraphFromFile(mock, '')
  }
}