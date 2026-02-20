import { useState, useRef, useEffect } from 'react'
import { Funnel, Node, Edge, NodeData } from '@/types'
import BlockPalette from './BlockPalette'
import NodeItem from './NodeItem'
import RightPanel from './RightPanel'
import { NodeSettingsModal } from './NodeSettingsModal'
import { Plus, Minus, Maximize, Map } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CanvasBoard({
  funnel,
  onChange,
}: {
  funnel: Funnel
  onChange: (f: Funnel) => void
}) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [notesNodeId, setNotesNodeId] = useState<string | null>(null)
  const [settingsNodeId, setSettingsNodeId] = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isPanning, setIsPanning] = useState(false)
  const [showMinimap, setShowMinimap] = useState(true)
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
      (e.target as HTMLElement).classList.contains('canvas-container')
    ) {
      setIsPanning(true)
      lastPan.current = { x: e.clientX, y: e.clientY }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
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
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('blockType')
    if (!type) return
    const rect = boardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left - transform.x) / transform.scale - 140
    const y = (e.clientY - rect.top - transform.y) / transform.scale - 37

    const newNode: Node = {
      id: `n_${Date.now()}`,
      type,
      x,
      y,
      data: { name: type, status: 'A Fazer', subtitle: 'Configure this step' },
    }
    onChange({ ...funnel, nodes: [...funnel.nodes, newNode] })
  }

  const handleNodeMove = (id: string, x: number, y: number) => {
    onChange({
      ...funnel,
      nodes: funnel.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
    })
  }

  const handleAddChild = (parentId: string) => {
    const parent = funnel.nodes.find((n) => n.id === parentId)
    if (!parent) return
    const newId = `n_${Date.now()}`
    const newNode: Node = {
      id: newId,
      type: 'Default',
      x: parent.x + 350,
      y: parent.y,
      data: {
        name: 'New Action',
        status: 'A Fazer',
        subtitle: 'Configure this step',
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
    setTransform((p) => ({ ...p, scale: Math.min(3, p.scale + 0.2) }))
  const handleZoomOut = () =>
    setTransform((p) => ({ ...p, scale: Math.max(0.1, p.scale - 0.2) }))
  const handleFitView = () => {
    if (funnel.nodes.length === 0) return setTransform({ x: 0, y: 0, scale: 1 })
    const minX = Math.min(...funnel.nodes.map((n) => n.x))
    const maxX = Math.max(...funnel.nodes.map((n) => n.x + 280))
    const minY = Math.min(...funnel.nodes.map((n) => n.y))
    const maxY = Math.max(...funnel.nodes.map((n) => n.y + 74))

    const w = maxX - minX
    const h = maxY - minY

    const board = boardRef.current?.getBoundingClientRect()
    if (!board) return

    const scaleX = (board.width - 200) / (w || 1)
    const scaleY = (board.height - 200) / (h || 1)
    const scale = Math.min(scaleX, scaleY, 1)

    const x = (board.width - w * scale) / 2 - minX * scale
    const y = (board.height - h * scale) / 2 - minY * scale

    setTransform({ x, y, scale })
  }

  const getMinimapView = () => {
    if (funnel.nodes.length === 0) return { scale: 0.1, x: 0, y: 0 }
    const minX = Math.min(
      ...funnel.nodes.map((n) => n.x),
      -transform.x / transform.scale,
    )
    const maxX = Math.max(
      ...funnel.nodes.map((n) => n.x + 280),
      (-transform.x + (boardRef.current?.clientWidth || 800)) / transform.scale,
    )
    const minY = Math.min(
      ...funnel.nodes.map((n) => n.y),
      -transform.y / transform.scale,
    )
    const maxY = Math.max(
      ...funnel.nodes.map((n) => n.y + 74),
      (-transform.y + (boardRef.current?.clientHeight || 600)) /
        transform.scale,
    )

    const w = maxX - minX
    const h = maxY - minY

    const scaleX = 200 / (w || 1)
    const scaleY = 120 / (h || 1)
    const scale = Math.min(scaleX, scaleY, 0.1)

    return { scale, x: -minX, y: -minY }
  }

  return (
    <div className="flex-1 flex relative overflow-hidden">
      <BlockPalette />

      <div
        ref={boardRef}
        className="flex-1 relative bg-[#fbfbfc] canvas-container overflow-hidden"
        style={{
          backgroundPosition: `${transform.x}px ${transform.y}px`,
          backgroundSize: `${24 * transform.scale}px ${24 * transform.scale}px`,
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
            (e.target as HTMLElement).classList.contains('canvas-container')
          ) {
            setSelectedNode(null)
          }
        }}
      >
        <div
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
          }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <svg className="absolute inset-0 w-full h-full overflow-visible z-0">
            <defs>
              <marker
                id="arrowhead"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
              </marker>
            </defs>
            {funnel.edges.map((e) => {
              const source = funnel.nodes.find((n) => n.id === e.source)
              const target = funnel.nodes.find((n) => n.id === e.target)
              if (!source || !target) return null
              const startX = source.x + 280
              const startY = source.y + 37
              const endX = target.x
              const endY = target.y + 37
              const d = `M ${startX} ${startY} C ${startX + 60} ${startY}, ${endX - 60} ${endY}, ${endX} ${endY}`
              return (
                <path
                  key={e.id}
                  d={d}
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
              )
            })}
          </svg>

          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {funnel.nodes.map((n) => (
              <NodeItem
                key={n.id}
                node={n}
                selected={selectedNode === n.id}
                onSelect={() => setSelectedNode(n.id)}
                onMove={(x, y) => handleNodeMove(n.id, x, y)}
                onAddChild={() => handleAddChild(n.id)}
                onDelete={() => handleDeleteNode(n.id)}
                onOpenNotes={() => setNotesNodeId(n.id)}
                onOpenSettings={() => setSettingsNodeId(n.id)}
                onToggleComplete={() => handleToggleComplete(n.id)}
                scale={transform.scale}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 flex flex-col gap-3 z-20">
        <div className="bg-white border shadow-sm rounded-lg flex flex-col overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-b transition-colors"
            title="Zoom In"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-b transition-colors"
            title="Zoom Out"
          >
            <Minus size={18} />
          </button>
          <button
            onClick={handleFitView}
            className="p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Fit View"
          >
            <Maximize size={18} />
          </button>
        </div>
        <button
          onClick={() => setShowMinimap(!showMinimap)}
          className={cn(
            'p-2 bg-white border shadow-sm rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors',
            showMinimap && 'bg-slate-100',
          )}
          title="Toggle Minimap"
        >
          <Map size={18} />
        </button>
      </div>

      {showMinimap && (
        <div className="absolute bottom-6 right-6 w-56 h-36 bg-white border shadow-md rounded-xl z-20 p-2 pointer-events-none">
          <div className="relative w-full h-full bg-slate-50 rounded border overflow-hidden flex items-center justify-center">
            {(() => {
              const mapInfo = getMinimapView()
              return (
                <div style={{ width: 200, height: 120, position: 'relative' }}>
                  <div
                    style={{
                      transform: `scale(${mapInfo.scale})`,
                      transformOrigin: '0 0',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                    }}
                  >
                    {funnel.nodes.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          left: n.x + mapInfo.x,
                          top: n.y + mapInfo.y,
                          width: 280,
                          height: 74,
                        }}
                        className="absolute bg-primary/20 border border-primary/40 rounded-sm"
                      />
                    ))}
                    {boardRef.current && (
                      <div
                        className="absolute border-2 border-primary bg-primary/10"
                        style={{
                          left: -transform.x / transform.scale + mapInfo.x,
                          top: -transform.y / transform.scale + mapInfo.y,
                          width: boardRef.current.clientWidth / transform.scale,
                          height:
                            boardRef.current.clientHeight / transform.scale,
                        }}
                      />
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

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
