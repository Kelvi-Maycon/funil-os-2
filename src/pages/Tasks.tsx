import { useState, useMemo } from 'react'
import useTaskStore from '@/stores/useTaskStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  KanbanSquare,
  Calendar,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import TasksOverview from '@/components/tasks/TasksOverview'
import TasksBoard from '@/components/tasks/TasksBoard'
import TasksList from '@/components/tasks/TasksList'
import TaskDetailSheet from '@/components/tasks/TaskDetailSheet'
import { useToast } from '@/hooks/use-toast'
import { Task } from '@/types'

export default function Tasks() {
  const [tasks, setTasks] = useTaskStore()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const filteredTasks = useMemo(() => {
    if (!search) return tasks
    return tasks.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase()),
    )
  }, [tasks, search])

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)))
    if (updates.status) toast({ title: `Tarefa atualizada` })
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto h-full flex flex-col">
      <Tabs
        defaultValue="list"
        className="flex-1 flex flex-col h-full overflow-hidden"
      >
        <TabsList className="bg-transparent w-full justify-start h-auto p-0 gap-2 mb-8 flex-wrap">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 data-[state=active]:shadow-none rounded-full px-4 py-2 text-muted-foreground"
          >
            <LayoutGrid className="w-4 h-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 data-[state=active]:shadow-none rounded-full px-4 py-2 text-muted-foreground"
          >
            <ListIcon className="w-4 h-4 mr-2" /> List
          </TabsTrigger>
          <TabsTrigger
            value="board"
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 data-[state=active]:shadow-none rounded-full px-4 py-2 text-muted-foreground"
          >
            <KanbanSquare className="w-4 h-4 mr-2" /> Board
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            disabled
            className="rounded-full px-4 py-2 text-muted-foreground"
          >
            <Calendar className="w-4 h-4 mr-2" /> Calendar
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter tasks by title..."
              className="pl-9 bg-card rounded-full shadow-sm border-muted"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center text-sm text-muted-foreground">
              Sort by:{' '}
              <span className="font-medium text-foreground ml-1">Stage</span>
            </div>
            <Button
              variant="outline"
              className="rounded-full bg-card shadow-sm border-muted"
            >
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
            <Button className="rounded-full">
              <Plus className="w-4 h-4 mr-2" /> New Task
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <TabsContent
            value="overview"
            className="h-full overflow-y-auto mt-0 border-none outline-none pb-8"
          >
            <TasksOverview tasks={filteredTasks} />
          </TabsContent>
          <TabsContent
            value="list"
            className="h-full overflow-y-auto mt-0 border-none outline-none pb-8"
          >
            <TasksList tasks={filteredTasks} onRowClick={setSelectedTask} />
          </TabsContent>
          <TabsContent
            value="board"
            className="h-full overflow-x-auto mt-0 border-none outline-none pb-8"
          >
            <TasksBoard
              tasks={filteredTasks}
              updateTask={updateTask}
              onCardClick={setSelectedTask}
            />
          </TabsContent>
        </div>
      </Tabs>

      <TaskDetailSheet
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={updateTask}
      />
    </div>
  )
}
