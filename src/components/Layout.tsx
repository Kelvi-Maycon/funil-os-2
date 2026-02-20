import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Folder,
  Network,
  CheckSquare,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  Bookmark,
  Settings,
} from 'lucide-react'

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
  { title: 'Projetos', icon: Folder, url: '/projetos' },
  { title: 'Canvas', icon: Network, url: '/canvas' },
  { title: 'Tarefas', icon: CheckSquare, url: '/tarefas' },
  { title: 'Documentos', icon: FileText, url: '/documentos' },
  { title: 'Assets', icon: ImageIcon, url: '/assets' },
  { title: 'Insights', icon: Lightbulb, url: '/insights' },
  { title: 'Swipe File', icon: Bookmark, url: '/swipe-file' },
]

export default function Layout() {
  const location = useLocation()
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="h-16 flex items-center px-4 border-b bg-sidebar">
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 tracking-tight">
            Funil OS
          </span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname === item.url ||
                      (item.url !== '/' &&
                        location.pathname.startsWith(item.url))
                    }
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4 flex flex-row items-center gap-3 bg-sidebar">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            JD
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate">João Doe</span>
            <span className="text-xs text-muted-foreground truncate">
              Growth Lead
            </span>
          </div>
          <Settings className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background relative flex flex-col h-screen overflow-hidden">
        <header className="h-14 flex items-center px-4 border-b bg-card md:hidden shrink-0 z-10 shadow-sm">
          <SidebarTrigger />
          <span className="ml-4 font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Funil OS
          </span>
        </header>
        <main className="flex-1 overflow-auto animate-fade-in relative">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
