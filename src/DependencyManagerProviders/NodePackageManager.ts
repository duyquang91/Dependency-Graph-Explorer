import { js } from 'three/examples/jsm/nodes/Nodes'
import { DependencyProviderBase } from './DependencyProviderBase'
import { SimpleSet } from 'typescript-super-set'

interface Package {
    packages: {
        [key: string]: any
    }
}

interface MainPackage {
    name: string,
    dependencies: {
        [key: string]: string
    },
    devDependencies: {
        [key: string]: string
    }
}

interface OtherPackage {
    dev?: boolean
    dependencies?: {
        [key: string]: string
    }
}

export class NodePackageManager extends DependencyProviderBase {


    constructor() {
        super('npm', 'package-lock.json')
    }

    formatPackageName(text: string, prefix: string): { name: string, isValid: boolean } {
        const node = text.replace('node_modules/@', '')
        const isValid = prefix === '' || node.substring(0, prefix.length).toLowerCase() === prefix.toLowerCase()
        return { name: node.substring(prefix.length), isValid: isValid }
    }

    getKey(dependencies: { [key: string]: string }, prefix: string): string[] {
        let nodes = Array<string>()
        for (const key in dependencies) {
            const node = this.formatPackageName(key, prefix)
            if (node.isValid && Object.prototype.hasOwnProperty.call(dependencies, key)) {
                nodes.push(node.name)
            }
        }
        return nodes
    }

    setGraphFromFile(file: string, prefix: string) {
        try {
            let json = JSON.parse(file) as Package
            let nodes = new Set<string>
            let edges = new SimpleSet<{ source: string, target: string }>((obj1, obj2) => obj1.source === obj2.source && obj1.target === obj2.target ? 0 : 1)
            const mainPackage = json.packages[''] as MainPackage
            nodes.add(mainPackage.name)
            this.getKey(mainPackage.dependencies, prefix).forEach(e => {
                nodes.add(e)
                edges.add({ source: mainPackage.name, target: e })
            })

            for (const key in json.packages) {
                if (Object.prototype.hasOwnProperty.call(json.packages, key) && key !== '') {
                    const pck = json.packages[key] as OtherPackage
                    const name = key.replace('node_modules/', '')
                    if (name.substring(0,7) === '@types/') { continue }
                    nodes.add(name)
                    const isDev = pck.dev ?? false
                    if (pck.dependencies && !isDev) {
                        this.getKey(pck.dependencies, prefix).filter(e => e.substring(0,7) !== '@types/').forEach(e => {
                            edges.add({ source: name, target: e })
                        })
                    }
                }
            }

            this.graph = { nodes: Array.from(nodes), edges: Array.from(edges) }
        } catch (error) {
            this.graph = undefined
            console.log(error)
        }
    }
}
