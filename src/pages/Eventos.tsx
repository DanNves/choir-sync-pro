import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  CalendarPlus, 
  Clock, 
  MapPin,
  Users,
  QrCode,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Eventos = () => {
  const eventos = [
    {
      id: 1,
      titulo: "Ensaio Coral Juvenil",
      tipo: "Ensaio",
      data: "2024-01-20",
      horario: "19:00 - 21:00",
      local: "São Paulo - Central",
      participantes: 45,
      status: "Aberto",
      presencas: 38,
      qrCode: true
    },
    {
      id: 2,
      titulo: "Reunião de Instrumentistas", 
      tipo: "Reunião",
      data: "2024-01-21",
      horario: "20:00 - 22:00",
      local: "São Paulo - Central",
      participantes: 23,
      status: "Agendado",
      presencas: 0,
      qrCode: false
    },
    {
      id: 3,
      titulo: "Avaliação Técnica Mensal",
      tipo: "Avaliação",
      data: "2024-01-25",
      horario: "14:00 - 17:00", 
      local: "Rio de Janeiro - Norte",
      participantes: 67,
      status: "Agendado",
      presencas: 0,
      qrCode: false
    },
    {
      id: 4,
      titulo: "Encontro Regional de Músicos",
      tipo: "Encontro",
      data: "2024-01-15",
      horario: "09:00 - 18:00",
      local: "São Paulo - Regional",
      participantes: 156,
      status: "Finalizado",
      presencas: 142,
      qrCode: true
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aberto': return 'default'
      case 'Agendado': return 'secondary' 
      case 'Finalizado': return 'outline'
      case 'Cancelado': return 'destructive'
      default: return 'secondary'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Ensaio': return 'default'
      case 'Reunião': return 'secondary'
      case 'Avaliação': return 'destructive'
      case 'Encontro': return 'outline'
      default: return 'outline'
    }
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
                    Gerenciamento de Eventos
                  </h1>
                  <p className="text-muted-foreground">
                    Organize ensaios, reuniões e encontros musicais
                  </p>
                </div>
                <Button className="gap-2">
                  <CalendarPlus className="w-4 h-4" />
                  Novo Evento
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Este Mês</p>
                        <p className="text-2xl font-bold text-foreground">18</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Em Andamento</p>
                        <p className="text-2xl font-bold text-foreground">3</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-warning" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Participantes</p>
                        <p className="text-2xl font-bold text-foreground">291</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <QrCode className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Com QR Code</p>
                        <p className="text-2xl font-bold text-foreground">12</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {eventos.map((evento) => (
                  <Card key={evento.id} className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{evento.titulo}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant={getTipoColor(evento.tipo)}>
                              {evento.tipo}
                            </Badge>
                            <Badge variant={getStatusColor(evento.status)}>
                              {evento.status}
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
                              <Eye className="w-4 h-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" />
                              Editar
                            </DropdownMenuItem>
                            {evento.qrCode && (
                              <DropdownMenuItem className="gap-2">
                                <QrCode className="w-4 h-4" />
                                Gerar QR Code
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <Trash2 className="w-4 h-4" />
                              Cancelar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{evento.data}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{evento.horario}</span>
                        </div>

                        <div className="flex items-center gap-3 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{evento.local}</span>
                        </div>

                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {evento.presencas}/{evento.participantes} participantes
                          </span>
                        </div>

                        {evento.qrCode && (
                          <div className="flex items-center gap-3 text-success">
                            <QrCode className="w-4 h-4" />
                            <span className="text-sm">Check-in por QR Code disponível</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-border/50">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Taxa de Presença:</span>
                            <span className="font-medium text-foreground">
                              {evento.participantes > 0 
                                ? `${Math.round((evento.presencas / evento.participantes) * 100)}%`
                                : '0%'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Eventos;