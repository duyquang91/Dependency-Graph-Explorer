import React from "react"
import { GraphCanvas } from "reagraph"
import { MockDependencyProvider } from "./DependencyManagerProviders/DependencyProvider"

function GraphViewer() {
    const mock = new MockDependencyProvider
    return (
        <div>
            <GraphCanvas
                nodes= {mock.graph!.nodes}
                edges= {mock.graph!.edges}
            />
        </div>
    )
}

export default GraphViewer