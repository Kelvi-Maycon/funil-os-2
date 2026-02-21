import { Link } from 'react-router-dom'
import useProjectStore from '@/stores/useProjectStore'
import useTaskStore from '@/stores/useTaskStore'
import useFunnelStore from '@/stores/useFunnelStore'
import useInsightStore from '@/stores/useInsightStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  CheckCircle2,
  Clock,
  Target,
  CheckSquare,
  Layers,
  Plus,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'

export default function Index() {
  const [projects] = useProjectStore()
  const [tasks] = useTaskStore()
  const [funnels] = useFunnelStore()
  const [insights] = useInsightStore()
  const [, setAction] = useQuickActionStore()

  const activeProjects = projects.filter((p) => p.status === 'Ativo').length
  const pendingTasks = tasks.filter((t) => t.status !== 'Concluído')
  const completedToday = tasks.filter((t) => t.status === 'Concluído').length
  const activeFunnels = funnels.filter(
    (f) => f.status === 'Ativo' || f.status === 'Em Progresso',
  ).length
  const recentInsights = insights.slice(0, 3)

  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-indigo-500" />
            <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Bom dia, <span className="gradient-text">Kelvi</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Aqui está o resumo do seu workspace
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-indigo-500/20 gradient-primary text-white border-0 hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:scale-[1.02]">
              <Plus className="mr-2" size={16} /> Quick Action
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-border/50">
            <DropdownMenuItem
              onClick={() => setAction({ type: 'canvas', mode: 'create' })}
              className="rounded-lg"
            >
              Novo Canvas
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setAction({ type: 'task', mode: 'create' })}
              className="rounded-lg"
            >
              Nova Tarefa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setAction({ type: 'document', mode: 'create' })}
              className="rounded-lg"
            >
              Novo Documento
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setAction({ type: 'asset', mode: 'create' })}
              className="rounded-lg"
            >
              Novo Asset
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setAction({ type: 'insight', mode: 'create' })}
              className="rounded-lg"
            >
              Novo Insight
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setAction({ type: 'swipe', mode: 'create' })}
              className="rounded-lg"
            >
              Nova Inspiração
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 stagger-children">
        <Card className="relative overflow-hidden card-hover border-0 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projetos Ativos
            </CardTitle>
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Layers className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-extrabold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              de {projects.length} projetos
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden card-hover border-0 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Canvas Ativos
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-extrabold">{activeFunnels}</div>
            <p className="text-xs text-muted-foreground mt-1">
              de {funnels.length} canvas
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden card-hover border-0 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasks Pendentes
            </CardTitle>
            <div className="w-9 h-9 rounded-xl gradient-amber flex items-center justify-center shadow-md shadow-amber-500/20">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-extrabold text-amber-600">
              {pendingTasks.length}
            </div>
            <div className="mt-2 h-1.5 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (pendingTasks.length / Math.max(totalTasks, 1)) * 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden card-hover border-0 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasks Concluídas
            </CardTitle>
            <div className="w-9 h-9 rounded-xl gradient-success flex items-center justify-center shadow-md shadow-emerald-500/20">
              <CheckSquare className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-extrabold text-emerald-600">
              {completedToday}
            </div>
            <div className="mt-2 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks & Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col border-0 shadow-sm card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-7 h-7 rounded-lg gradient-amber flex items-center justify-center">
                  <Clock size={14} className="text-white" />
                </div>
                Próximas Tasks
              </CardTitle>
              <Link
                to="/tarefas"
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                Ver todas <ArrowUpRight size={12} />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3">
              {pendingTasks.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0 group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm group-hover:text-primary transition-colors">
                      {t.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(t.deadline), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      t.priority === 'Alta'
                        ? 'text-red-600 border-red-200 bg-red-50'
                        : t.priority === 'Média'
                          ? 'text-amber-600 border-amber-200 bg-amber-50'
                          : 'text-slate-500 border-slate-200 bg-slate-50'
                    }
                  >
                    {t.priority}
                  </Badge>
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma task pendente 🎉
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col border-0 shadow-sm card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                Insights Recentes
              </CardTitle>
              <Link
                to="/insights"
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                Ver todos <ArrowUpRight size={12} />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3">
              {recentInsights.map((i) => (
                <div
                  key={i.id}
                  className="flex flex-col gap-1.5 border-b border-border/50 pb-3 last:border-0 last:pb-0 group"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                      {i.title}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] bg-indigo-50 text-indigo-600 border-0 shrink-0"
                    >
                      {i.type}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {i.content}
                  </span>
                </div>
              ))}
              {recentInsights.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum insight ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">
            Projetos Recentes
          </h2>
          <Link
            to="/projetos"
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
          >
            Ver todos <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3 stagger-children">
          {projects.slice(0, 3).map((p) => (
            <Link to={`/projetos/${p.id}`} key={p.id}>
              <Card className="card-hover cursor-pointer h-full group border-0 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {p.name}
                    </CardTitle>
                    <Badge
                      variant={p.status === 'Ativo' ? 'default' : 'secondary'}
                      className={
                        p.status === 'Ativo'
                          ? 'gradient-success border-0 text-white shadow-sm shadow-emerald-500/20'
                          : p.status === 'Pausado'
                            ? 'bg-amber-100 text-amber-700 border-0'
                            : ''
                      }
                    >
                      {p.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {p.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
