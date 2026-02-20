import { useState } from 'react'
import useAssetStore from '@/stores/useAssetStore'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Image as ImageIcon } from 'lucide-react'

export default function Assets() {
  const [assets] = useAssetStore()
  const [search, setSearch] = useState('')

  const filtered = assets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
        <Button>
          <Plus className="mr-2" size={16} /> Novo Asset
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            className="pl-10 bg-white"
            placeholder="Buscar assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <ImageIcon size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Nenhum asset encontrado.</h3>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((asset) => (
            <Card
              key={asset.id}
              className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer border-border"
            >
              <div className="aspect-square bg-muted relative">
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <Button variant="secondary" size="sm">
                    Visualizar
                  </Button>
                </div>
              </div>
              <CardContent className="p-3 bg-card">
                <h3 className="font-medium text-sm truncate text-card-foreground">
                  {asset.name}
                </h3>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {asset.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
