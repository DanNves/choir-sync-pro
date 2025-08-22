import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
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
  TrendingUp
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

const Presencas = () => {
  const eventoAtual = {
    titulo: "Ensaio Coral Juvenil",
    data: "2024-01-20",
    horario: "19:00 - 21:00",
    status: "Em Andamento",
    participantes: 45,
    presencas: 38,
    qrCodeAtivo: true
  }

  const presencasRecentes = [
    {
      id: 1,
      nome: "João Silva",
      horario: "19:15",
      metodo: "QR Code",
      status: "Presente",
      instrumento: "Violão"
    },
    {
      id: 2,
      nome: "Maria Santos", 
      horario: "19:12",
      metodo: "QR Code",
      status: "Presente",
      instrumento: "Órgão"
    },
    {
      id: 3,
      nome: "Pedro Costa",
      horario: "19:18",
      metodo: "Manual",
      status: "Presente",
      instrumento: "Bateria"
    },
    {
      id: 4,
      nome: "Ana Oliveira",
      horario: "19:05",
      metodo: "QR Code", 
      status: "Presente",
      instrumento: "Piano"
    }
  ]

  const historicoEventos = [
    {
      id: 1,
      evento: "Reunião de Instrumentistas",
      data: "2024-01-19",
      participantes: 23,
      presencas: 21,
      taxa: 91.3
    },
    {
      id: 2,
      evento: "Ensaio Coral Adulto",
      data: "2024-01-18", 
      participantes: 67,
      presencas: 58,
      taxa: 86.6
    },
    {
      id: 3,
      evento: "Avaliação Técnica",
      data: "2024-01-15",
      participantes: 34,
      presencas: 32,
      taxa: 94.1
    }
  ]

  const getMetodoColor = (metodo: string) => {
    return metodo === 'QR Code' ? 'default' : 'secondary'
  }

  const getTaxaColor = (taxa: number) => {
    if (taxa >= 90) return 'text-success'
    if (taxa >= 80) return 'text-warning'
    return 'text-destructive'
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
                    Controle de Presenças
                  </h1>
                  <p className="text-muted-foreground">
                    Monitore presenças em tempo real e histórico de participação
                  </p>
                </div>
                <Button className="gap-2">
                  <UserCheck className="w-4 h-4" />
                  Check-in Manual
                </Button>
              </div>

              {/* Evento Atual */}
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
                      <h3 className="font-semibold text-foreground mb-2">{eventoAtual.titulo}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {eventoAtual.data} • {eventoAtual.horario}
                        </p>
                        <p className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {eventoAtual.presencas}/{eventoAtual.participantes} participantes
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Taxa de Presença</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-foreground">
                            {Math.round((eventoAtual.presencas / eventoAtual.participantes) * 100)}%
                          </span>
                          <Badge variant="default" className="gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +5.2%
                          </Badge>
                        </div>
                        <Progress 
                          value={(eventoAtual.presencas / eventoAtual.participantes) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      {eventoAtual.qrCodeAtivo ? (
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
                            <p className="text-2xl font-bold text-foreground">38</p>
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
                            <p className="text-2xl font-bold text-foreground">7</p>
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
                            <p className="text-2xl font-bold text-foreground">35</p>
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
  );
};

export default Presencas;