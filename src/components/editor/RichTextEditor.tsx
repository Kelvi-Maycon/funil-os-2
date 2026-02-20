import { useRef, useEffect, useState, useCallback } from 'react'
import { Document } from '@/types'
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
  const [funnels] = useFunnelStore()
  const [canvasModalOpen, setCanvasModalOpen] = useState(false)
  const [selectedCanvasId, setSelectedCanvasId] = useState<string | null>(null)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [savedRange, setSavedRange] = useState<Range | null>(null)

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
      <div contenteditable="false" style="display: flex; justify-content: center; margin: 32px 0; user-select: none;">
        <div style="border: 1px solid hsl(var(--border)); background-color: hsl(var(--muted)/0.5); padding: 24px; border-radius: 8px; width: 100%; max-width: 500px; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px; color: hsl(var(--primary));">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 17V7h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z"/></svg>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: hsl(var(--foreground));">${canvas.name}</h4>
          <p style="margin: 0; font-size: 13px; color: hsl(var(--muted-foreground));">Preview do Canvas (${canvas.nodes.length} blocos)</p>
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

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-8">
      <input
        value={doc.title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-4xl font-bold border-none outline-none focus:ring-0 mb-8 bg-transparent text-foreground placeholder:text-muted-foreground"
        placeholder="Título do Documento"
      />
      <div className="flex items-center gap-1 mb-6 border-b pb-4 sticky top-0 bg-background/95 backdrop-blur z-10">
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
              className="ml-auto flex items-center bg-primary/5 hover:bg-primary/10 text-primary transition-colors"
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
        style={{ caretColor: 'hsl(var(--primary))' }}
      />
    </div>
  )
}
