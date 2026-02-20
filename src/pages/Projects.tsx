import { useState } from 'react'
import useProjectStore from '@/stores/useProjectStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Projects() {
  const [projects, setProjects] = useProjectStore()
  const [search, setSearch] = useState('')
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [newName, setNewName] = useState('')

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    const newProject = {
      id: `p_${Date.now()}`,
      name: newName,
      description: 'Sem descrição',
      status: 'Ativo' as const,
      createdAt: new Date().toISOString(),
    }
    setProjects([...projects, newProject])
    setNewName('')
    setOpen(false)
    toast({ title: 'Projeto criado com sucesso!' })
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" /> Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Projeto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <Input
                placeholder="Nome do Projeto"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <Button type="submit" className="w-full">
                Criar Projeto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          placeholder="Buscar projetos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <Folder size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Nenhum projeto encontrado.</h3>
          <p className="text-muted-foreground mb-4">Vamos criar o primeiro?</p>
          <Button onClick={() => setOpen(true)}>Criar Projeto</Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link to={`/projetos/${p.id}`} key={p.id}>
              <Card className="hover:shadow-md transition-all cursor-pointer h-full group border-border hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                      {p.name}
                    </CardTitle>
                    <Badge
                      variant={p.status === 'Ativo' ? 'default' : 'secondary'}
                      className={
                        p.status === 'Ativo'
                          ? 'bg-green-500 hover:bg-green-600'
                          : ''
                      }
                    >
                      {p.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {p.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
