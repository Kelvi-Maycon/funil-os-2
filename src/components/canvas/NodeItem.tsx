import { useState } from 'react'
import { Node } from '@/types'
import { cn } from '@/lib/utils'
import {
  Megaphone,
  LayoutTemplate,
  MessageCircle,
  Mail,
  DollarSign,
  HandHeart,
  CheckCircle,
  FileText,
  Box,
} from 'lucide-react'

const icons: Record<string, any> = {
  Ad: Megaphone,
  LandingPage: LayoutTemplate,
  WhatsApp: MessageCircle,
  Email: Mail,
  Checkout: DollarSign,
  Upsell: HandHeart,
  Obrigado: CheckCircle,
  Form: FileText,
  Default: Box,
}

export default function NodeItem({
  node,
  selected,
  onSelect,
  onMove,
  onConnect,
  allNodes,
}: {
  node: Node
  selected: boolean
  onSelect: () => void
  onMove: (x: number, y: number) => void
  onConnect: (id: string) => void
  allNodes: Node[]
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.handle')) return
    e.stopPropagation()
    setIsDragging(true)
    onSelect()
    const startX = e.clientX
    const startY = e.clientY
    const initialX = node.x
    const initialY = node.y

    const handlePointerMove = (moveEvent: PointerEvent) => {
      onMove(
        initialX + moveEvent.clientX - startX,
        initialY + moveEvent.clientY - startY,
      )
    }

    const handlePointerUp = () => {
      setIsDragging(false)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const Icon = icons[node.type] || icons.Default

  return (
    <div
      className={cn(
        'absolute w-60 bg-card border rounded-xl shadow-sm p-4 cursor-grab z-10 transition-shadow',
        selected && 'ring-2 ring-primary border-primary shadow-md',
        isDragging &&
          'cursor-grabbing opacity-90 scale-105 transition-transform',
      )}
      style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
      onPointerDown={handlePointerDown}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <Icon size={20} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h4 className="font-medium text-sm text-card-foreground truncate">
            {node.data.name}
          </h4>
          <span className="text-xs text-muted-foreground truncate block">
            {node.type}
          </span>
        </div>
      </div>
      {selected && (
        <div
          className="handle absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-primary rounded-full cursor-crosshair border-2 border-card shadow-sm hover:scale-125 transition-transform"
          title="Arraste para conectar (Implementação visual)"
        />
      )}
    </div>
  )
}
