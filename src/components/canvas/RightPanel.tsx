import { Node } from '@/types'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Copy, X } from 'lucide-react'

export default function RightPanel({
  node,
  onChange,
  onClose,
}: {
  node: Node
  onChange: (n: Node) => void
  onClose: () => void
}) {
  return (
    <div className="w-[500px] bg-background border-l h-full flex flex-col shadow-2xl z-30 shrink-0 animate-slide-left absolute right-0 top-0 bottom-0">
      <div className="px-6 py-4 flex items-center justify-between border-b shrink-0 bg-background/50 backdrop-blur-sm">
        <span className="text-[13px] text-muted-foreground font-medium">
          Document Mode - Changes are synced automatically
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-medium bg-background"
          >
            <Copy size={14} className="mr-1.5" /> Copy
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 space-y-8">
        <div className="space-y-4">
          <input
            className="w-full bg-transparent text-4xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/30 border-none px-0 focus:ring-0"
            value={node.data.name}
            onChange={(e) =>
              onChange({
                ...node,
                data: { ...node.data, name: e.target.value },
              })
            }
            placeholder="Node Title"
          />
          <p className="text-base text-muted-foreground">
            as {node.data.subtitle || 'Configure this step'}
          </p>
          <Textarea
            value={node.data.notes || ''}
            onChange={(e) =>
              onChange({
                ...node,
                data: { ...node.data, notes: e.target.value },
              })
            }
            placeholder="Add some notes..."
            className="min-h-[200px] border-none bg-transparent px-0 shadow-none focus-visible:ring-0 resize-none text-base text-foreground placeholder:text-muted-foreground/50"
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
            SUB-ITEMS
          </h3>
          <p className="text-sm text-muted-foreground italic">
            No sub-items yet.
          </p>
        </div>
      </div>
    </div>
  )
}
