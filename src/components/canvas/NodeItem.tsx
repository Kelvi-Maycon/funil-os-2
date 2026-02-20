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
  Settings,
  Plus,
  Trash2,
  Globe,
  Check,
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
  Default: Globe,
}

type NodeItemProps = {
  node: Node
  selected: boolean
  snapToGrid?: boolean
  onSelect: () => void
  onMoveStart: () => void
  onMove: (x: number, y: number) => void
  onMoveEnd: (x: number, y: number) => void
  scale: number
  onOpenNotes: () => void
  onOpenSettings: () => void
  onToggleComplete: () => void
  onDelete: () => void
  onAddChild: () => void
}

export default function NodeItem({
  node,
  selected,
  snapToGrid,
  onSelect,
  onMoveStart,
  onMove,
  onMoveEnd,
  scale,
  onOpenNotes,
  onOpenSettings,
  onToggleComplete,
  onDelete,
  onAddChild,
}: NodeItemProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return

    e.stopPropagation()

    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)

    setIsDragging(true)
    onSelect()
    onMoveStart()

    document.body.style.userSelect = 'none'

    const startX = e.clientX
    const startY = e.clientY
    const initialX = node.x
    const initialY = node.y

    const handlePointerMove = (moveEvent: PointerEvent) => {
      let newX = initialX + (moveEvent.clientX - startX) / scale
      let newY = initialY + (moveEvent.clientY - startY) / scale

      if (snapToGrid) {
        newX = Math.round(newX / 24) * 24
        newY = Math.round(newY / 24) * 24
      }

      onMove(newX, newY)
    }

    const handlePointerUp = (upEvent: PointerEvent) => {
      try {
        target.releasePointerCapture(upEvent.pointerId)
      } catch (err) {
        // safely ignore
      }

      setIsDragging(false)
      document.body.style.userSelect = ''

      let finalX = initialX + (upEvent.clientX - startX) / scale
      let finalY = initialY + (upEvent.clientY - startY) / scale

      if (snapToGrid) {
        finalX = Math.round(finalX / 24) * 24
        finalY = Math.round(finalY / 24) * 24
      }

      onMoveEnd(finalX, finalY)

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
        'absolute top-0 left-0 pointer-events-auto w-[280px] bg-white border border-slate-200 rounded-xl shadow-sm p-3 z-10 flex items-center gap-3 group select-none',
        (selected || isHovered) &&
          'ring-1 ring-primary/30 border-primary/50 shadow-md',
        isDragging &&
          'opacity-95 scale-[1.02] z-50 shadow-lg ring-2 ring-primary/50',
      )}
      style={{
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
        transition: isDragging
          ? 'none'
          : 'transform 0.1s ease-out, box-shadow 0.2s ease-out, opacity 0.2s',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onPointerDown={handlePointerDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-[50px] h-[50px] rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
        <Icon size={22} strokeWidth={1.5} className="text-slate-800" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
        <h4 className="font-bold text-[15px] text-slate-900 truncate leading-tight">
          {node.data.name}
        </h4>
        <span className="text-[13px] text-slate-500 truncate leading-tight">
          {node.data.subtitle || 'Configure this step'}
        </span>
      </div>

      <div
        className={cn(
          'flex flex-col items-center justify-center gap-1.5 px-1 transition-opacity',
          selected || isHovered
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none',
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            onOpenSettings()
          }}
          className="text-slate-400 hover:text-slate-700 transition-colors bg-white"
          title="Settings"
        >
          <Settings size={18} strokeWidth={1.5} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onOpenNotes()
          }}
          className="text-slate-400 hover:text-slate-700 transition-colors bg-white"
          title="Notes"
        >
          <FileText size={18} strokeWidth={1.5} />
        </button>
      </div>

      {node.data.isTaskMode && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleComplete()
          }}
          className={cn(
            'absolute -top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors z-20 shadow-sm',
            node.data.isCompleted
              ? 'border-green-500 bg-green-500 text-white'
              : 'border-primary/50 bg-white hover:border-primary text-transparent',
          )}
          title={
            node.data.isCompleted ? 'Mark as incomplete' : 'Mark as complete'
          }
        >
          <Check
            size={14}
            strokeWidth={3}
            className={cn(
              'transition-opacity',
              node.data.isCompleted ? 'opacity-100' : 'opacity-0',
            )}
          />
        </button>
      )}

      <div
        className={cn(
          'absolute -right-4 top-1/2 -translate-y-1/2 transition-opacity z-20',
          selected || isHovered
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none',
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddChild()
          }}
          className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105"
        >
          <Plus size={18} strokeWidth={2} />
        </button>
      </div>

      <div
        className={cn(
          'absolute -right-3 -bottom-3 transition-opacity z-20',
          selected || isHovered
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none',
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105"
        >
          <Trash2 size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
