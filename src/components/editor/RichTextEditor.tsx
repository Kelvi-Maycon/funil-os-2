import { useRef, useEffect, useState, useCallback } from 'react'
import { Document, Funnel } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Quote,
  SeparatorHorizontal,
  Image as ImageIcon,
  Network,
  X,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import useFunnelStore from '@/stores/useFunnelStore'
import CanvasBoard from '@/components/canvas/CanvasBoard'
import { cn } from '@/lib/utils'

export default function RichTextEditor({
  doc,
  onChange,
  onTitleChange,
}: {
  doc: Document
  onChange: (c: string) => void
  onTitleChange: (t: string) => void
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [funnels, setFunnels] = useFunnelStore()
  const [canvasModalOpen, setCanvasModalOpen] = useState(false)
  const [selectedCanvasId, setSelectedCanvasId] = useState<string | null>(null)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [savedRange, setSavedRange] = useState<Range | null>(null)
  const [editingCanvasId, setEditingCanvasId] = useState<string | null>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== doc.content) {
      editorRef.current.innerHTML = doc.content
    }
  }, [doc.id])

  const saveSelection = useCallback(() => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      if (
        editorRef.current &&
        editorRef.current.contains(range.commonAncestorContainer)
      ) {
        setSavedRange(range.cloneRange())
      }
    }
  }, [])

  const restoreSelection = useCallback(() => {
    editorRef.current?.focus()
    if (savedRange) {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(savedRange)
      }
    } else {
      if (editorRef.current) {
        const range = document.createRange()
        range.selectNodeContents(editorRef.current)
        range.collapse(false)
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    }
  }, [savedRange])

  const insertHtmlAtSelection = (htmlString: string) => {
    restoreSelection()

    let success = false
    try {
      success = document.execCommand('insertHTML', false, htmlString)
    } catch (e) {
      success = false
    }

    if (!success) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()

        const el = document.createElement('div')
        el.innerHTML = htmlString

        const frag = document.createDocumentFragment()
        let node, lastNode
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node)
        }

        range.insertNode(frag)

        if (lastNode) {
          range.setStartAfter(lastNode)
          range.collapse(true)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val)
    editorRef.current?.focus()
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertImage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl.trim()) return
    insertHtmlAtSelection(
      `<img src="${imageUrl}" alt="Imagem Inserida" style="max-width: 100%; border-radius: 8px; margin: 16px 0;" /><p><br></p>`,
    )
    setImageUrl('')
    setImageModalOpen(false)
  }

  const insertCanvas = () => {
    if (!selectedCanvasId) return
    const canvas = funnels.find((f) => f.id === selectedCanvasId)
    if (!canvas) return

    const html = `
      <div contenteditable="false" class="canvas-preview-block group" data-canvas-id="${canvas.id}" style="display: flex; justify-content: center; margin: 32px 0; user-select: none;">
        <div class="border border-border bg-muted/50 p-6 rounded-lg w-full max-w-[500px] text-center shadow-sm cursor-pointer transition-all hover:border-primary hover:bg-primary/5 hover:ring-1 hover:ring-primary">
          <div class="flex items-center justify-center gap-2 mb-3 text-primary">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 17V7h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z"/></svg>
          </div>
          <h4 class="m-0 mb-1 text-base font-semibold text-foreground">${canvas.name}</h4>
          <p class="m-0 text-sm font-medium text-primary">Clique para editar o Canvas</p>
        </div>
      </div>
      <p><br></p>
    `

    insertHtmlAtSelection(html)

    setCanvasModalOpen(false)
    setSelectedCanvasId(null)
  }

  const handleToolbarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const canvasBlock = target.closest('.canvas-preview-block')
    if (canvasBlock) {
      const canvasId = canvasBlock.getAttribute('data-canvas-id')
      if (canvasId) {
        e.preventDefault()
        setEditingCanvasId(canvasId)
      }
    }
  }

  const handleCanvasChange = (updatedFunnel: Funnel) => {
    setFunnels(
      funnels.map((f) => (f.id === updatedFunnel.id ? updatedFunnel : f)),
    )
  }

  const activeCanvas = funnels.find((f) => f.id === editingCanvasId)

  return (
    <div className="flex w-full h-full overflow-hidden bg-background relative">
      <div
        className={cn(
          'flex flex-col h-full overflow-y-auto transition-[width] duration-300 ease-in-out',
          editingCanvasId ? 'w-[50%] border-r' : 'w-full',
        )}
      >
        <div
          className={cn(
            'flex flex-col flex-1 mx-auto w-full transition-all duration-300',
            editingCanvasId ? 'p-6 max-w-3xl' : 'p-8 max-w-4xl',
          )}
        >
          <input
            value={doc.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-4xl font-bold border-none outline-none focus:ring-0 mb-8 bg-transparent text-foreground placeholder:text-muted-foreground shrink-0"
            placeholder="Título do Documento"
          />
          <div className="flex items-center gap-1 mb-6 border-b pb-4 sticky top-0 bg-background/95 backdrop-blur z-10 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onMouseDown={handleToolbarMouseDown}
              onClick={() => exec('formatBlock', 'H1')}
              title="Título 1"
            >
              <Heading1 size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onMouseDown={handleToolbarMouseDown}
              onClick={() => exec('formatBlock', 'H2')}
              title="Título 2"
            >
              <Heading2 size={18} />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Button
              variant="ghost"
              size="icon"
              onMouseDown={handleToolbarMouseDown}
              onClick={() => exec('bold')}
              title="Negrito"
            >
              <Bold size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onMouseDown={handleToolbarMouseDown}
              onClick={() => exec('italic')}
              title="Itálico"
            >
              <Italic size={18} />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Button
              variant="ghost"
              size="icon"
              onMouseDown={handleToolbarMouseDown}
              onClick={() => exec('insertUnorderedList')}
              title="Lista"
            >
              <List size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onMouseDown={handleToolbarMouseDown}
              onClick={() => exec('formatBlock', 'BLOCKQUOTE')}
              title="Citação"
            >
              <Quote size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onMouseDown={handleToolbarMouseDown}
              onClick={() => exec('insertHorizontalRule')}
              title="Divisor"
            >
              <SeparatorHorizontal size={18} />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-2" />

            <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onMouseDown={() => saveSelection()}
                  title="Adicionar Imagem"
                >
                  <ImageIcon size={18} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Imagem</DialogTitle>
                </DialogHeader>
                <form onSubmit={insertImage} className="space-y-4 pt-4">
                  <Input
                    placeholder="URL da Imagem (ex: https://...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    autoFocus
                  />
                  <Button type="submit" className="w-full">
                    Inserir Imagem
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={canvasModalOpen} onOpenChange={setCanvasModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onMouseDown={() => saveSelection()}
                  className="ml-auto flex items-center bg-primary/5 hover:bg-primary/10 text-primary transition-colors shrink-0"
                  title="Importar Canvas"
                >
                  <Network size={16} className="mr-2" /> Importar Canvas
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Selecionar Canvas</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                  {funnels.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setSelectedCanvasId(f.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${selectedCanvasId === f.id ? 'border-primary ring-1 ring-primary bg-primary/5' : 'hover:border-primary/50 bg-card'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-1">
                        <Network
                          size={20}
                          className={
                            selectedCanvasId === f.id
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{f.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {f.nodes.length} blocos mapeados
                        </p>
                      </div>
                    </div>
                  ))}
                  {funnels.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-muted-foreground text-sm">
                      Nenhum canvas disponível para importação.
                    </div>
                  )}
                </div>
                <Button
                  onClick={insertCanvas}
                  disabled={!selectedCanvasId}
                  className="w-full"
                >
                  Importar
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <div
            ref={editorRef}
            contentEditable
            className="flex-1 outline-none prose prose-indigo max-w-none focus:outline-none min-h-[500px] pb-32"
            onBlur={(e) => {
              saveSelection()
              onChange(e.currentTarget.innerHTML)
            }}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            onInput={(e) => {
              onChange(e.currentTarget.innerHTML)
            }}
            onClick={handleEditorClick}
            style={{ caretColor: 'hsl(var(--primary))' }}
          />
        </div>
      </div>

      {editingCanvasId && activeCanvas && (
        <div className="w-[50%] h-full flex flex-col bg-background shadow-[-10px_0_30px_rgba(0,0,0,0.05)] animate-in slide-in-from-right z-20 shrink-0">
          <div className="h-14 border-b flex items-center justify-between px-4 bg-card shrink-0">
            <div className="flex items-center gap-2 text-primary">
              <Network size={18} />
              <h3 className="font-semibold text-sm text-foreground">
                {activeCanvas.name}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingCanvasId(null)}
            >
              <X
                size={18}
                className="text-muted-foreground hover:text-foreground"
              />
            </Button>
          </div>
          <div className="flex-1 relative flex overflow-hidden">
            <CanvasBoard funnel={activeCanvas} onChange={handleCanvasChange} />
          </div>
        </div>
      )}
    </div>
  )
}
