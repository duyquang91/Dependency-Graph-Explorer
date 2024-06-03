import React, { useContext } from "react"
import { GraphCanvas, darkTheme, lightTheme } from "reagraph"
import { MockDependencyProvider } from "./DependencyManagerProviders/DependencyProvider"
import { useParams } from "react-router-dom"
import { dependencyManagerProviders } from "./DependencyManagerProviders/DependencyManagerProviders"
import { dark } from "@mui/material/styles/createPalette"
import { ThemeContext } from "@emotion/react"
import { IsDarkModeContext } from "./Base"

function GraphViewer() {
    const { index } = useParams< { index:string } >()
    const i = index === undefined ? -1 : Number(index)
    const isDarkMode = useContext(IsDarkModeContext) 
    const provider = i === -1 ? new MockDependencyProvider() : dependencyManagerProviders[i] 
    return (
        <div>
            <GraphCanvas 
                theme= {isDarkMode ? darkTheme : lightTheme }
                nodes= {provider.graph!.nodes}
                edges= {provider.graph!.edges}
            />
        </div>
    )
}

export default GraphViewer