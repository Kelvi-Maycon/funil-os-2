import { useState } from 'react'
import useFunnelStore from '@/stores/useFunnelStore'
import useProjectStore from '@/stores/useProjectStore'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Network } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Funnels() {
  const [funnels, setFunnels] = useFunnelStore()
  const [projects] = useProjectStore()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleCreate = () => {
    const newFunnel = {
      id: `f_${Date.now()}`,
      projectId: projects[0]?.id || '',
      name: 'Novo Funil',
      status: 'Rascunho' as const,
      createdAt: new Date().toISOString(),
      nodes: [],
      edges: [],
    }
    setFunnels([...funnels, newFunnel])
    toast({ title: 'Funil criado!' })
    navigate(`/canvas/${newFunnel.id}`)
  }

  const getProjectName = (id: string) =>
    projects.find((p) => p.id === id)?.name || 'Sem Projeto'

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Canvas de Funis</h1>
        <Button onClick={handleCreate}>
          <Plus size={16} className="mr-2" /> Novo Funil
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {funnels.map((f) => (
              <TableRow key={f.id} className="hover:bg-muted/30">
                <TableCell className="font-medium flex items-center gap-2">
                  <Network size={16} className="text-primary" /> {f.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {getProjectName(f.projectId)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{f.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/canvas/${f.id}`}>
                    <Button variant="secondary" size="sm">
                      Abrir Canvas
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {funnels.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum funil encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
