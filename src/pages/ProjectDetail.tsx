import { useParams, Link, useNavigate } from 'react-router-dom'
import useProjectStore from '@/stores/useProjectStore'
import useFunnelStore from '@/stores/useFunnelStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Target } from 'lucide-react'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [projects] = useProjectStore()
  const [funnels] = useFunnelStore()

  const project = projects.find((p) => p.id === id)
  const projectFunnels = funnels.filter((f) => f.projectId === id)

  if (!project)
    return <div className="p-8 text-center">Projeto não encontrado</div>

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="-ml-4 text-muted-foreground"
      >
        <ArrowLeft size={16} className="mr-2" /> Voltar
      </Button>

      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            <Badge
              variant={project.status === 'Ativo' ? 'default' : 'secondary'}
              className={project.status === 'Ativo' ? 'bg-green-500' : ''}
            >
              {project.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">{project.description}</p>
        </div>
        <Button variant="outline">
          <Edit size={16} className="mr-2" /> Editar
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Funis Vinculados</h2>
          <Button variant="secondary" size="sm">
            Novo Funil
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {projectFunnels.map((f) => (
            <Card key={f.id} className="group">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target size={16} className="text-primary" /> {f.name}
                  </CardTitle>
                  <Badge variant="outline">{f.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted-foreground">
                  {f.nodes.length} blocos mapeados
                </span>
                <Link to={`/canvas/${f.id}`}>
                  <Button size="sm">Abrir no Canvas</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
          {projectFunnels.length === 0 && (
            <div className="col-span-2 p-8 border rounded-lg text-center bg-muted/20">
              <span className="text-muted-foreground">
                Nenhum funil criado para este projeto.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
