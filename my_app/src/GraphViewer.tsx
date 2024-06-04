import React, { ChangeEvent, ChangeEventHandler, useContext, useEffect, useRef, useState } from "react"
import { GraphCanvas, GraphCanvasRef, darkTheme, lightTheme, useSelection } from "reagraph"
import { DependencyProviderInterface, getSubgraph } from "./DependencyManagerProviders/DependencyProvider"
import { useParams } from "react-router-dom"
import { dependencyManagerProviders } from "./DependencyManagerProviders/DependencyManagerProviders"
import { dark } from "@mui/material/styles/createPalette"
import { ThemeContext } from "@emotion/react"
import { IsDarkModeContext, IsMobileContext } from "./Base"
import { Autocomplete, Divider, Stack, TextField } from "@mui/material"
import { CocoaPodsProvider } from "./DependencyManagerProviders/CocoaPodsProvider"
import * as fs from 'fs';

function MockProvider(): CocoaPodsProvider {
  const pod = new CocoaPodsProvider()
  pod.updateMockResolvedFile()
  return pod
}

function GraphViewer() {
  const ref = useRef<GraphCanvasRef | null>(null)
  const { index } = useParams<{ index: string }>()
  const i = index === undefined ? -1 : Number(index)
  const isDarkMode = useContext(IsDarkModeContext)
  const isMobile = useContext(IsMobileContext)
  const provider = i === -1 ? MockProvider() : dependencyManagerProviders[i]
  const [nodes, setNodes] = useState(provider.graph!.nodes)
  const [edges, setEdges] = useState(provider.graph!.edges)
  const rootNodeChanged = (value: string) => {
    if (value === '') { return } 
    let graph = getSubgraph(value!, provider.graph!)
    setNodes(graph.nodes)
    setEdges(graph.edges)
  }
  const options = provider.graph!.nodes.map((option) => {
    const firstLetter = option.id[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    }
  })
  useEffect(() => {
    ref.current?.fitNodesInView()
    ref.current?.centerGraph()
    ref.current?.resetControls()
  }, [nodes, edges])

  const {
    selections,
    actives,
    onNodeClick,
    onCanvasClick,
    onNodePointerOver,
    onNodePointerOut
  } = useSelection({
    ref: ref,
    nodes: nodes,
    edges: edges,
    pathSelectionType: 'out',
    pathHoverType: 'out'
  })

  return (
    <div>
      <div style={{
        zIndex: 9,
        position: 'absolute',
        left: 15,
        top: 15,
        width: `${ isMobile ? '90%' : '50%' }`,
        padding: 1,
      }}>
          <Autocomplete
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            onChange={(e, v, r) => { rootNodeChanged(v?.id ?? '') }}
            renderInput={(params) => <TextField {...params} label="Root node:" />}
          />
      </div>
      <GraphCanvas
            ref={ref}
            selections={selections}
            actives={actives}
            onNodeClick={onNodeClick}
            onCanvasClick={onCanvasClick}
            onNodePointerOver={onNodePointerOver}
            onNodePointerOut={onNodePointerOut}
            theme={isDarkMode ? darkTheme : lightTheme}
            nodes={nodes}
            edges={edges}
          />
    </div>
  )
}


export default GraphViewer