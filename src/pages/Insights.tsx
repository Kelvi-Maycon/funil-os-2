import { useState } from 'react'
import useInsightStore from '@/stores/useInsightStore'
import useFolderStore from '@/stores/useFolderStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pin,
  Plus,
  Search,
  Folder as FolderIcon,
  Lightbulb,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  ViewToggle,
  FolderBreadcrumbs,
  CreateFolderDialog,
  MoveDialog,
} from '@/components/folders/FolderComponents'

const typeColors: Record<string, string> = {
  Observação: 'bg-blue-50 text-blue-600',
  Ideia: 'bg-violet-50 text-violet-600',
  Hipótese: 'bg-amber-50 text-amber-600',
  default: 'bg-indigo-50 text-indigo-600',
}

const statusColors: Record<string, string> = {
  Aplicado: 'text-emerald-600 border-emerald-200 bg-emerald-50',
  Salvo: 'text-blue-600 border-blue-200 bg-blue-50',
  Rascunho: 'text-slate-500 border-slate-200 bg-slate-50',
  Descartado: 'text-red-500 border-red-200 bg-red-50',
}

export default function Insights() {
  const [insights, setInsights] = useInsightStore()
  const [allFolders, setFolders] = useFolderStore()
  const [, setAction] = useQuickActionStore()
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const { toast } = useToast()

  const moduleFolders = allFolders.filter((f) => f.module === 'insight')

  const currentFolders = moduleFolders.filter((f) => {
    if (search) return f.name.toLowerCase().includes(search.toLowerCase())
    return f.parentId === currentFolderId
  })

  const filteredInsights = insights
    .filter((i) => {
      if (search)
        return (
          i.title.toLowerCase().includes(search.toLowerCase()) ||
          i.content.toLowerCase().includes(search.toLowerCase())
        )
      return (i.folderId || null) === currentFolderId
    })
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))

  const handleCreateFolder = (name: string) => {
    setFolders([
      ...allFolders,
      {
        id: `f_${Date.now()}`,
        module: 'insight',
        name,
        parentId: currentFolderId,
        createdAt: new Date().toISOString(),
      },
    ])
    toast({ title: 'Pasta criada com sucesso!' })
  }

  const updateInsightFolder = (id: string, folderId: string | null) => {
    setInsights(insights.map((i) => (i.id === id ? { ...i, folderId } : i)))
    toast({ title: 'Insight movido com sucesso!' })
  }

  const togglePin = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setInsights(
      insights.map((i) => (i.id === id ? { ...i, isPinned: !i.isPinned } : i)),
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Insights</h1>
          <FolderBreadcrumbs
            currentFolderId={currentFolderId}
            folders={moduleFolders}
            onNavigate={setCurrentFolderId}
            rootName="Insights"
          />
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle view={view} onChange={setView} />
          <CreateFolderDialog onConfirm={handleCreateFolder} />
          <Button
            onClick={() => setAction({ type: 'insight', mode: 'create' })}
            className="rounded-xl gradient-primary text-white border-0 shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all"
          >
            <Plus size={16} className="mr-2" /> Novo Insight
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          placeholder="Pesquisar insights..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white rounded-xl border-border/50"
        />
      </div>

      {currentFolders.length === 0 && filteredInsights.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center animate-scale-in">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <Lightbulb size={32} className="text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold">Vazio</h3>
          <p className="text-muted-foreground mb-4">
            Crie um insight ou uma pasta para se organizar.
          </p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {currentFolders.map((f) => (
            <Card
              key={f.id}
              onClick={() => setCurrentFolderId(f.id)}
              className="card-hover cursor-pointer h-full group border-0 shadow-sm flex items-center p-4 gap-3 min-h-[160px]"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <FolderIcon className="text-indigo-500 fill-indigo-100" size={24} />
              </div>
              <span className="font-semibold text-lg group-hover:text-primary transition-colors">
                {f.name}
              </span>
            </Card>
          ))}
          {filteredInsights.map((i) => (
            <Card
              key={i.id}
              className="relative card-hover border-0 shadow-sm group flex flex-col cursor-pointer overflow-hidden"
              onClick={() =>
                setAction({ type: 'insight', mode: 'edit', itemId: i.id })
              }
            >
              {i.isPinned && (
                <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
              )}
              {i.isPinned && (
                <Pin
                  className="absolute top-4 right-4 text-indigo-500 fill-indigo-500 z-10"
                  size={16}
                  onClick={(e) => togglePin(e, i.id)}
                />
              )}
              {!i.isPinned && (
                <Pin
                  className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  size={16}
                  onClick={(e) => togglePin(e, i.id)}
                />
              )}
              <CardHeader className="pb-2 pr-12">
                <div className="flex flex-col gap-2 items-start">
                  <Badge
                    variant="secondary"
                    className={`border-0 ${typeColors[i.type] || typeColors.default}`}
                  >
                    {i.type}
                  </Badge>
                  <CardTitle className="text-lg leading-snug">
                    {i.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-muted-foreground text-sm line-clamp-4 leading-relaxed flex-1">
                  {i.content}
                </p>
                <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      Há 2 dias
                    </span>
                    <div
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                    >
                      <MoveDialog
                        folders={moduleFolders}
                        currentFolderId={i.folderId}
                        onMove={(id) => updateInsightFolder(i.id, id)}
                      />
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${statusColors[i.status] || ''}`}>
                    {i.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white border-0 rounded-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentFolders.map((f) => (
                <TableRow
                  key={f.id}
                  onClick={() => setCurrentFolderId(f.id)}
                  className="cursor-pointer group hover:bg-indigo-50/50 transition-colors"
                >
                  <TableCell className="font-medium flex items-center gap-2 py-4">
                    <FolderIcon
                      className="text-indigo-500 fill-indigo-100"
                      size={16}
                    />
                    {f.name}
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
              {filteredInsights.map((i) => (
                <TableRow
                  key={i.id}
                  className="cursor-pointer hover:bg-indigo-50/50 transition-colors"
                  onClick={() =>
                    setAction({ type: 'insight', mode: 'edit', itemId: i.id })
                  }
                >
                  <TableCell className="font-medium py-4">
                    <div className="flex items-center gap-2">
                      {i.title}
                      {i.isPinned && (
                        <Pin className="text-indigo-500 fill-indigo-500" size={14} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`border-0 ${typeColors[i.type] || typeColors.default}`}
                    >
                      {i.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[i.status] || ''}>
                      {i.status}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <MoveDialog
                      folders={moduleFolders}
                      currentFolderId={i.folderId}
                      onMove={(id) => updateInsightFolder(i.id, id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
