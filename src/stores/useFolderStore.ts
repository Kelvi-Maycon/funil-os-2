import { createStore } from './main'
import { Folder } from '@/types'

export const mockFolders: Folder[] = [
  {
    id: 'f1',
    projectId: 'p1',
    name: 'Planejamento',
    parentId: null,
    createdAt: new Date().toISOString(),
    isExpanded: true,
  },
  {
    id: 'f2',
    projectId: 'p1',
    name: 'Pesquisas',
    parentId: 'f1',
    createdAt: new Date().toISOString(),
    isExpanded: true,
  },
]

export default createStore<Folder[]>('funilos_folders', mockFolders)
