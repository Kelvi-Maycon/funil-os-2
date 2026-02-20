import { useState, useRef } from 'react'
import { Funnel, Node } from '@/types'
import BlockPalette from './BlockPalette'
import NodeItem from './NodeItem'
import RightPanel from './RightPanel'

export default function CanvasBoard({
  funnel,
  onChange,
}: {
  funnel: Funnel
  onChange: (f: Funnel) => void
}) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('blockType')
    if (!type) return
    const rect = boardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left - 120 // center offset
    const y = e.clientY - rect.top - 40

    const newNode: Node = {
      id: `n_${Date.now()}`,
      type,
      x,
      y,
      data: { name: type, status: 'A Fazer' },
    }
    onChange({ ...funnel, nodes: [...funnel.nodes, newNode] })
  }

  const handleNodeMove = (id: string, x: number, y: number) => {
    onChange({
      ...funnel,
      nodes: funnel.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
    })
  }

  return (
    <div className="flex-1 flex relative overflow-hidden">
      <BlockPalette />

      <div
        ref={boardRef}
        className="flex-1 relative canvas-bg overflow-auto min-w-[800px] min-h-[600px]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={(e) => {
          if (e.target === boardRef.current) setSelectedNode(null)
        }}
      >
        <svg className="absolute inset-0 pointer-events-none w-full h-full z-0 overflow-visible">
          {funnel.edges.map((e) => {
            const source = funnel.nodes.find((n) => n.id === e.source)
            const target = funnel.nodes.find((n) => n.id === e.target)
            if (!source || !target) return null
            const startX = source.x + 240 // node width
            const startY = source.y + 40 // half height
            const endX = target.x
            const endY = target.y + 40
            const d = `M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`
            return (
              <path
                key={e.id}
                d={d}
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                fill="none"
                opacity="0.4"
                markerEnd="url(#arrow)"
              />
            )
          })}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 0 L 10 5 L 0 10 z"
                fill="hsl(var(--primary))"
                opacity="0.4"
              />
            </marker>
          </defs>
        </svg>

        {funnel.nodes.map((n) => (
          <NodeItem
            key={n.id}
            node={n}
            selected={selectedNode === n.id}
            onSelect={() => setSelectedNode(n.id)}
            onMove={(x, y) => handleNodeMove(n.id, x, y)}
            onConnect={(targetId) =>
              onChange({
                ...funnel,
                edges: [
                  ...funnel.edges,
                  { id: `e_${Date.now()}`, source: n.id, target: targetId },
                ],
              })
            }
            allNodes={funnel.nodes}
          />
        ))}
      </div>

      {selectedNode && (
        <RightPanel
          node={funnel.nodes.find((n) => n.id === selectedNode)!}
          onChange={(n) =>
            onChange({
              ...funnel,
              nodes: funnel.nodes.map((node) => (node.id === n.id ? n : node)),
            })
          }
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}
