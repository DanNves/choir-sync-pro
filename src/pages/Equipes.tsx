import React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Music, 
  Users, 
  Plus,
  Crown,
  Star,
  TrendingUp,
  MoreHorizontal,
  Edit,
  UserPlus,
  Settings
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Equipes = () => {
  const equipes = [
    {
      id: 1,
      nome: "Coral Juvenil",
      lider: "João Silva",
      membros: 45,
      instrumentos: ["Vocal", "Piano", "Violão"],
      desempenho: 92.5,
      status: "Ativa",
      ultimoEnsaio: "Hoje, 19:00",
      proximoEvento: "Apresentação - Dom, 14:00"
    },
    {
      id: 2,
      nome: "Banda de Instrumentistas", 
      lider: "Maria Santos",
      membros: 23,
      instrumentos: ["Bateria", "Baixo", "Guitarra", "Teclado"],
      desempenho: 89.2,
      status: "Ativa", 
      ultimoEnsaio: "Ontem, 20:00",
      proximoEvento: "Ensaio - Qua, 19:30"
    },
    {
      id: 3,
      nome: "Coral Adulto",
      lider: "Pedro Costa",
      membros: 67,
      instrumentos: ["Vocal", "Órgão"],
      desempenho: 95.8,
      status: "Ativa",
      ultimoEnsaio: "Ter, 19:00", 
      proximoEvento: "Reunião - Sex, 20:00"
    },
    {
      id: 4,
      nome: "Orquestra Regional",
      lider: "Ana Oliveira",
      membros: 34,
      instrumentos: ["Violino", "Viola", "Violoncelo", "Flauta"],
      desempenho: 87.4,
      status: "Ativa",
      ultimoEnsaio: "Sab, 15:00",
      proximoEvento: "Avaliação - Dom, 16:00"
    }
  ]

  const membrosDestaque = [
    {
      id: 1,
      nome: "João Silva",
      equipe: "Coral Juvenil", 
      papel: "Líder",
      instrumento: "Vocal/Piano",
      presenca: 98.5,
      pontuacao: 2450
    },
    {
      id: 2,
      nome: "Maria Santos",
      equipe: "Banda de Instrumentistas",
      papel: "Líder", 
      instrumento: "Órgão",
      presenca: 97.2,
      pontuacao: 2380
    },
    {
      id: 3,
      nome: "Carlos Lima",
      equipe: "Coral Adulto",
      papel: "Membro",
      instrumento: "Vocal",
      presenca: 96.8,
      pontuacao: 2290
    }
  ]

  const getDesempenhoColor = (desempenho: number) => {
    if (desempenho >= 95) return 'text-success'
    if (desempenho >= 90) return 'text-primary'
    if (desempenho >= 85) return 'text-warning'
    return 'text-destructive'
  }

  const getPapelIcon = (papel: string) => {
    return papel === 'Líder' ? Crown : Star
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Gerenciamento de Equipes
                  </h1>
                  <p className="text-muted-foreground">
                    Organize grupos musicais e acompanhe o desempenho das equipes
                  </p>
                </div>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Nova Equipe
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Equipes Ativas</p>
                        <p className="text-2xl font-bold text-foreground">4</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Membros</p>
                        <p className="text-2xl font-bold text-foreground">169</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-warning" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Desempenho Médio</p>
                        <p className="text-2xl font-bold text-foreground">91.2%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Crown className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Líderes</p>
                        <p className="text-2xl font-bold text-foreground">4</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Teams Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {equipes.map((equipe) => (
                  <Card key={equipe.id} className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{equipe.nome}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">
                              {equipe.status}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              <Users className="w-3 h-3" />
                              {equipe.membros} membros
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" />
                              Editar Equipe
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <UserPlus className="w-4 h-4" />
                              Adicionar Membro
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Settings className="w-4 h-4" />
                              Configurações
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Líder</p>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {equipe.lider.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">{equipe.lider}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Instrumentos</p>
                          <div className="flex flex-wrap gap-1">
                            {equipe.instrumentos.map((instrumento) => (
                              <Badge key={instrumento} variant="outline" className="text-xs">
                                {instrumento}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-muted-foreground">Desempenho</span>
                            <span className={`text-sm font-medium ${getDesempenhoColor(equipe.desempenho)}`}>
                              {equipe.desempenho}%
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border/50 space-y-1">
                          <p className="text-xs text-muted-foreground">
                            <strong>Último ensaio:</strong> {equipe.ultimoEnsaio}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <strong>Próximo evento:</strong> {equipe.proximoEvento}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Top Members */}
              <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Membros em Destaque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {membrosDestaque.map((membro, index) => (
                      <div key={membro.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                              #{index + 1}
                            </div>
                            <Avatar>
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {membro.nome.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground">{membro.nome}</h4>
                              <div className="flex items-center gap-1">
                                {React.createElement(getPapelIcon(membro.papel), {
                                  className: "w-4 h-4 text-accent"
                                })}
                                <Badge variant="secondary" className="text-xs">
                                  {membro.papel}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {membro.equipe} • {membro.instrumento}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{membro.pontuacao} pts</p>
                          <p className="text-sm text-muted-foreground">
                            {membro.presenca}% presença
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Equipes;