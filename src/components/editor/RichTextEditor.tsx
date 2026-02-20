import { useRef, useEffect } from 'react'
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
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

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

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== doc.content) {
      editorRef.current.innerHTML = doc.content
    }
  }, [doc.id])

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val)
    editorRef.current?.focus()
    onChange(editorRef.current?.innerHTML || '')
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
          onClick={() => exec('formatBlock', 'H1')}
          title="Título 1"
        >
          <Heading1 size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => exec('formatBlock', 'H2')}
          title="Título 2"
        >
          <Heading2 size={18} />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-2" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => exec('bold')}
          title="Negrito"
        >
          <Bold size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => exec('italic')}
          title="Itálico"
        >
          <Italic size={18} />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-2" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => exec('insertUnorderedList')}
          title="Lista"
        >
          <List size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => exec('formatBlock', 'BLOCKQUOTE')}
          title="Citação"
        >
          <Quote size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => exec('insertHorizontalRule')}
          title="Divisor"
        >
          <SeparatorHorizontal size={18} />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="flex-1 outline-none prose prose-indigo max-w-none focus:outline-none"
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  )
}
