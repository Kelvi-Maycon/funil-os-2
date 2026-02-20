import { useState } from 'react'
import useTaskStore from '@/stores/useTaskStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import TasksOverview from '@/components/tasks/TasksOverview'
import TasksBoard from '@/components/tasks/TasksBoard'
import TasksList from '@/components/tasks/TasksList'
import { useToast } from '@/hooks/use-toast'

export default function Tasks() {
  const [tasks, setTasks] = useTaskStore()
  const { toast } = useToast()

  const updateTask = (id: string, updates: Partial<any>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)))
    if (updates.status) toast({ title: `Task movida para ${updates.status}` })
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
        <Button>
          <Plus size={16} className="mr-2" /> Nova Tarefa
        </Button>
      </div>

      <Tabs
        defaultValue="board"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="w-fit mb-4 shrink-0">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="board">Quadro Kanban</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-hidden relative">
          <TabsContent
            value="overview"
            className="h-full overflow-auto mt-0 border-none p-1"
          >
            <TasksOverview tasks={tasks} />
          </TabsContent>
          <TabsContent
            value="list"
            className="h-full overflow-auto mt-0 border-none p-1"
          >
            <TasksList tasks={tasks} />
          </TabsContent>
          <TabsContent
            value="board"
            className="h-full overflow-hidden mt-0 border-none p-1"
          >
            <TasksBoard tasks={tasks} updateTask={updateTask} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
