import { FC, useContext, useEffect, useRef, useState } from "react"
import { GraphCanvas, GraphCanvasRef, darkTheme, lightTheme, InternalGraphNode, CollapseProps, getAdjacents, Graph, LayoutTypes } from "reagraph"
import { useParams } from "react-router-dom"
import { dependencyManagerProviders } from "./DependencyManagerProviders/DependencyManagerProviders"
import { IsDarkModeContext, IsMobileContext } from "./Base"
import { Alert, Autocomplete, Divider, Menu, MenuItem, Stack, TextField } from "@mui/material"
import { CocoaPodsProvider } from "./DependencyManagerProviders/CocoaPodsProvider"
import { ThreeEvent } from '@react-three/fiber'
import { GraphType } from "./DependencyManagerProviders/DependencyProviderBase"

function MockProvider(): CocoaPodsProvider {
  const pod = new CocoaPodsProvider()
  pod.updateMockResolvedFile()
  return pod
}

function GraphViewer() {
  const [selections, setSelections] = useState<string[]>([])
  const [actives, setActives] = useState<string[]>([])
  const [hoverActives, setHoverActives] = useState<string[]>([])
  const [selectedNode, setSelectedNode] = useState('')
  const [openMenu, setOpenMenu] = useState(false)
  const [hideGuide, setHideGuide] = useState(false)
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<string[]>([])
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const ref = useRef<GraphCanvasRef | null>(null)
  const { index } = useParams<{ index: string }>()
  const i = index === undefined ? -1 : Number(index)
  const isDarkMode = useContext(IsDarkModeContext)
  const isMobile = useContext(IsMobileContext)
  const provider = i === -1 ? MockProvider() : dependencyManagerProviders[i]
  const defaultGraph = mapGraph(provider.graph!)
  const [nodes, setNodes] = useState(defaultGraph.nodes)
  const [edges, setEdges] = useState(defaultGraph.edges)
  const [layout, setLayout] = useState<LayoutTypes>('forceDirected2d')

  // useEffect(() => {
  //   ref.current?.fitNodesInView()
  //   ref.current?.centerGraph()
  // }, [nodes, edges, layout])

  function mapGraph(graph: GraphType): Graph {
    return {
      nodes: graph.nodes.map(e => ({ id: e, label: e })),
      edges: graph.edges.map(e => ({ id: e.source + e.target, source: e.source, target: e.target }))
    }
  }

  const rootNodeChanged = (value: string) => {
    if (value === '') { return }
    resetSelectionAndActive()
    let graph = mapGraph(provider.getSubgraph(value))
    setNodes(graph.nodes)
    setEdges(graph.edges)
    setActives([value])    
    resetGraph()
  }

  const onGraphStyleChanged = (e: LayoutTypes) => {
    setLayout(e)
    resetGraph()
  }

  function resetGraph() {
    setTimeout(() => { setCollapsedNodeIds([]); ref.current?.fitNodesInView(); ref.current?.centerGraph() }, 500)
  }

  const onNodeClick = ((node: InternalGraphNode, props?: CollapseProps, event?: ThreeEvent<MouseEvent>) => {
    resetSelectionAndActive()
    setSelectedNode(node.id)
    setMenuPos({ top: event?.y ?? 0, left: event?.x ?? 0 })
    setHideGuide(true)
    setOpenMenu(true)
  })

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

  const nodeMenuOnClick = (index: NodeMenuIndexClick) => {
    switch (index) {
      case NodeMenuIndexClick.SetAsRootNode: {
        setOpenMenu(false)
        rootNodeChanged(selectedNode)
        break
      }
      case NodeMenuIndexClick.FindChildren: {
        setOpenMenu(false)
        setSelections([selectedNode])
        const active = getAdjacents(ref.current!.getGraph(), selectedNode, 'out')
        setActives([...active.nodes, ...active.edges])
        break
      }

      case NodeMenuIndexClick.FindParent: {
        setOpenMenu(false)
        setSelections([selectedNode])
        const active = getAdjacents(ref.current!.getGraph(), selectedNode, 'in')
        setActives([...active.nodes, ...active.edges])
        break
      }

      case NodeMenuIndexClick.FindRelates: {
        setOpenMenu(false)
        setSelections([selectedNode])
        const active = getAdjacents(ref.current!.getGraph(), selectedNode, 'all')
        setActives([...active.nodes, ...active.edges])
        break
      }

      case NodeMenuIndexClick.Collapse: {
        resetSelectionAndActive()
        setOpenMenu(false)

        if (!collapsedNodeIds.includes(selectedNode)) {
          setCollapsedNodeIds([...collapsedNodeIds, selectedNode])
        } else {
          setCollapsedNodeIds(collapsedNodeIds.filter(n => n !== selectedNode))
        }
        break
      }

      case NodeMenuIndexClick.Close: {
        setOpenMenu(false)
        break
      }
    }
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
        <Stack padding={1} spacing={2}>
          <ChooseGraphType onChanged={onGraphStyleChanged} />
          <ChooseRootNode nodes={provider.graph!.nodes} hideGuide={hideGuide} onRootNodeChanged={rootNodeChanged} />
        </Stack>
      </div>
      <div className="Center" style={{ zIndex: 15, position: 'absolute' }}>
        <NodeMenu openMenu={openMenu} menuPos={menuPos} onClick={nodeMenuOnClick} />
      </div>
      <GraphCanvas
        ref={ref}
        layoutType={layout}
        selections={selections}
        actives={actives}
        collapsedNodeIds={collapsedNodeIds}
        onNodeClick={onNodeClick}
        onCanvasClick={onCanvasClick}
        onNodePointerOver={(n, e) => onNodePointerOver(n.id)}
        onNodePointerOut={onNodePointerOut}
        theme={isDarkMode ? darkTheme : lightTheme}
        nodes={nodes}
        edges={edges} />
    </div>
  )
}

