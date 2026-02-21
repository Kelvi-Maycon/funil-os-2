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
  Zap,
  ChevronsLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import QuickActionModal from '@/components/QuickActionModal'

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
      <Sidebar className="border-r-0 gradient-sidebar z-30">
        <SidebarHeader className="h-20 flex flex-row items-center px-5 pt-5">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105">
              <Zap size={20} className="fill-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Funil OS
            </span>
            <div className="flex-1" />
            <SidebarTrigger className="h-8 w-8 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 bg-transparent shrink-0 transition-colors">
              <ChevronsLeft size={18} />
            </SidebarTrigger>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 pt-6">
          <SidebarGroup>
            <div className="mb-3 px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
              Menu
            </div>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  (item.url !== '/' && location.pathname.startsWith(item.url))
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        'rounded-xl h-10 px-3 transition-all duration-200 group/item',
                        isActive
                          ? 'bg-white/10 text-white font-medium shadow-sm'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
                      )}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                            isActive
                              ? 'gradient-primary shadow-md shadow-indigo-500/20'
                              : 'bg-transparent group-hover/item:bg-white/5',
                          )}
                        >
                          <item.icon
                            size={16}
                            strokeWidth={isActive ? 2.5 : 2}
                            className={cn(
                              isActive
                                ? 'text-white'
                                : 'text-slate-400 group-hover/item:text-slate-300',
                            )}
                          />
                        </div>
                        <span className="text-[14px]">{item.title}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 pb-5">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-row items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20">
              KM
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <span className="text-xs font-medium text-slate-300 truncate">
                Kelvi Maycon
              </span>
              <span className="text-[10px] text-slate-500 truncate">
                info@mail.com
              </span>
            </div>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <Settings size={13} />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-background relative flex flex-col h-screen overflow-hidden">
        <header className="h-14 flex items-center px-4 border-b bg-white md:hidden shrink-0 z-10 shadow-sm">
          <SidebarTrigger />
          <span className="ml-3 font-bold text-lg gradient-text">
            Funil OS
          </span>
        </header>
        <main className="flex-1 overflow-auto custom-scrollbar animate-fade-in relative pt-2 md:pt-0">
          <Outlet />
        </main>
      </SidebarInset>
      <QuickActionModal />
    </SidebarProvider>
  )
}
