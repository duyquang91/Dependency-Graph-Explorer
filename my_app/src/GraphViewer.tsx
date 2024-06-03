import React, { useContext } from "react"
import { GraphCanvas, darkTheme, lightTheme } from "reagraph"
import { DependencyProviderInterface, MockDependencyProvider } from "./DependencyManagerProviders/DependencyProvider"
import { useParams } from "react-router-dom"
import { dependencyManagerProviders } from "./DependencyManagerProviders/DependencyManagerProviders"
import { dark } from "@mui/material/styles/createPalette"
import { ThemeContext } from "@emotion/react"
import { IsDarkModeContext } from "./Base"
import { Autocomplete, Stack, TextField } from "@mui/material"

function GraphViewer() {
    const { index } = useParams<{ index: string }>()
    const i = index === undefined ? -1 : Number(index)
    const isDarkMode = useContext(IsDarkModeContext)
    const provider = i === -1 ? new MockDependencyProvider() : dependencyManagerProviders[i]

    return (
        <Stack spacing={1}>
            <GraphCanvas sizingType='centrality'
                theme={isDarkMode ? darkTheme : lightTheme}
                nodes={provider.graph!.nodes}
                edges={provider.graph!.edges}
            />
            {NodesFilter(provider)}
        </Stack>
    )
}

function NodesFilter(provider: DependencyProviderInterface) {
    return (
        <Autocomplete
        disablePortal
        options={provider.graph!.nodes}
        renderInput={(params) => <TextField {...params} label="Node" />}
      />
    )
}

export default GraphViewer