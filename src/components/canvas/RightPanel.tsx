import { Node } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'

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
    <div className="w-80 bg-card border-l h-full flex flex-col shadow-xl z-20 shrink-0 animate-slide-left absolute right-0 top-0 bottom-0">
      <div className="p-4 border-b flex justify-between items-center bg-muted/30">
        <h3 className="font-semibold text-sm">Propriedades do Bloco</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X size={16} />
        </Button>
      </div>
      <div className="p-4 flex flex-col gap-6 flex-1 overflow-auto">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Nome do Bloco</Label>
          <Input
            value={node.data.name}
            onChange={(e) =>
              onChange({
                ...node,
                data: { ...node.data, name: e.target.value },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select
            value={node.data.status}
            onValueChange={(v) =>
              onChange({ ...node, data: { ...node.data, status: v } })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A Fazer">A Fazer</SelectItem>
              <SelectItem value="Em Progresso">Em Progresso</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Notas</Label>
          <Textarea
            value={node.data.notes || ''}
            onChange={(e) =>
              onChange({
                ...node,
                data: { ...node.data, notes: e.target.value },
              })
            }
            rows={8}
            placeholder="Adicione contexto, copy ou links aqui..."
            className="resize-none"
          />
        </div>
      </div>
    </div>
  )
}
