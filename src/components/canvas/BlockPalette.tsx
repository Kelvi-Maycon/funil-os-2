import {
  Megaphone,
  LayoutTemplate,
  MessageCircle,
  Mail,
  DollarSign,
  HandHeart,
  CheckCircle,
  FileText,
} from 'lucide-react'

const blocks = [
  { type: 'Ad', label: 'Anúncio', icon: Megaphone },
  { type: 'LandingPage', label: 'Landing Page', icon: LayoutTemplate },
  { type: 'WhatsApp', label: 'WhatsApp', icon: MessageCircle },
  { type: 'Email', label: 'Email', icon: Mail },
  { type: 'Checkout', label: 'Checkout', icon: DollarSign },
  { type: 'Upsell', label: 'Upsell', icon: HandHeart },
  { type: 'Obrigado', label: 'Página de Obrigado', icon: CheckCircle },
  { type: 'Form', label: 'Formulário', icon: FileText },
]

export default function BlockPalette() {
  return (
    <div className="w-64 bg-card border-r flex flex-col shrink-0 z-10 shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
          Blocos de Funil
        </h3>
      </div>
      <div className="p-4 flex flex-col gap-2 overflow-y-auto">
        {blocks.map((b) => (
          <div
            key={b.type}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('blockType', b.type)}
            className="flex items-center gap-3 p-3 border rounded-lg cursor-grab hover:bg-accent bg-card transition-colors shadow-sm active:cursor-grabbing"
          >
            <b.icon size={18} className="text-primary" />
            <span className="text-sm font-medium">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
