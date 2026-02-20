import { Task } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { format } from 'date-fns'

export default function TasksBoard({
  tasks,
  updateTask,
}: {
  tasks: Task[]
  updateTask: (id: string, updates: Partial<Task>) => void
}) {
  const columns = ['A Fazer', 'Em Progresso', 'Em Revisão', 'Concluído']

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('taskId')
    if (id) updateTask(id, { status: status as Task['status'] })
  }

  const priorityColors = {
    Alta: 'bg-red-100 text-red-700 hover:bg-red-100',
    Média: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
    Baixa: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 h-full min-h-[500px]">
      {columns.map((col) => (
        <div
          key={col}
          className="w-80 shrink-0 flex flex-col bg-muted/50 rounded-xl p-4 border"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, col)}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm text-foreground">{col}</h3>
            <Badge variant="secondary">
              {tasks.filter((t) => t.status === col).length}
            </Badge>
          </div>
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-[100px]">
            {tasks
              .filter((t) => t.status === col)
              .map((t) => (
                <Card
                  key={t.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('taskId', t.id)}
                  className="cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing"
                >
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <Badge
                        variant="outline"
                        className={`border-none ${priorityColors[t.priority]}`}
                      >
                        {t.priority}
                      </Badge>
                    </div>
                    <span className="font-medium text-sm leading-snug">
                      {t.title}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Clock size={12} />
                      <span>{format(new Date(t.deadline), 'dd/MM/yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
