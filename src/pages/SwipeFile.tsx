import { useState } from 'react'
import useSwipeStore from '@/stores/useSwipeStore'
import useFolderStore from '@/stores/useFolderStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Star,
  Filter,
  Folder as FolderIcon,
  Search,
  Image as ImageIcon,
  Pencil,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  ViewToggle,
  FolderBreadcrumbs,
  CreateFolderDialog,
  MoveDialog,
} from '@/components/folders/FolderComponents'

export default function SwipeFile() {
  const [swipes, setSwipes] = useSwipeStore()
  const [allFolders, setFolders] = useFolderStore()
  const [, setAction] = useQuickActionStore()
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const { toast } = useToast()

  const moduleFolders = allFolders.filter((f) => f.module === 'swipe')

  const currentFolders = moduleFolders.filter((f) => {
    if (search) return f.name.toLowerCase().includes(search.toLowerCase())
    return f.parentId === currentFolderId
  })

  const filteredSwipes = swipes.filter((s) => {
    if (search) return s.title.toLowerCase().includes(search.toLowerCase())
    return (s.folderId || null) === currentFolderId
  })

  const handleCreateFolder = (name: string) => {
    setFolders([
      ...allFolders,
      {
        id: `f_${Date.now()}`,
        module: 'swipe',
        name,
        parentId: currentFolderId,
        createdAt: new Date().toISOString(),
      },
    ])
    toast({ title: 'Pasta criada com sucesso!' })
  }

  const updateSwipeFolder = (id: string, folderId: string | null) => {
    setSwipes(swipes.map((s) => (s.id === id ? { ...s, folderId } : s)))
    toast({ title: 'Inspiração movida com sucesso!' })
  }

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setSwipes(
      swipes.map((s) =>
        s.id === id ? { ...s, isFavorite: !s.isFavorite } : s,
      ),
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Swipe File</h1>
          <FolderBreadcrumbs
            currentFolderId={currentFolderId}
            folders={moduleFolders}
            onNavigate={setCurrentFolderId}
            rootName="Swipe File"
          />
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle view={view} onChange={setView} />
          <CreateFolderDialog onConfirm={handleCreateFolder} />
          <Button variant="outline" className="rounded-xl border-border/50">
            <Filter size={16} className="mr-2" /> Filtrar
          </Button>
          <Button
            onClick={() => setAction({ type: 'swipe', mode: 'create' })}
            className="rounded-xl gradient-primary text-white border-0 shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all"
          >
            Salvar Inspiração
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          className="pl-10 bg-white rounded-xl border-border/50"
          placeholder="Buscar inspirações..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {currentFolders.length === 0 && filteredSwipes.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center animate-scale-in">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <ImageIcon size={32} className="text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold">Vazio</h3>
          <p className="text-muted-foreground mb-4">
            Adicione uma inspiração ou crie uma pasta.
          </p>
        </div>
      ) : view === 'grid' ? (
        <>
          {currentFolders.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 stagger-children">
              {currentFolders.map((f) => (
                <Card
                  key={f.id}
                  onClick={() => setCurrentFolderId(f.id)}
                  className="card-hover cursor-pointer group border-0 shadow-sm flex items-center p-4 gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <FolderIcon
                      className="text-indigo-500 fill-indigo-100"
                      size={20}
                    />
                  </div>
                  <span className="font-semibold group-hover:text-primary transition-colors">
                    {f.name}
                  </span>
                </Card>
              ))}
            </div>
          )}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5">
            {filteredSwipes.map((s) => (
              <div
                key={s.id}
                className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm border-0 bg-card cursor-pointer card-hover"
                onClick={() =>
                  setAction({ type: 'swipe', mode: 'edit', itemId: s.id })
                }
              >
                <div
                  className="absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <MoveDialog
                    folders={moduleFolders}
                    currentFolderId={s.folderId}
                    onMove={(id) => updateSwipeFolder(s.id, id)}
                  />
                </div>
                <Star
                  className={`absolute top-3 right-3 drop-shadow-md z-10 transition-all cursor-pointer ${s.isFavorite ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-white/60 opacity-0 group-hover:opacity-100'}`}
                  size={20}
                  onClick={(e) => toggleFavorite(e, s.id)}
                />
                <img
                  src={s.imageUrl}
                  alt={s.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end pointer-events-none">
                  <h3 className="text-white font-semibold">{s.title}</h3>
                  <p className="text-white/80 text-sm">{s.category}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white border-0 rounded-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Preview</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
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
                  <TableCell className="w-16">
                    <div className="w-10 h-10 flex items-center justify-center bg-indigo-50 rounded-lg">
                      <FolderIcon
                        className="text-indigo-500 fill-indigo-100"
                        size={20}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{f.name}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
              {filteredSwipes.map((s) => (
                <TableRow
                  key={s.id}
                  className="cursor-pointer hover:bg-indigo-50/50 transition-colors"
                  onClick={() =>
                    setAction({ type: 'swipe', mode: 'edit', itemId: s.id })
                  }
                >
                  <TableCell className="w-16">
                    <img
                      src={s.imageUrl}
                      alt={s.title}
                      className="w-10 h-10 object-cover rounded-lg border"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2 py-2">
                      {s.title}{' '}
                      <Star
                        className={`transition-colors cursor-pointer ${s.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                        size={14}
                        onClick={(e) => toggleFavorite(e, s.id)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{s.category}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-lg"
                        onClick={() =>
                          setAction({
                            type: 'swipe',
                            mode: 'edit',
                            itemId: s.id,
                          })
                        }
                      >
                        <Pencil size={14} />
                      </Button>
                      <MoveDialog
                        folders={moduleFolders}
                        currentFolderId={s.folderId}
                        onMove={(id) => updateSwipeFolder(s.id, id)}
                      />
                    </div>
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