enum NodeMenuIndexClick {
  SetAsRootNode,
  Close,
  FindChildren,
  FindParent,
  FindRelates,
  Collapse
}

const NodeMenu: FC<{ openMenu: boolean, menuPos: { top: number, left: number }, onClick: (index: NodeMenuIndexClick) => void }> = (props) => {
  return (
    <Menu open={props.openMenu} onClose={() => props.onClick(NodeMenuIndexClick.Close)} anchorReference='anchorPosition' anchorPosition={props.menuPos}>
      <MenuItem onClick={() => props.onClick(NodeMenuIndexClick.SetAsRootNode)}>Set as root node</MenuItem>
      <Divider />
      <MenuItem onClick={() => props.onClick(NodeMenuIndexClick.FindChildren)}>Find children</MenuItem>
      <MenuItem onClick={() => props.onClick(NodeMenuIndexClick.FindParent)}>Find parents</MenuItem>
      <MenuItem onClick={() => props.onClick(NodeMenuIndexClick.FindRelates)}>Find relations</MenuItem>
      <Divider />
      <MenuItem onClick={() => props.onClick(NodeMenuIndexClick.Collapse)}>Expand / Collapse</MenuItem>
    </Menu>
  )
}

const ChooseRootNode: FC<{ nodes: string[], hideGuide: boolean, onRootNodeChanged: (value: string) => void }> = (props) => {
  const options = props.nodes.map(e => {
    const firstLetter = e[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      id: e
    }
  })

  return (
    <>
      <Autocomplete
        size='small'
        options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
        groupBy={e => e.firstLetter}
        getOptionLabel={e => e.id}
        onChange={(e, v) => { props.onRootNodeChanged(v?.id ?? '') }}
        blurOnSelect
        renderInput={(params) => <TextField {...params} label="Root node:" />} />
      {!props.hideGuide && (<Alert variant='outlined' severity='info'>Click to the node to see more actions</Alert>)}
    </>
  )
}

const ChooseGraphType: FC<{onChanged: (type: LayoutTypes) => void}> = (props) => {
  const types = [
    {label:'Network', id:'forceDirected2d'}, 
    {label:'Left to right', id:'treeLr2d'}, 
    {label:'Top to down', id:'treeTd2d'}
  ]

  return (
    <Autocomplete
        size='small'
        options={types}
        onChange={(e, v) => { props.onChanged(v!.id as LayoutTypes) }}
        blurOnSelect
        renderInput={(params) => <TextField {...params} label="Graph style:" />} />
  )
}

export default GraphViewer