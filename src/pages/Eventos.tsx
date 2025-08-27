import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
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
  Trash2,
  X
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Eventos = () => {
  const { toast } = useToast()
  const [eventos, setEventos] = useState([
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
  ])

  const [selectedEvento, setSelectedEvento] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isQrOpen, setIsQrOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    titulo: '',
    tipo: '',
    data: '',
    horario: '',
    local: '',
    participantes: '',
    status: ''
  })

  // Cálculos dinâmicos para estatísticas
  const totalEventos = eventos.length
  const eventosAtivos = eventos.filter(e => e.status === 'Aberto' || e.status === 'Agendado').length
  const eventosPendentes = eventos.filter(e => e.status === 'Agendado').length
  const eventosFinalizados = eventos.filter(e => e.status === 'Finalizado').length
  const totalParticipantes = eventos.reduce((sum, e) => sum + e.participantes, 0)
  const eventosComQR = eventos.filter(e => e.qrCode).length

  const handleViewDetails = (evento) => {
    setSelectedEvento(evento)
    setIsDetailOpen(true)
  }

  const handleEdit = (evento) => {
    setSelectedEvento(evento)
    setEditForm({
      titulo: evento.titulo,
      tipo: evento.tipo,
      data: evento.data,
      horario: evento.horario,
      local: evento.local,
      participantes: evento.participantes.toString(),
      status: evento.status
    })
    setIsEditOpen(true)
  }

  const handleSaveEdit = () => {
    const updatedEventos = eventos.map(evento => 
      evento.id === selectedEvento.id 
        ? {
            ...evento,
            titulo: editForm.titulo,
            tipo: editForm.tipo,
            data: editForm.data,
            horario: editForm.horario,
            local: editForm.local,
            participantes: parseInt(editForm.participantes),
            status: editForm.status
          }
        : evento
    )
    setEventos(updatedEventos)
    setIsEditOpen(false)
    toast({
      title: "Evento atualizado",
      description: "As informações do evento foram atualizadas com sucesso."
    })
  }

  const handleDelete = (eventoId) => {
    const updatedEventos = eventos.filter(evento => evento.id !== eventoId)
    setEventos(updatedEventos)
    toast({
      title: "Evento cancelado",
      description: "O evento foi cancelado com sucesso.",
      variant: "destructive"
    })
  }

  const handleGenerateQR = (evento) => {
    setSelectedEvento(evento)
    setIsQrOpen(true)
  }

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
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-foreground">{totalEventos}</p>
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
                        <p className="text-sm text-muted-foreground">Ativos</p>
                        <p className="text-2xl font-bold text-foreground">{eventosAtivos}</p>
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
                        <p className="text-2xl font-bold text-foreground">{totalParticipantes}</p>
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
                        <p className="text-2xl font-bold text-foreground">{eventosComQR}</p>
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
                        <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2" onClick={() => handleViewDetails(evento)}>
                                <Eye className="w-4 h-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => handleEdit(evento)}>
                                <Edit className="w-4 h-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => handleGenerateQR(evento)}>
                                <QrCode className="w-4 h-4" />
                                Gerar QR Code
                              </DropdownMenuItem>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="gap-2 text-destructive" onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="w-4 h-4" />
                                  Cancelar
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancelar Evento</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja cancelar este evento? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Voltar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(evento.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Confirmar Cancelamento
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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

              {/* Modal de Detalhes */}
              <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Detalhes do Evento</DialogTitle>
                  </DialogHeader>
                  {selectedEvento && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Título</Label>
                          <p className="text-lg font-semibold">{selectedEvento.titulo}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                          <Badge variant={getTipoColor(selectedEvento.tipo)} className="mt-1">
                            {selectedEvento.tipo}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Data</Label>
                          <p>{selectedEvento.data}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Horário</Label>
                          <p>{selectedEvento.horario}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Local</Label>
                        <p>{selectedEvento.local}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                          <Badge variant={getStatusColor(selectedEvento.status)} className="mt-1">
                            {selectedEvento.status}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Participantes</Label>
                          <p>{selectedEvento.participantes}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Presenças</Label>
                          <p>{selectedEvento.presencas}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Taxa de Presença</Label>
                        <p className="text-lg font-semibold">
                          {selectedEvento.participantes > 0 
                            ? `${Math.round((selectedEvento.presencas / selectedEvento.participantes) * 100)}%`
                            : '0%'
                          }
                        </p>
                      </div>

                      {selectedEvento.qrCode && (
                        <div className="p-4 bg-success/10 rounded-lg">
                          <div className="flex items-center gap-2 text-success">
                            <QrCode className="w-5 h-5" />
                            <span className="font-medium">Check-in por QR Code disponível</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Modal de Edição */}
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Editar Evento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="titulo">Título do Evento</Label>
                      <Input
                        id="titulo"
                        value={editForm.titulo}
                        onChange={(e) => setEditForm({...editForm, titulo: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tipo">Tipo</Label>
                        <Select value={editForm.tipo} onValueChange={(value) => setEditForm({...editForm, tipo: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ensaio">Ensaio</SelectItem>
                            <SelectItem value="Reunião">Reunião</SelectItem>
                            <SelectItem value="Avaliação">Avaliação</SelectItem>
                            <SelectItem value="Encontro">Encontro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Aberto">Aberto</SelectItem>
                            <SelectItem value="Agendado">Agendado</SelectItem>
                            <SelectItem value="Finalizado">Finalizado</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="data">Data</Label>
                        <Input
                          id="data"
                          type="date"
                          value={editForm.data}
                          onChange={(e) => setEditForm({...editForm, data: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="horario">Horário</Label>
                        <Input
                          id="horario"
                          placeholder="ex: 19:00 - 21:00"
                          value={editForm.horario}
                          onChange={(e) => setEditForm({...editForm, horario: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="local">Local</Label>
                      <Input
                        id="local"
                        value={editForm.local}
                        onChange={(e) => setEditForm({...editForm, local: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="participantes">Limite de Participantes</Label>
                      <Input
                        id="participantes"
                        type="number"
                        value={editForm.participantes}
                        onChange={(e) => setEditForm({...editForm, participantes: e.target.value})}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveEdit}>
                        Salvar Alterações
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Modal QR Code */}
              <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>QR Code - Check-in</DialogTitle>
                  </DialogHeader>
                  {selectedEvento && (
                    <div className="space-y-4 text-center">
                      <div className="bg-white p-8 rounded-lg inline-block">
                        <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                          <QrCode className="w-16 h-16" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{selectedEvento.titulo}</h3>
                        <p className="text-muted-foreground">{selectedEvento.data} - {selectedEvento.horario}</p>
                        <p className="text-sm text-muted-foreground">{selectedEvento.local}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Escaneie este código para fazer check-in no evento
                      </p>
                      <Button 
                        onClick={() => {
                          toast({
                            title: "QR Code gerado",
                            description: "O QR Code foi gerado e está pronto para uso."
                          })
                        }}
                        className="w-full"
                      >
                        Baixar QR Code
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Eventos;