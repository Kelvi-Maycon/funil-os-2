import useSwipeStore from '@/stores/useSwipeStore'
import { Star, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SwipeFile() {
  const [swipes] = useSwipeStore()

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Swipe File</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter size={16} className="mr-2" /> Filtrar
          </Button>
          <Button>Salvar Inspiração</Button>
        </div>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 pt-4">
        {swipes.map((s) => (
          <div
            key={s.id}
            className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm border border-border bg-card cursor-pointer"
          >
            <img
              src={s.imageUrl}
              alt={s.title}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <h3 className="text-white font-medium">{s.title}</h3>
              <p className="text-white/80 text-sm">{s.category}</p>
            </div>
            {s.isFavorite && (
              <Star
                className="absolute top-3 right-3 text-yellow-400 fill-yellow-400 drop-shadow-md z-10"
                size={20}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
