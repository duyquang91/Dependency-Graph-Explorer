import React from "react"
import { GraphCanvas } from "reagraph"
import { MockDependencyProvider } from "./DependencyManagerProviders/DependencyProvider"
import { useParams } from "react-router-dom"
import { dependencyManagerProviders } from "./DependencyManagerProviders/DependencyManagerProviders"

function GraphViewer() {
    const { index } = useParams< { index:string } >()
    const i = index == undefined ? -1 : Number(index) 
    const provider = i == -1 ? new MockDependencyProvider() : dependencyManagerProviders[i] 
    return (
        <div>
            <GraphCanvas
                nodes= {provider.graph!.nodes}
                edges= {provider.graph!.edges}
            />
        </div>
    )
}

export default GraphViewer