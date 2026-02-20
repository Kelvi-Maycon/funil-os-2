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
  onSelect: () => void
  onMove: (x: number, y: number) => void
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
  onSelect,
  onMove,
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
    setIsDragging(true)
    onSelect()
    const startX = e.clientX
    const startY = e.clientY
    const initialX = node.x
    const initialY = node.y

    const handlePointerMove = (moveEvent: PointerEvent) => {
      onMove(
        initialX + (moveEvent.clientX - startX) / scale,
        initialY + (moveEvent.clientY - startY) / scale,
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
        'absolute pointer-events-auto w-[280px] bg-white border border-slate-200 rounded-xl shadow-sm p-3 z-10 transition-all flex items-center gap-3 group select-none',
        (selected || isHovered) &&
          'ring-1 ring-primary/30 border-primary/50 shadow-md',
        isDragging && 'cursor-grabbing opacity-95 scale-[1.02]',
      )}
      style={{ left: node.x, top: node.y }}
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
