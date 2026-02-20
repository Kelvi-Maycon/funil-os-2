import { Task } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { format, isPast, isToday } from 'date-fns'
import { CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react'

export default function TasksOverview({ tasks }: { tasks: Task[] }) {
  const total = tasks.length
  const inProgress = tasks.filter((t) => t.status === 'Em Progresso').length
  const completed = tasks.filter((t) => t.status === 'Concluído').length
  const overdue = tasks.filter(
    (t) =>
      t.status !== 'Concluído' &&
      isPast(new Date(t.deadline)) &&
      !isToday(new Date(t.deadline)),
  ).length

  const priorityCount = tasks.reduce(
    (acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const priorityData = Object.keys(priorityCount).map((k) => ({
    name: k,
    total: priorityCount[k],
  }))

  const upcomingTasks = tasks
    .filter((t) => t.status !== 'Concluído')
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    )
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tasks
            </CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">
              In Progress
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {inProgress}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Completed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{completed}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Overdue
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{overdue}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ChartContainer
              config={{
                total: { label: 'Total', color: 'hsl(var(--primary))' },
              }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry, index) => {
                      const color =
                        entry.name === 'Alta'
                          ? '#ef4444'
                          : entry.name === 'Média'
                            ? '#6366f1'
                            : '#cbd5e1'
                      return <Cell key={`cell-${index}`} fill={color} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">{t.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(t.deadline), 'MMM dd, yyyy')}
                    </span>
                  </div>
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
              ))}
              {upcomingTasks.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No upcoming deadlines
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
