import React, { ChangeEvent, ChangeEventHandler, useContext, useState } from "react"
import { GraphCanvas, darkTheme, lightTheme } from "reagraph"
import { DependencyProviderInterface, getSubgraph } from "./DependencyManagerProviders/DependencyProvider"
import { useParams } from "react-router-dom"
import { dependencyManagerProviders } from "./DependencyManagerProviders/DependencyManagerProviders"
import { dark } from "@mui/material/styles/createPalette"
import { ThemeContext } from "@emotion/react"
import { IsDarkModeContext } from "./Base"
import { Autocomplete, Divider, Stack, TextField } from "@mui/material"
import { CocoaPodsProvider } from "./DependencyManagerProviders/CocoaPodsProvider"
import * as fs from 'fs';

function MockProvider(): CocoaPodsProvider {
    const pod = new CocoaPodsProvider()
    pod.updateMockResolvedFile()
    return pod
}

function GraphViewer() {
    const { index } = useParams<{ index: string }>()
    const i = index === undefined ? -1 : Number(index)
    const isDarkMode = useContext(IsDarkModeContext)
    const provider = i === -1 ? MockProvider() : dependencyManagerProviders[i]
    const [graph, setGraph] = useState(provider.graph!)
    const rootNodeChanged = (value: string) => {
        setGraph(getSubgraph(value, provider.graph!))
    }
    const options = graph.nodes.map((option) => {
        const firstLetter = option.id[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          ...option,
        };
      });

    return (
        <Stack spacing={1}>
            <GraphCanvas
                theme={isDarkMode ? darkTheme : lightTheme}
                nodes={graph.nodes}
                edges={graph.edges}
            />
            <Autocomplete
                options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                groupBy={(option) => option.firstLetter}
                onChange={(e, v, r) => {rootNodeChanged(v!.id)}}
                renderInput={(params) => <TextField {...params} label="Node" variant='standard' />}
            />
        </Stack>
    )
}


export default GraphViewer