import useInsightStore from '@/stores/useInsightStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pin, Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function Insights() {
  const [insights] = useInsightStore()

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <Button>
          <Plus size={16} className="mr-2" /> Novo Insight
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input placeholder="Pesquisar insights..." className="pl-10 bg-white" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {insights
          .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
          .map((i) => (
            <Card
              key={i.id}
              className="relative hover:shadow-md transition-shadow group border-border"
            >
              {i.isPinned && (
                <Pin
                  className="absolute top-4 right-4 text-primary fill-primary"
                  size={16}
                />
              )}
              {!i.isPinned && (
                <Pin
                  className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  size={16}
                />
              )}
              <CardHeader className="pb-2 pr-12">
                <div className="flex flex-col gap-2 items-start">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/20 border-none"
                  >
                    {i.type}
                  </Badge>
                  <CardTitle className="text-lg leading-snug">
                    {i.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-4 leading-relaxed">
                  {i.content}
                </p>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Há 2 dias
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {i.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
