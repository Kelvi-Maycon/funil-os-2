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

export default function TasksOverview({ tasks }: { tasks: Task[] }) {
  const statusCount = tasks.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.keys(statusCount).map((k) => ({
    name: k,
    total: statusCount[k],
  }))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribuição por Status</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ChartContainer
            config={{ total: { label: 'Total', color: 'hsl(var(--primary))' } }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
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
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo Geral</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <span className="font-medium text-muted-foreground">
              Total de Tarefas
            </span>
            <span className="text-2xl font-bold">{tasks.length}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-primary/10 text-primary rounded-lg">
            <span className="font-medium">A Fazer</span>
            <span className="text-2xl font-bold">
              {tasks.filter((t) => t.status === 'A Fazer').length}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-green-50 text-green-700 rounded-lg">
            <span className="font-medium">Concluídas</span>
            <span className="text-2xl font-bold">
              {tasks.filter((t) => t.status === 'Concluído').length}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
