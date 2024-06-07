import { useContext, useEffect, useRef, useState } from "react"
import { GraphCanvas, GraphCanvasRef, darkTheme, lightTheme, InternalGraphNode, CollapseProps, getAdjacents } from "reagraph"
import { useParams } from "react-router-dom"
import { dependencyManagerProviders } from "./DependencyManagerProviders/DependencyManagerProviders"
import { IsDarkModeContext, IsMobileContext } from "./Base"
import { Autocomplete, Button, Divider, IconButton, InputAdornment, Menu, MenuItem, Stack, TextField } from "@mui/material"
import { CocoaPodsProvider } from "./DependencyManagerProviders/CocoaPodsProvider"
import { ThreeEvent } from '@react-three/fiber'
import { Clear } from "@mui/icons-material"

function MockProvider(): CocoaPodsProvider {
  const pod = new CocoaPodsProvider()
  pod.updateMockResolvedFile()
  return pod
}

function GraphViewer() {
  const [prefix, setPrefix] = useState('')
  const [selections, setSelections] = useState<string[]>([])
  const [actives, setActives] = useState<string[]>([])
  const [hoverActives, setHoverActives] = useState<string[]>([])
  const [selectedNode, setSelectedNode] = useState('')
  const [openMenu, setOpenMenu] = useState(false)
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<string[]>([])
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const ref = useRef<GraphCanvasRef | null>(null)
  const { index } = useParams<{ index: string }>()
  const i = index === undefined ? -1 : Number(index)
  const isDarkMode = useContext(IsDarkModeContext)
  const isMobile = useContext(IsMobileContext)
  const provider = i === -1 ? MockProvider() : dependencyManagerProviders[i]
  const [nodes, setNodes] = useState(provider.graph!.nodes)
  const [edges, setEdges] = useState(provider.graph!.edges)

  useEffect(() => {
    ref.current?.fitNodesInView()
    ref.current?.centerGraph()
    ref.current?.resetControls()
  }, [nodes, edges])

  const options = provider.graph!.nodes.map(e => {
    const firstLetter = e[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      id: e
    }
  })

  const rootNodeChanged = (value: string) => {
    if (value === '') { return }
    resetSelectionAndActive()
    let graph = provider.getSubgraph(value)
    setNodes(graph.nodes)
    setEdges(graph.edges)
    setActives([value])
    setTimeout(() => setCollapsedNodeIds([]), 500)
  }

  const onNodeClick = ((node: InternalGraphNode, props?: CollapseProps, event?: ThreeEvent<MouseEvent>) => {
    resetSelectionAndActive()
    setSelectedNode(node.id)
    setMenuPos({ top: event?.y ?? 0, left: event?.x ?? 0 })
    setOpenMenu(true)
  })

  const collapseClick = () => {
    resetSelectionAndActive()
    setOpenMenu(false)
    if (!collapsedNodeIds.includes(selectedNode)) {
      setCollapsedNodeIds([...collapsedNodeIds, selectedNode])
    } else {
      setCollapsedNodeIds(collapsedNodeIds.filter(n => n !== selectedNode))
    }
  }

  const onNodePointerOver = (node: string) => {
    const pointActives = getAdjacents(ref.current!.getGraph(), node, 'out')
    const ids = [...pointActives.nodes, ...pointActives.edges].filter(e => !actives.includes(e))
    setActives([...actives, ...ids])
    setHoverActives(ids)
  }

  const onNodePointerOut = () => {
    setActives(actives.filter(e => !hoverActives.includes(e)))
    setHoverActives([])
  }

  const findChildrenClick = () => {
    setOpenMenu(false)
    setSelections([selectedNode])
    const actives = getAdjacents(ref.current!.getGraph(), selectedNode, 'out')
    setActives([...actives.nodes, ...actives.edges])
  }

  const findParentsClick = () => {
    setOpenMenu(false)
    setSelections([selectedNode])
    const actives = getAdjacents(ref.current!.getGraph(), selectedNode, 'in')
    setActives([...actives.nodes, ...actives.edges])
  }

  const findRelationsClick = () => {
    setOpenMenu(false)
    setSelections([selectedNode])
    const actives = getAdjacents(ref.current!.getGraph(), selectedNode, 'all')
    setActives([...actives.nodes, ...actives.edges])
  }

  const onCanvasClick = () => {
    resetSelectionAndActive()
  }

  function resetSelectionAndActive() {
    setSelections([])
    setActives([])
    setHoverActives([])
  }

  return (
    <div>
      <div style={{ zIndex: 9, position: 'absolute', left: 15, top: 15, width: `${isMobile ? '90%' : '400px'}`, padding: 1 }}>
        <Stack padding={1} spacing={1}>
          <Autocomplete
            size='small'
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={e => e.firstLetter}
            getOptionLabel={e => e.id}
            onChange={(e, v) => { rootNodeChanged(v?.id ?? '') }}
            blurOnSelect
            renderInput={(params) => <TextField {...params} label="Root node:" />} />
          <Stack direction='row' spacing={1}>
            <TextField value={prefix} onChange={e => setPrefix(e.target.value)} fullWidth label='Prefix name:' size="small" InputProps={{
              endAdornment: prefix !== '' ? (
                <IconButton size='small' onClick={() => setPrefix('')}>
                  <Clear />
                </IconButton>
              ) : null
            }}></TextField>
            <Button variant='outlined' size='small'>Apply</Button>
          </Stack>
        </Stack>
      </div>
      <div className="Center" style={{ zIndex: 15, position: 'absolute' }}>
        <Menu open={openMenu} onClose={() => setOpenMenu(false)} anchorReference='anchorPosition' anchorPosition={menuPos}>
          <MenuItem onClick={findChildrenClick}>Find children</MenuItem>
          <MenuItem onClick={findParentsClick}>Find parents</MenuItem>
          <MenuItem onClick={findRelationsClick}>Find relations</MenuItem>
          <Divider />
          <MenuItem onClick={collapseClick}>Expand / Collapse</MenuItem>
        </Menu>
      </div>
      <GraphCanvas
        ref={ref}
        selections={selections}
        actives={actives}
        collapsedNodeIds={collapsedNodeIds}
        onNodeClick={onNodeClick}
        onCanvasClick={onCanvasClick}
        onNodePointerOver={(n, e) => onNodePointerOver(n.id)}
        onNodePointerOut={onNodePointerOut}
        theme={isDarkMode ? darkTheme : lightTheme}
        nodes={nodes.map(e => ({ id: e, label: e }))}
        edges={edges.map(e => ({ id: e.source + e.target, source:e.source, target:e.target }))} />
    </div>
  )
}

export default GraphViewer