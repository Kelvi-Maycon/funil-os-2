import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useProjectStore from '@/stores/useProjectStore'
import useFunnelStore from '@/stores/useFunnelStore'
import useTaskStore from '@/stores/useTaskStore'
import useDocumentStore from '@/stores/useDocumentStore'
import useAssetStore from '@/stores/useAssetStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  LayoutGrid,
  Network,
  FileText,
  CheckSquare,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  Plus,
  Activity,
} from 'lucide-react'
import { format } from 'date-fns'

import TasksBoard from '@/components/tasks/TasksBoard'
import TaskDetailSheet from '@/components/tasks/TaskDetailSheet'
import { Task } from '@/types'

const mockActivities = [
  {
    id: 1,
    user: 'João Silva',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
    action: 'criou o funil',
    target: 'Página de Captura',
    time: 'Há 2 horas',
    icon: Network,
    iconColor: 'text-purple-500',
  },
  {
    id: 2,
    user: 'Maria Santos',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
    action: 'concluiu a tarefa',
    target: 'Design Home',
    time: 'Há 4 horas',
    icon: CheckCircle2,
    iconColor: 'text-green-500',
  },
  {
    id: 3,
    user: 'Carlos Costa',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4',
    action: 'adicionou um documento',
    target: 'Briefing V1',
    time: 'Ontem',
    icon: FileText,
    iconColor: 'text-blue-500',
  },
]

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [projects] = useProjectStore()
  const [funnels, setFunnels] = useFunnelStore()
  const [tasks, setTasks] = useTaskStore()
  const [docs] = useDocumentStore()
  const [assets] = useAssetStore()

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const project = projects.find((p) => p.id === id)

  const projectFunnels = useMemo(
    () => funnels.filter((f) => f.projectId === id),
    [funnels, id],
  )
  const projectTasks = useMemo(
    () => tasks.filter((t) => t.projectId === id),
    [tasks, id],
  )
  const projectDocs = useMemo(
    () => docs.filter((d) => d.projectId === id),
    [docs, id],
  )
  const projectAssets = useMemo(
    () => assets.filter((a) => a.projectId === id),
    [assets, id],
  )

  if (!project)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Projeto não encontrado
      </div>
    )

  const completedTasks = projectTasks.filter(
    (t) => t.status === 'Concluído',
  ).length
  const totalTasks = projectTasks.length
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const upcomingTasks = projectTasks
    .filter((t) => t.status !== 'Concluído')
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    )
    .slice(0, 5)

  const recentDocs = projectDocs
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 3)

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)))
  }

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden animate-fade-in">
      <div className="shrink-0 border-b bg-white px-6 md:px-8 py-6 flex flex-col gap-6 z-10 shadow-sm relative">
        <div className="flex items-center text-sm text-muted-foreground">
          <Button
            variant="link"
            onClick={() => navigate('/projetos')}
            className="p-0 h-auto text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} className="mr-1" /> Voltar para Projetos
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {project.name}
              </h1>
              <Badge
                variant={project.status === 'Ativo' ? 'default' : 'secondary'}
                className={
                  project.status === 'Ativo'
                    ? 'bg-green-500 hover:bg-green-600'
                    : ''
                }
              >
                {project.status}
              </Badge>
            </div>
            <p className="text-slate-500 text-base max-w-2xl">
              {project.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 min-w-[300px]">
            <div className="space-y-1.5 flex-1 w-full">
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Progresso</span>
                <span className="text-slate-700 font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-slate-200" />
            </div>
            <div className="flex -space-x-2 shrink-0">
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1" />
              </Avatar>
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2" />
              </Avatar>
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3" />
              </Avatar>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-medium">
                +2
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 md:p-8 relative">
        <div className="max-w-7xl mx-auto h-full">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <TabsList className="bg-transparent gap-2 h-auto p-0 mb-8 flex-wrap shrink-0 justify-start">
              <TabsTrigger
                value="overview"
                className="rounded-full px-5 py-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200 transition-all"
              >
                <LayoutGrid className="w-4 h-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger
                value="funnels"
                className="rounded-full px-5 py-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200 transition-all"
              >
                <Network className="w-4 h-4 mr-2" /> Funnels
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="rounded-full px-5 py-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200 transition-all"
              >
                <FileText className="w-4 h-4 mr-2" /> Documents
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="rounded-full px-5 py-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200 transition-all"
              >
                <CheckSquare className="w-4 h-4 mr-2" /> Tasks
              </TabsTrigger>
              <TabsTrigger
                value="assets"
                className="rounded-full px-5 py-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200 transition-all"
              >
                <ImageIcon className="w-4 h-4 mr-2" /> Assets & Swipe
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 min-h-0">
              <TabsContent
                value="overview"
                className="mt-0 h-full border-none outline-none pb-8 animate-fade-in space-y-6"
              >
                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-slate-500">
                        Total Funnels
                      </CardTitle>
                      <Network className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">
                        {projectFunnels.length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-slate-500">
                        Tasks Pendentes
                      </CardTitle>
                      <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">
                        {totalTasks - completedTasks}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-slate-500">
                        Documentos
                      </CardTitle>
                      <FileText className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">
                        {projectDocs.length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-slate-500">
                        Assets
                      </CardTitle>
                      <ImageIcon className="h-4 w-4 text-pink-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">
                        {projectAssets.length}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-slate-400" />
                        Recent Updates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {mockActivities.map((activity) => {
                          const Icon = activity.icon
                          return (
                            <div key={activity.id} className="flex gap-4">
                              <div className="relative mt-1 shrink-0">
                                <Avatar className="w-8 h-8 ring-2 ring-white shadow-sm">
                                  <AvatarImage src={activity.avatar} />
                                  <AvatarFallback>
                                    {activity.user[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
                                  <Icon
                                    className={`w-3 h-3 ${activity.iconColor}`}
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col flex-1 gap-0.5">
                                <div className="text-sm text-slate-600">
                                  <span className="font-semibold text-slate-800">
                                    {activity.user}
                                  </span>{' '}
                                  {activity.action}{' '}
                                  <span className="font-medium text-slate-800">
                                    {activity.target}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">
                                  {activity.time}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="col-span-1 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Clock className="w-5 h-5 text-slate-400" />
                          Upcoming Deadlines
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {upcomingTasks.map((t) => (
                            <div
                              key={t.id}
                              className="flex flex-col gap-1 border-b last:border-0 pb-3 last:pb-0 cursor-pointer group"
                              onClick={() => setSelectedTask(t)}
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-sm text-slate-800 line-clamp-1 group-hover:text-purple-600 transition-colors">
                                  {t.title}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={
                                    t.priority === 'Alta'
                                      ? 'text-red-600 bg-red-50 border-red-200'
                                      : t.priority === 'Média'
                                        ? 'text-indigo-600 bg-indigo-50 border-indigo-200'
                                        : 'text-slate-600 bg-slate-50 border-slate-200'
                                  }
                                >
                                  {t.priority}
                                </Badge>
                              </div>
                              <span className="text-xs text-slate-500">
                                {format(new Date(t.deadline), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          ))}
                          {upcomingTasks.length === 0 && (
                            <div className="text-sm text-slate-400 text-center py-4">
                              No upcoming tasks
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="w-5 h-5 text-slate-400" />
                          Recent Documents
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {recentDocs.map((d) => (
                            <div
                              key={d.id}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                              onClick={() => navigate('/documentos')}
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                <FileText size={16} />
                              </div>
                              <div className="flex flex-col flex-1 overflow-hidden">
                                <span className="text-sm font-medium text-slate-800 truncate">
                                  {d.title}
                                </span>
                                <span className="text-[11px] text-slate-400 truncate">
                                  Atualizado em{' '}
                                  {format(new Date(d.updatedAt), 'dd/MM/yyyy')}
                                </span>
                              </div>
                            </div>
                          ))}
                          {recentDocs.length === 0 && (
                            <div className="text-sm text-slate-400 text-center py-4">
                              Nenhum documento
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="funnels"
                className="mt-0 h-full border-none outline-none pb-8 animate-fade-in"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Funis do Projeto</h3>
                  <Button
                    onClick={() => {
                      const newFunnel = {
                        id: `f_${Date.now()}`,
                        projectId: project.id,
                        folderId: null,
                        name: 'Novo Funil',
                        status: 'Rascunho' as const,
                        createdAt: new Date().toISOString(),
                        nodes: [],
                        edges: [],
                      }
                      setFunnels([...funnels, newFunnel])
                      navigate(`/canvas/${newFunnel.id}`)
                    }}
                  >
                    <Plus size={16} className="mr-2" /> Novo Funil
                  </Button>
                </div>
                {projectFunnels.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projectFunnels.map((f) => (
                      <Card
                        key={f.id}
                        className="cursor-pointer hover:shadow-md transition-shadow group border-slate-200 hover:border-purple-200 overflow-hidden"
                        onClick={() => navigate(`/canvas/${f.id}`)}
                      >
                        <div
                          className="h-32 bg-slate-50 border-b border-slate-100 relative"
                          style={{
                            backgroundImage:
                              'radial-gradient(#cbd5e1 1px, transparent 0)',
                            backgroundSize: '16px 16px',
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/40 backdrop-blur-[2px] z-10">
                            <Button
                              variant="secondary"
                              className="bg-white shadow-sm hover:bg-slate-50 text-purple-600 rounded-xl pointer-events-none"
                            >
                              Abrir Canvas
                            </Button>
                          </div>
                          {f.nodes.length > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-40 scale-75">
                              <Network size={64} className="text-slate-400" />
                            </div>
                          )}
                        </div>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base font-semibold text-slate-800">
                            {f.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex justify-between items-center">
                          <span className="text-xs text-slate-500">
                            {f.nodes.length} blocos
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-slate-50 text-slate-600 border-slate-200"
                          >
                            {f.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-400">
                      <Network size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-700">
                      Nenhum funil encontrado
                    </h3>
                    <p className="text-slate-500 mt-1 mb-4">
                      Crie o primeiro funil para este projeto.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="documents"
                className="mt-0 h-full border-none outline-none pb-8 animate-fade-in"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Documentos</h3>
                  <Button onClick={() => navigate('/documentos')}>
                    <Plus size={16} className="mr-2" /> Novo Documento
                  </Button>
                </div>
                {projectDocs.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projectDocs.map((d) => (
                      <Card
                        key={d.id}
                        className="cursor-pointer hover:shadow-md transition-shadow group border-slate-200 hover:border-blue-200"
                        onClick={() => navigate('/documentos')}
                      >
                        <CardHeader className="p-5 pb-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform">
                            <FileText size={20} />
                          </div>
                          <CardTitle className="text-base font-semibold text-slate-800 line-clamp-1">
                            {d.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                          <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                            {d.content.replace(/<[^>]*>?/gm, '') ||
                              'Documento vazio'}
                          </p>
                          <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>
                              Atualizado{' '}
                              {format(new Date(d.updatedAt), 'dd/MM/yyyy')}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-400">
                      <FileText size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-700">
                      Nenhum documento
                    </h3>
                    <p className="text-slate-500 mt-1 mb-4">
                      Crie briefings e textos para este projeto.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="tasks"
                className="mt-0 h-full border-none outline-none pb-8 animate-fade-in"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Quadro de Tarefas</h3>
                  <Button>
                    <Plus size={16} className="mr-2" /> Nova Tarefa
                  </Button>
                </div>
                <div className="h-[600px] -mx-4 px-4 overflow-hidden">
                  <TasksBoard
                    tasks={projectTasks}
                    updateTask={updateTask}
                    onCardClick={setSelectedTask}
                  />
                </div>
              </TabsContent>

              <TabsContent
                value="assets"
                className="mt-0 h-full border-none outline-none pb-8 animate-fade-in"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Assets & Swipe File</h3>
                  <Button onClick={() => navigate('/assets')}>
                    <Plus size={16} className="mr-2" /> Adicionar Asset
                  </Button>
                </div>
                {projectAssets.length > 0 ? (
                  <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {projectAssets.map((asset) => (
                      <Card
                        key={asset.id}
                        className="overflow-hidden hover:shadow-lg transition-all group border-slate-200"
                      >
                        <div className="aspect-square bg-slate-100 relative">
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="bg-white/90 hover:bg-white text-slate-900 pointer-events-none"
                            >
                              Visualizar
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-3 bg-white">
                          <h3 className="font-medium text-sm truncate text-slate-800">
                            {asset.name}
                          </h3>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            <Badge
                              variant="secondary"
                              className="bg-pink-50 text-pink-600 hover:bg-pink-100 border-none text-[10px] px-1.5 py-0 font-medium"
                            >
                              {asset.category}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-400">
                      <ImageIcon size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-700">
                      Nenhum asset
                    </h3>
                    <p className="text-slate-500 mt-1 mb-4">
                      Faça upload de imagens e referências.
                    </p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <TaskDetailSheet
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={updateTask}
      />
    </div>
  )
}
