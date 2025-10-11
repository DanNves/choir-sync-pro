import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ConditionalRender } from "@/components/ConditionalRender"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  UserCheck, 
  QrCode, 
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  TrendingUp,
  Search
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAttendances } from "@/hooks/useAttendances"
import { useEvents } from "@/hooks/useEvents"
import { useProfiles } from "@/hooks/useProfiles"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const Presencas = () => {
  const { toast } = useToast()
  const { attendances, isLoading: loadingAttendances, createAttendance } = useAttendances()
  const { events, isLoading: loadingEvents } = useEvents()
  const { profiles, isLoading: loadingProfiles } = useProfiles()
  
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedParticipant, setSelectedParticipant] = useState("")
  const [selectedEventId, setSelectedEventId] = useState<string>("")

  // Get current/active event (most recent)
  const eventoAtual = events.length > 0 ? events[0] : null
  
  useEffect(() => {
    if (eventoAtual) {
      setSelectedEventId(eventoAtual.id)
    }
  }, [eventoAtual])

  // Get attendances for selected event
  const presencasRecentes = attendances
    .filter((att: any) => att.event_id === selectedEventId)
    .map((att: any) => ({
      id: att.id,
      nome: att.profiles?.nome || 'N/A',
      horario: att.horario_entrada || format(new Date(att.created_at), 'HH:mm'),
      metodo: "Manual",
      status: att.status,
      instrumento: att.profiles?.instrumento || 'N/A'
    }))

  // Get available participants (profiles not yet checked in)
  const checkedInUserIds = attendances
    .filter((att: any) => att.event_id === selectedEventId)
    .map((att: any) => att.user_id)
  
  const participantesEvento = profiles
    .filter((profile: any) => !checkedInUserIds.includes(profile.id))
    .map((profile: any) => ({
      id: profile.id,
      nome: profile.nome,
      instrumento: profile.instrumento || 'N/A'
    }))

  // Calculate historic events stats
  const historicoEventos = events.slice(1, 4).map((event: any) => {
    const eventAttendances = attendances.filter((att: any) => att.event_id === event.id)
    const presencasCount = eventAttendances.length
    const taxa = event.participantes_esperados > 0 
      ? (presencasCount / event.participantes_esperados) * 100 
      : 0
    
    return {
      id: event.id,
      evento: event.nome,
      data: format(new Date(event.data), 'dd/MM/yyyy', { locale: ptBR }),
      participantes: event.participantes_esperados,
      presencas: presencasCount,
      taxa: Math.round(taxa * 10) / 10
    }
  })

  const getMetodoColor = (metodo: string) => {
    return metodo === 'QR Code' ? 'default' : 'secondary'
  }

  const getTaxaColor = (taxa: number) => {
    if (taxa >= 90) return 'text-success'
    if (taxa >= 80) return 'text-warning'
    return 'text-destructive'
  }

  // Função para realizar check-in manual
  const handleCheckinManual = () => {
    if (!selectedParticipant) {
      toast({
        title: "Erro",
        description: "Selecione um participante para fazer o check-in.",
        variant: "destructive",
      })
      return
    }

    if (!selectedEventId) {
      toast({
        title: "Erro",
        description: "Nenhum evento selecionado.",
        variant: "destructive",
      })
      return
    }

    const participanteSelecionado = participantesEvento.find(p => p.id === selectedParticipant)
    
    if (!participanteSelecionado) {
      toast({
        title: "Erro", 
        description: "Participante não encontrado.",
        variant: "destructive",
      })
      return
    }

    // Create attendance record
    const now = new Date()
    const attendanceData = {
      user_id: selectedParticipant,
      event_id: selectedEventId,
      status: 'Presente',
      horario_entrada: format(now, 'HH:mm:ss')
    }

    createAttendance(attendanceData)

    // Limpar e fechar modal
    setSelectedParticipant("")
    setSearchTerm("")
    setIsCheckinModalOpen(false)
  }

  // Filtrar participantes disponíveis (que ainda não fizeram check-in)
  const participantesDisponiveis = participantesEvento.filter(participante => 
    participante.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loadingAttendances || loadingEvents || loadingProfiles) {
    return (
      <ProtectedRoute resource="presencas">
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando presenças...</p>
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </ProtectedRoute>
    )
  }

  const eventStats = eventoAtual ? {
    titulo: eventoAtual.nome,
    data: format(new Date(eventoAtual.data), 'dd/MM/yyyy', { locale: ptBR }),
    horario: `${eventoAtual.horario} - ${eventoAtual.duracao}min`,
    status: eventoAtual.status,
    participantes: eventoAtual.participantes_esperados,
    presencas: presencasRecentes.length,
    qrCodeAtivo: true
  } : null

  return (
    <ProtectedRoute resource="presencas">
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
                    Controle de Presenças
                  </h1>
                  <p className="text-muted-foreground">
                    Monitore presenças em tempo real e histórico de participação
                  </p>
                </div>
                <ConditionalRender permission="manual_checkin">
                  <Dialog open={isCheckinModalOpen} onOpenChange={setIsCheckinModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <UserCheck className="w-4 h-4" />
                        Check-in Manual
                      </Button>
                    </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Check-in Manual</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="search">Buscar Participante</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="search"
                            placeholder="Digite o nome do participante..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="participant">Selecionar Participante</Label>
                        <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
                          <SelectTrigger>
                            <SelectValue placeholder="Escolha um participante disponível" />
                          </SelectTrigger>
                           <SelectContent>
                            {participantesDisponiveis.length > 0 ? (
                              participantesDisponiveis.map((participante) => (
                                <SelectItem key={participante.id} value={participante.id}>
                                  <div className="flex justify-between items-center w-full">
                                    <span>{participante.nome}</span>
                                    <span className="text-muted-foreground text-sm ml-2">
                                      {participante.instrumento}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                {searchTerm ? "Nenhum participante encontrado" : "Todos já fizeram check-in"}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsCheckinModalOpen(false)
                            setSelectedParticipant("")
                            setSearchTerm("")
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleCheckinManual}>
                          Confirmar Check-in
                        </Button>
                      </div>
                    </div>
                    </DialogContent>
                  </Dialog>
                </ConditionalRender>
              </div>

              {/* Evento Atual */}
              {eventStats ? (
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Evento em Andamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{eventStats.titulo}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {eventStats.data} • {eventStats.horario}
                          </p>
                          <p className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {eventStats.presencas}/{eventStats.participantes} participantes
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Taxa de Presença</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-foreground">
                              {eventStats.participantes > 0 ? Math.round((eventStats.presencas / eventStats.participantes) * 100) : 0}%
                            </span>
                            <Badge variant="default" className="gap-1">
                              <TrendingUp className="w-3 h-3" />
                              +5.2%
                            </Badge>
                          </div>
                          <Progress 
                            value={eventStats.participantes > 0 ? (eventStats.presencas / eventStats.participantes) * 100 : 0} 
                            className="h-2"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        {eventStats.qrCodeAtivo ? (
                          <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <QrCode className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-sm font-medium text-foreground">QR Code Ativo</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Renovar QR
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="w-16 h-16 bg-muted/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <XCircle className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">Check-in Fechado</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Nenhum evento ativo no momento.</p>
                  </CardContent>
                </Card>
              )}

              {/* Tabs */}
              <Tabs defaultValue="tempo-real" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                  <TabsTrigger value="tempo-real">Tempo Real</TabsTrigger>
                  <TabsTrigger value="historico">Histórico</TabsTrigger>
                </TabsList>

                <TabsContent value="tempo-real" className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-success" />
                          </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Presentes</p>
                          <p className="text-2xl font-bold text-foreground">{presencasRecentes.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-warning" />
                          </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ausentes</p>
                          <p className="text-2xl font-bold text-foreground">{eventStats ? eventStats.participantes - presencasRecentes.length : 0}</p>
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
                          <p className="text-sm text-muted-foreground">Via QR Code</p>
                          <p className="text-2xl font-bold text-foreground">{presencasRecentes.filter(p => p.metodo === 'QR Code').length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Presenças Recentes */}
                  <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader>
                      <CardTitle>Presenças Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Instrumento</TableHead>
                            <TableHead>Horário</TableHead>
                            <TableHead>Método</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {presencasRecentes.map((presenca) => (
                            <TableRow key={presenca.id}>
                              <TableCell className="font-medium text-foreground">
                                {presenca.nome}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {presenca.instrumento}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {presenca.horario}
                              </TableCell>
                              <TableCell>
                                <Badge variant={getMetodoColor(presenca.metodo)}>
                                  {presenca.metodo}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-success" />
                                  <span className="text-success">{presenca.status}</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="historico" className="space-y-6">
                  <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader>
                      <CardTitle>Histórico de Eventos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Evento</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Participantes</TableHead>
                            <TableHead>Presenças</TableHead>
                            <TableHead>Taxa</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {historicoEventos.map((evento) => (
                            <TableRow key={evento.id}>
                              <TableCell className="font-medium text-foreground">
                                {evento.evento}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {evento.data}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {evento.participantes}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {evento.presencas}
                              </TableCell>
                              <TableCell>
                                <span className={`font-medium ${getTaxaColor(evento.taxa)}`}>
                                  {evento.taxa}%
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Presencas;