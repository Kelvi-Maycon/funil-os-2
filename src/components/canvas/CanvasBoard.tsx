import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Funnel, Node, Edge, NodeData } from '@/types'
import BlockPalette from './BlockPalette'
import NodeItem from './NodeItem'
import RightPanel from './RightPanel'
import { NodeSettingsModal } from './NodeSettingsModal'
import {
  Plus,
  Minus,
  Maximize,
  Map,
  Grid,
  Edit2,
  Image as ImageIcon,
  FileText,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function CanvasBoard({
  funnel,
  onChange,
}: {
  funnel: Funnel
  onChange: (f: Funnel) => void
}) {
  const navigate = useNavigate()
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [notesNodeId, setNotesNodeId] = useState<string | null>(null)
  const [settingsNodeId, setSettingsNodeId] = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const [transform, setTransform] = useState({ x: 400, y: 150, scale: 1 })
  const [isPanning, setIsPanning] = useState(false)
  const [showMinimap, setShowMinimap] = useState(false)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [draggedNode, setDraggedNode] = useState<{
    id: string
    x: number
    y: number
  } | null>(null)
  const lastPan = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const el = boardRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        setTransform((prev) => {
          const scaleChange = e.deltaY * -0.005
          let newScale = prev.scale * Math.exp(scaleChange)
          newScale = Math.min(Math.max(0.1, newScale), 3)

          const rect = el.getBoundingClientRect()
          const mouseX = e.clientX - rect.left
          const mouseY = e.clientY - rect.top

          const newX = mouseX - (mouseX - prev.x) * (newScale / prev.scale)
          const newY = mouseY - (mouseY - prev.y) * (newScale / prev.scale)
          return { x: newX, y: newY, scale: newScale }
        })
      } else {
        setTransform((prev) => ({
          ...prev,
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }))
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const handlePanStart = (e: React.PointerEvent) => {
    if (
      e.target === boardRef.current ||
      (e.target as HTMLElement).classList.contains('canvas-container') ||
      (e.target as HTMLElement).tagName === 'svg'
    ) {
      setIsPanning(true)
      lastPan.current = { x: e.clientX, y: e.clientY }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'grabbing'
    }
  }

  const handlePanMove = (e: React.PointerEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastPan.current.x
      const dy = e.clientY - lastPan.current.y
      setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
      lastPan.current = { x: e.clientX, y: e.clientY }
    }
  }

  const handlePanEnd = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false)
      try {
        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
      } catch (err) {
        // safely ignore
      }
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('blockType')
    if (!type) return
    const rect = boardRef.current?.getBoundingClientRect()
    if (!rect) return
    let x = (e.clientX - rect.left - transform.x) / transform.scale - 130
    let y = (e.clientY - rect.top - transform.y) / transform.scale - 40

    if (snapToGrid) {
      x = Math.round(x / 28) * 28
      y = Math.round(y / 28) * 28
    }

    const newNode: Node = {
      id: `n_${Date.now()}`,
      type,
      x,
      y,
      data: { name: type, status: 'A Fazer', subtitle: '+1 filter' },
    }
    onChange({ ...funnel, nodes: [...funnel.nodes, newNode] })
  }

  const handleAddChild = (parentId: string) => {
    const parent = funnel.nodes.find((n) => n.id === parentId)
    if (!parent) return
    const newId = `n_${Date.now()}`
    let newX = parent.x + 350
    let newY = parent.y

    if (snapToGrid) {
      newX = Math.round(newX / 28) * 28
      newY = Math.round(newY / 28) * 28
    }

    const newNode: Node = {
      id: newId,
      type: 'Default',
      x: newX,
      y: newY,
      data: {
        name: 'New Step',
        status: 'A Fazer',
        subtitle: '+1 filter',
      },
    }
    const newEdge: Edge = {
      id: `e_${Date.now()}`,
      source: parentId,
      target: newId,
    }
    onChange({
      ...funnel,
      nodes: [...funnel.nodes, newNode],
      edges: [...funnel.edges, newEdge],
    })
  }

  const handleDeleteNode = (id: string) => {
    onChange({
      ...funnel,
      nodes: funnel.nodes.filter((n) => n.id !== id),
      edges: funnel.edges.filter((e) => e.source !== id && e.target !== id),
    })
    if (notesNodeId === id) setNotesNodeId(null)
    if (settingsNodeId === id) setSettingsNodeId(null)
  }

  const handleSaveSettings = (id: string, updates: Partial<NodeData>) => {
    onChange({
      ...funnel,
      nodes: funnel.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...updates } } : n,
      ),
    })
    setSettingsNodeId(null)
  }

  const handleToggleComplete = (id: string) => {
    onChange({
      ...funnel,
      nodes: funnel.nodes.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, isCompleted: !n.data.isCompleted } }
          : n,
      ),
    })
  }

  const handleZoomIn = () =>
    setTransform((p) => ({ ...p, scale: Math.min(3, p.scale + 0.1) }))
  const handleZoomOut = () =>
    setTransform((p) => ({ ...p, scale: Math.max(0.1, p.scale - 0.1) }))
  const handleFitView = () => setTransform({ x: 400, y: 150, scale: 1 })

  return (
    <div className="flex-1 flex relative overflow-hidden">
      {/* Floating Header */}
      <div className="absolute top-8 left-[360px] flex items-center gap-3 text-[15px] z-20">
        <span
          className="text-slate-400 font-medium cursor-pointer hover:text-slate-700 transition-colors"
          onClick={() => navigate('/canvas')}
        >
          Campaigns
        </span>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-800">{funnel.name}</span>
        <button className="text-slate-400 hover:text-slate-700 transition-colors ml-1">
          <Edit2 size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Floating Toolbar */}
      <div className="absolute top-8 right-8 flex items-center gap-1 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-1.5 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-xl text-slate-500 hover:bg-slate-50"
        >
          <ImageIcon size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-xl text-slate-500 hover:bg-slate-50"
        >
          <FileText size={18} />
        </Button>
        <div className="w-px h-6 bg-slate-100 mx-1.5" />
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-xl text-slate-500 hover:bg-slate-50"
          onClick={handleFitView}
        >
          <Maximize size={16} />
        </Button>
        <span className="text-sm font-semibold text-slate-600 px-3 min-w-[3.5rem] text-center">
          {Math.round(transform.scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-xl text-slate-500 hover:bg-slate-50"
          onClick={handleZoomOut}
        >
          <Minus size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-xl text-slate-500 hover:bg-slate-50"
          onClick={handleZoomIn}
        >
          <Plus size={18} />
        </Button>
      </div>

      {/* Floating Palette */}
      <div className="absolute top-6 left-8 z-20 bottom-6 flex pointer-events-none">
        <div className="pointer-events-auto flex h-full">
          <BlockPalette />
        </div>
      </div>

      <div
        ref={boardRef}
        className="flex-1 relative bg-[#f8fafc] canvas-container overflow-hidden"
        style={{
          backgroundPosition: `${transform.x}px ${transform.y}px`,
          backgroundSize: `${28 * transform.scale}px ${28 * transform.scale}px`,
        }}
        onPointerDown={handlePanStart}
        onPointerMove={handlePanMove}
        onPointerUp={handlePanEnd}
        onPointerLeave={handlePanEnd}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={(e) => {
          if (
            e.target === boardRef.current ||
            (e.target as HTMLElement).classList.contains('canvas-container') ||
            (e.target as HTMLElement).tagName === 'svg'
          ) {
            setSelectedNode(null)
          }
        }}
      >
        <div
          style={{
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
            transformOrigin: '0 0',
          }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
            {funnel.edges.map((e) => {
              const sourceNode = funnel.nodes.find((n) => n.id === e.source)
              const targetNode = funnel.nodes.find((n) => n.id === e.target)
              if (!sourceNode || !targetNode) return null

              const sourceX =
                draggedNode?.id === e.source ? draggedNode.x : sourceNode.x
              const sourceY =
                draggedNode?.id === e.source ? draggedNode.y : sourceNode.y

              const targetX =
                draggedNode?.id === e.target ? draggedNode.x : targetNode.x
              const targetY =
                draggedNode?.id === e.target ? draggedNode.y : targetNode.y

              const startX = sourceX + 260
              const startY = sourceY + 44
              const endX = targetX
              const endY = targetY + 44
              const d = `M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`
              return (
                <path
                  key={e.id}
                  d={d}
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  fill="none"
                />
              )
            })}
          </svg>

          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {funnel.nodes.map((n) => {
              const isDragged = draggedNode?.id === n.id
              const displayNode = isDragged
                ? { ...n, x: draggedNode.x, y: draggedNode.y }
                : n

              return (
                <NodeItem
                  key={n.id}
                  node={displayNode}
                  selected={selectedNode === n.id}
                  snapToGrid={snapToGrid}
                  onSelect={() => setSelectedNode(n.id)}
                  onMoveStart={() =>
                    setDraggedNode({ id: n.id, x: n.x, y: n.y })
                  }
                  onMove={(x, y) => setDraggedNode({ id: n.id, x, y })}
                  onMoveEnd={(x, y) => {
                    setDraggedNode(null)
                    onChange({
                      ...funnel,
                      nodes: funnel.nodes.map((node) =>
                        node.id === n.id ? { ...node, x, y } : node,
                      ),
                    })
                  }}
                  onAddChild={() => handleAddChild(n.id)}
                  onDelete={() => handleDeleteNode(n.id)}
                  onOpenNotes={() => setNotesNodeId(n.id)}
                  onOpenSettings={() => setSettingsNodeId(n.id)}
                  onToggleComplete={() => handleToggleComplete(n.id)}
                  scale={transform.scale}
                />
              )
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex gap-2 z-20">
        <button
          onClick={() => setSnapToGrid(!snapToGrid)}
          className={cn(
            'w-12 h-12 flex items-center justify-center bg-white border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] rounded-2xl text-slate-500 hover:bg-slate-50 transition-colors',
            snapToGrid && 'bg-slate-100 text-slate-800 border-slate-200',
          )}
          title="Toggle Snap to Grid"
        >
          <Grid size={18} />
        </button>
      </div>

      {notesNodeId && funnel.nodes.find((n) => n.id === notesNodeId) && (
        <RightPanel
          node={funnel.nodes.find((n) => n.id === notesNodeId)!}
          onChange={(n) =>
            onChange({
              ...funnel,
              nodes: funnel.nodes.map((node) => (node.id === n.id ? n : node)),
            })
          }
          onClose={() => setNotesNodeId(null)}
        />
      )}

      <NodeSettingsModal
        node={
          settingsNodeId
            ? funnel.nodes.find((n) => n.id === settingsNodeId) || null
            : null
        }
        isOpen={!!settingsNodeId}
        onClose={() => setSettingsNodeId(null)}
        onSave={handleSaveSettings}
      />
    </div>
  )
}
