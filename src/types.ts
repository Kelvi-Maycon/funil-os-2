export type Project = {
  id: string
  name: string
  description: string
  status: 'Ativo' | 'Pausado' | 'Concluído'
  createdAt: string
}
export type NodeData = {
  name: string
  status: string
  notes?: string
  subtitle?: string
}
export type Node = {
  id: string
  type: string
  x: number
  y: number
  data: NodeData
}
export type Edge = { id: string; source: string; target: string }
export type Funnel = {
  id: string
  projectId: string
  name: string
  status: 'Rascunho' | 'Ativo' | 'Pausado' | 'Concluído'
  createdAt: string
  nodes: Node[]
  edges: Edge[]
}
export type Task = {
  id: string
  title: string
  projectId: string
  funnelId?: string
  blockId?: string
  priority: 'Baixa' | 'Média' | 'Alta'
  status: 'A Fazer' | 'Em Progresso' | 'Em Revisão' | 'Concluído'
  deadline: string
}
export type Document = {
  id: string
  projectId: string
  title: string
  content: string
  updatedAt: string
}
export type Asset = {
  id: string
  projectId: string
  name: string
  url: string
  type: 'image' | 'pdf' | 'link'
  category: string
  tags: string[]
}
export type Insight = {
  id: string
  title: string
  content: string
  type: string
  status: 'Rascunho' | 'Salvo' | 'Aplicado' | 'Descartado'
  createdAt: string
  isPinned: boolean
}
export type Swipe = {
  id: string
  title: string
  imageUrl: string
  category: string
  isFavorite: boolean
  notes: string
}
