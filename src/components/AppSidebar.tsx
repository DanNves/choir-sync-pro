import { 
  Calendar, 
  Users, 
  Music, 
  ClipboardList, 
  Trophy, 
  BarChart3, 
  Settings, 
  Home,
  CheckCircle,
  UserCheck
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Usuários", url: "/usuarios", icon: Users },
  { title: "Eventos", url: "/eventos", icon: Calendar },
  { title: "Presenças", url: "/presencas", icon: UserCheck },
  { title: "Equipes", url: "/equipes", icon: Music },
  { title: "Questionários", url: "/questionarios", icon: ClipboardList },
  { title: "Ranking", url: "/ranking", icon: Trophy },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
]

const adminItems = [
  { title: "Configurações", url: "/configuracoes", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isCollapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  const getNavClass = (path: string) => 
    isActive(path) 
      ? "bg-sidebar-accent text-sidebar-primary font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Logo/Brand */}
        <div className="p-6 border-b border-sidebar-border">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">Choir Sync</h2>
                <p className="text-xs text-sidebar-foreground/60">Gestão Musical</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium">
            {!isCollapsed && "Menu Principal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className={`w-4 h-4 ${!isCollapsed ? "mr-3" : ""}`} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium">
            {!isCollapsed && "Administração"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className={`w-4 h-4 ${!isCollapsed ? "mr-3" : ""}`} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}