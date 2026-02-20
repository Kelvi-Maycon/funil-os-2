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
  Zap,
  Smartphone,
  BellRing,
  MessageSquare,
  UserPlus,
  Send,
  RefreshCw,
  Edit3,
  Clock,
  ExternalLink,
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
  InApp: Smartphone,
  Push: BellRing,
  Slack: MessageSquare,
  SMS: MessageCircle,
  CreatePerson: UserPlus,
  SendEvent: Send,
  BatchUpdate: RefreshCw,
  ManualUpdate: Edit3,
  DataSync: Globe,
  WaitUntil: Clock,
  Default: Zap,
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
        newX = Math.round(newX / 28) * 28
        newY = Math.round(newY / 28) * 28
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
        finalX = Math.round(finalX / 28) * 28
        finalY = Math.round(finalY / 28) * 28
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
        'absolute top-0 left-0 pointer-events-auto w-[260px] bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-5 z-10 flex flex-col gap-2 group select-none transition-all',
        (selected || isHovered) &&
          'shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-slate-200 ring-4 ring-slate-50',
        isDragging &&
          'opacity-90 scale-[1.02] z-50 shadow-[0_12px_40px_rgba(0,0,0,0.1)] ring-4 ring-primary/10 border-primary/20',
      )}
      style={{
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
        transition: isDragging
          ? 'none'
          : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s, opacity 0.2s',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onPointerDown={handlePointerDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 text-slate-500 mb-1">
        <Icon size={16} strokeWidth={1.5} />
        <span className="text-[13px] font-medium tracking-wide">
          {node.type}
        </span>
      </div>
      <div className="flex flex-col">
        <h4 className="font-semibold text-slate-800 text-[15px] truncate">
          {node.data.name}
        </h4>
        <span className="text-[13px] text-slate-400 mt-0.5 truncate">
          {node.data.subtitle || '+1 filter'}
        </span>
      </div>

      <div
        className={cn(
          'absolute -top-3 -right-3 flex items-center gap-1.5 transition-opacity',
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
          className="w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-sm transition-transform hover:scale-105"
          title="Settings"
        >
          <Settings size={14} strokeWidth={2} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onOpenNotes()
          }}
          className="w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-sm transition-transform hover:scale-105"
          title="Notes"
        >
          <FileText size={14} strokeWidth={2} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-red-500 hover:text-red-600 shadow-sm transition-transform hover:scale-105"
          title="Delete"
        >
          <Trash2 size={14} strokeWidth={2} />
        </button>
      </div>

      {node.data.isTaskMode && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleComplete()
          }}
          className={cn(
            'absolute -bottom-3 left-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors z-20 shadow-sm bg-white',
            node.data.isCompleted
              ? 'border-green-500 bg-green-500 text-white'
              : 'border-slate-200 hover:border-slate-300 text-transparent',
          )}
          title={
            node.data.isCompleted ? 'Mark as incomplete' : 'Mark as complete'
          }
        >
          <Check
            size={12}
            strokeWidth={3}
            className={cn(
              'transition-opacity',
              node.data.isCompleted ? 'opacity-100' : 'opacity-0',
            )}
          />
        </button>
      )}

      {/* Exit point styling matching reference */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddChild()
          }}
          className="h-8 px-3 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-800 hover:border-slate-200 transition-all font-medium text-[11px]"
        >
          <ExternalLink size={12} strokeWidth={2} />
          Exit
        </button>
      </div>
    </div>
  )
}
