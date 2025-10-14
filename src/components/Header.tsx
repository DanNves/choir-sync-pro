import { Search, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { NotificationsPopover } from "@/components/NotificationsPopover"
import { useNavigate } from "react-router-dom"

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      candidato: 'Candidato(a)',
      musico: 'Músico/Organista',
      instrutor: 'Instrutor(a)',
      encarregado_local: 'Encarregado Local',
      encarregado_regional: 'Encarregado Regional',
      examinadora: 'Examinadora',
      cooperador_jovens: 'Cooperador de Jovens',
      cooperador_oficio: 'Cooperador do Ofício',
      anciao: 'Ancião',
      diacono: 'Diácono',
      administrador: 'Administrador'
    }
    return roleNames[role] || role
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-foreground" />
        
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Buscar membros, eventos..." 
            className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <NotificationsPopover />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 h-auto p-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitials(user?.nome || 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-foreground">{user?.nome}</p>
                <p className="text-xs text-muted-foreground">{getRoleDisplayName(user?.papel || '')}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
              <User className="w-4 h-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            {user?.papel === 'administrador' && (
              <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={logout}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}