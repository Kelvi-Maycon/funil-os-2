import { useParams, useNavigate } from 'react-router-dom'
import useFunnelStore from '@/stores/useFunnelStore'
import CanvasBoard from '@/components/canvas/CanvasBoard'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Canvas() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [funnels, setFunnels] = useFunnelStore()
  const { toast } = useToast()

  const funnel = funnels.find((f) => f.id === id)

  if (!funnel)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Funil não encontrado.
      </div>
    )

  const updateFunnel = (updated: any) => {
    setFunnels((prev) => prev.map((f) => (f.id === id ? updated : f)))
  }

  return (
    <div className="h-full flex flex-col overflow-hidden animate-fade-in">
      <div className="h-14 border-b bg-card flex items-center justify-between px-4 shrink-0 shadow-sm z-20 relative">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} className="mr-2" /> Voltar
          </Button>
          <div className="h-4 w-px bg-border"></div>
          <h2 className="font-semibold text-sm">{funnel.name}</h2>
        </div>
        <Button
          size="sm"
          onClick={() => toast({ title: 'Funil salvo com sucesso!' })}
        >
          <Save size={16} className="mr-2" /> Salvar
        </Button>
      </div>
      <div className="flex-1 relative flex overflow-hidden">
        <CanvasBoard funnel={funnel} onChange={updateFunnel} />
      </div>
    </div>
  )
}
