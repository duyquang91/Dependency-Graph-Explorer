import { useContext, useEffect, useRef, useState } from "react"
import { GraphCanvas, GraphCanvasRef, darkTheme, lightTheme, useSelection, InternalGraphNode, CollapseProps } from "reagraph"
import { getSubgraph } from "./DependencyManagerProviders/DependencyProvider"
import { useParams } from "react-router-dom"
import { dependencyManagerProviders } from "./DependencyManagerProviders/DependencyManagerProviders"
import { IsDarkModeContext, IsMobileContext } from "./Base"
import { Autocomplete, Menu, MenuItem, TextField } from "@mui/material"
import { CocoaPodsProvider } from "./DependencyManagerProviders/CocoaPodsProvider"
import { ThreeEvent } from '@react-three/fiber'

function MockProvider(): CocoaPodsProvider {
  const pod = new CocoaPodsProvider()
  pod.updateMockResolvedFile()
  return pod
}

function GraphViewer() {
  const [selectedNode, setSelectedNode] = useState('')
  const [openMenu, setOpenMenu] = useState(false)
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<string[]>([])
  const [menuPos, setMenuPos] = useState({top: 0, left: 0})
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
    setCollapsedNodeIds([])
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

  const onNodeClick = ((node: InternalGraphNode, props?: CollapseProps, event?: ThreeEvent<MouseEvent>) => {
    setSelectedNode(node.id)
    setMenuPos({top: event?.y ?? 0, left: event?.x ?? 0})
    setOpenMenu(true)
  })

  const collapseClick = () => {
    setOpenMenu(false)
    if (!collapsedNodeIds.includes(selectedNode)) {
      setCollapsedNodeIds([...collapsedNodeIds, selectedNode])
    } else {
      setCollapsedNodeIds(collapsedNodeIds.filter(n => n !== selectedNode))
    }
    console.log(collapsedNodeIds)
  }

  const {
    selections,
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
      <div style={{ zIndex: 9, position: 'absolute', left: 15, top: 15, width: `${isMobile ? '90%' : '40%'}`, padding: 1 }}>
        <Autocomplete
          options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
          groupBy={(option) => option.firstLetter}
          onChange={(e, v) => { rootNodeChanged(v?.id ?? '') }}
          blurOnSelect
          renderInput={(params) => <TextField {...params} label="Root node:" />} />
      </div>
      <ContextMenu></ContextMenu>
      <GraphCanvas
        ref={ref}
        selections={selections}
        collapsedNodeIds={collapsedNodeIds}
        onNodeClick={onNodeClick}
        onCanvasClick={onCanvasClick}
        onNodePointerOver={onNodePointerOver}
        onNodePointerOut={onNodePointerOut}
        theme={isDarkMode ? darkTheme : lightTheme}
        nodes={nodes}
        edges={edges} />
    </div>
  )

  function ContextMenu() {
    return (
      <div className="Center" style={{ zIndex: 15, position: 'absolute' }}>
        <Menu open={openMenu} onClose={() => setOpenMenu(false)} anchorReference='anchorPosition' anchorPosition={menuPos}>
          <MenuItem>Find children</MenuItem>
          <MenuItem>Find parents</MenuItem>
          <MenuItem onClick={collapseClick}>Expand / Collapse</MenuItem>
        </Menu>
      </div>
    )
  }
}


export default GraphViewer