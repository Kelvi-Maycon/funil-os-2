import { useState, useEffect } from 'react'
import { Node, NodeData } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

type NodeSettingsModalProps = {
  node: Node | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, updates: Partial<NodeData>) => void
}

export function NodeSettingsModal({
  node,
  isOpen,
  onClose,
  onSave,
}: NodeSettingsModalProps) {
  const [description, setDescription] = useState('')
  const [isTaskMode, setIsTaskMode] = useState(false)

  useEffect(() => {
    if (isOpen && node) {
      setDescription(node.data.description || '')
      setIsTaskMode(node.data.isTaskMode || false)
    }
  }, [isOpen, node])

  const handleSave = () => {
    if (node) {
      onSave(node.id, { description, isTaskMode })
    }
  }

  if (!node) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure Node</DialogTitle>
          <DialogDescription>
            Customize the selected node settings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Modo Task</Label>
              <p className="text-sm text-muted-foreground">
                Enable checklist mode for this branch.
              </p>
            </div>
            <Switch checked={isTaskMode} onCheckedChange={setIsTaskMode} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
