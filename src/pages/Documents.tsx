import { useState } from 'react'
import useDocumentStore from '@/stores/useDocumentStore'
import RichTextEditor from '@/components/editor/RichTextEditor'
import { Button } from '@/components/ui/button'
import { FileText, Plus } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Documents() {
  const [docs, setDocs] = useDocumentStore()
  const [activeId, setActiveId] = useState(docs[0]?.id)

  const activeDoc = docs.find((d) => d.id === activeId)

  const createDoc = () => {
    const newDoc = {
      id: `d_${Date.now()}`,
      projectId: 'p1',
      title: 'Novo Documento',
      content: '',
      updatedAt: new Date().toISOString(),
    }
    setDocs([...docs, newDoc])
    setActiveId(newDoc.id)
  }

  return (
    <div className="flex h-full bg-background overflow-hidden animate-fade-in">
      <div className="w-64 border-r bg-card flex flex-col shrink-0 z-10 shadow-sm">
        <div className="p-4 border-b">
          <Button className="w-full" onClick={createDoc}>
            <Plus size={16} className="mr-2" /> Novo Documento
          </Button>
        </div>
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="flex flex-col gap-1">
            {docs.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={`flex items-center gap-3 text-left p-2.5 rounded-md text-sm transition-colors ${activeId === d.id ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-accent'}`}
              >
                <FileText
                  size={16}
                  className={
                    activeId === d.id ? 'text-primary' : 'text-muted-foreground'
                  }
                />
                <span className="truncate">{d.title}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="flex-1 overflow-auto bg-card">
        {activeDoc ? (
          <RichTextEditor
            doc={activeDoc}
            onTitleChange={(title) =>
              setDocs(
                docs.map((d) => (d.id === activeDoc.id ? { ...d, title } : d)),
              )
            }
            onChange={(content) =>
              setDocs(
                docs.map((d) =>
                  d.id === activeDoc.id ? { ...d, content } : d,
                ),
              )
            }
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-4">
            <FileText size={48} className="text-muted" />
            <span>Selecione um documento ou crie um novo.</span>
          </div>
        )}
      </div>
    </div>
  )
}
