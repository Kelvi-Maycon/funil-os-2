import { createStore } from './main'
import { Task } from '@/types'

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Revisar Copy da Landing Page',
    projectId: 'p1',
    priority: 'Alta',
    status: 'A Fazer',
    deadline: new Date().toISOString(),
  },
  {
    id: 't2',
    title: 'Aprovar Criativos',
    projectId: 'p1',
    priority: 'Média',
    status: 'Em Progresso',
    deadline: new Date().toISOString(),
  },
  {
    id: 't3',
    title: 'Configurar Pixel',
    projectId: 'p2',
    priority: 'Alta',
    status: 'Em Revisão',
    deadline: new Date().toISOString(),
  },
  {
    id: 't4',
    title: 'Disparar Email 1',
    projectId: 'p1',
    priority: 'Baixa',
    status: 'Concluído',
    deadline: new Date().toISOString(),
  },
  {
    id: 't5',
    title: 'Analisar Métricas da Semana',
    projectId: 'p2',
    priority: 'Média',
    status: 'A Fazer',
    deadline: new Date().toISOString(),
  },
]

export default createStore<Task[]>('funilos_tasks', mockTasks)
