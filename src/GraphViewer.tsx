import { useContext, useEffect, useRef } from "react"
import * as MyGraph from "./DependencyManagerProviders/DependencyProvider"
import { useParams } from "react-router-dom"
import { dependencyManagerProviders } from "./DependencyManagerProviders/DependencyManagerProviders"
import { IsDarkModeContext, IsMobileContext } from "./Base"
import { Autocomplete, TextField } from "@mui/material"
import { CocoaPodsProvider } from "./DependencyManagerProviders/CocoaPodsProvider"
import { Graph, GraphData } from "@antv/g6"

function MockProvider(): CocoaPodsProvider {
  const pod = new CocoaPodsProvider()
  pod.updateMockResolvedFile()
  return pod
}

function GraphViewer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { index } = useParams<{ index: string }>()
  const i = index === undefined ? -1 : Number(index)
  const isDarkMode = useContext(IsDarkModeContext)
  const isMobile = useContext(IsMobileContext)
  const provider = i === -1 ? MockProvider() : dependencyManagerProviders[i]
  var graphView: Graph | undefined
  const rootNodeChanged = (id: string) => {
    if (id === '') { return }
    const graph = MyGraph.getSubgraph(id!, provider.graph!)
    graphView?.setData(graph)
    graphView?.render()
  }
  const options = provider.graph!.nodes.map((option) => {
    const firstLetter = option.id[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      id: option.id
    }
  })

  useEffect(() => {
    if (typeof graphView !== 'undefined') { return }
    graphView = new Graph({
      container: containerRef.current!,
      theme: isDarkMode ? 'dark' : 'light',
      autoFit: 'view',
      autoResize: true,
      data: provider.graph!,
      node: {
        style: {
          labelText: (node) => node.id
        }
      },
      edge: {
        style: {
          endArrow: true
        }
      },
      layout: {
        type: 'force',
        preventOverlap: true,
        nodeSize: 24
      },
      behaviors: [

        {
          type: 'hover-element',
          degree: 1,
        },
      ],
    })
    graphView.render()
  }, [])

  return (
    <div>
      <Autocomplete
        options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
        groupBy={(option) => option.firstLetter}
        getOptionLabel={(option) => option.id}
        onChange={(e, v, r) => { rootNodeChanged(v?.id ?? '') }}
        blurOnSelect
        renderInput={(params) => <TextField {...params} label="Root node:" />} />
      <div ref={containerRef} className="GraphCanvas" />
    </div>
  )
}

export default GraphViewer