import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Download,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Filter,
  Eye,
  CalendarIcon,
  X
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAttendances } from "@/hooks/useAttendances"
import { useEvents } from "@/hooks/useEvents"
import { useProfiles } from "@/hooks/useProfiles"
import { useQuestionnaires } from "@/hooks/useQuestionnaires"

const Relatorios = () => {
  const { toast } = useToast()
  const { attendances } = useAttendances()
  const { events } = useEvents()
  const { profiles } = useProfiles()
  const { questionnaires } = useQuestionnaires()
  
  // Filters state
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")
  const [filtroEquipe, setFiltroEquipe] = useState<string>("todas")
  const [filtroDataInicio, setFiltroDataInicio] = useState<Date>()
  const [filtroDataFim, setFiltroDataFim] = useState<Date>()
  const [filtroEvento, setFiltroEvento] = useState<string>("todos")
  const [showFilterDialog, setShowFilterDialog] = useState(false)

  // Export states
  const [exportPeriodo, setExportPeriodo] = useState("mes")
  const [exportTipo, setExportTipo] = useState("individual")
  const [exportAvaliacao, setExportAvaliacao] = useState("completo")
  const [isExporting, setIsExporting] = useState(false)
  // Calculate metrics from real data
  const metricas = useMemo(() => {
    const totalPresencas = attendances.length
    const presencasConfirmadas = attendances.filter(a => a.status === 'Presente').length
    const taxaPresenca = totalPresencas > 0 ? (presencasConfirmadas / totalPresencas) * 100 : 0

    const eventosRealizados = events.filter(e => {
      const eventDate = new Date(e.data)
      const now = new Date()
      return eventDate < now
    }).length

    const questionariosAtivos = questionnaires.length

    return [
      {
        titulo: "Taxa de Presença Média",
        valor: `${taxaPresenca.toFixed(1)}%`,
        mudanca: "+0%",
        tipo: "positivo",
        icone: Users,
        descricao: "Baseado nos registros"
      },
      {
        titulo: "Eventos Realizados",
        valor: eventosRealizados.toString(),
        mudanca: "+0",
        tipo: "positivo", 
        icone: Calendar,
        descricao: "Total de eventos"
      },
      {
        titulo: "Questionários Aplicados",
        valor: questionariosAtivos.toString(),
        mudanca: "+0",
        tipo: "positivo",
        icone: FileText,
        descricao: "Total de questionários"
      },
      {
        titulo: "Participantes Cadastrados",
        valor: profiles.length.toString(),
        mudanca: "+0",
        tipo: "positivo",
        icone: TrendingUp,
        descricao: "Total de usuários"
      }
    ]
  }, [attendances, events, questionnaires, profiles])

  const estatisticasRapidas = useMemo(() => {
    const hoje = new Date().toISOString().split('T')[0]
    const presencaHoje = attendances.filter(a => {
      const attendanceDate = new Date(a.created_at).toISOString().split('T')[0]
      return attendanceDate === hoje
    }).length

    const eventosAtivos = events.filter(e => {
      const eventDate = new Date(e.data)
      const now = new Date()
      return eventDate >= now
    }).length

    return {
      totalParticipantes: profiles.length,
      eventosAtivos,
      presencaHoje,
      avaliacoesPendentes: questionnaires.length,
      equipesAtivas: 0, // TODO: Count from teams table
      mediaGeralNotas: 0 // TODO: Calculate from responses
    }
  }, [attendances, events, profiles, questionnaires])

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Presença': return 'default'
      case 'Performance': return 'secondary'
      case 'Avaliações': return 'outline'
      case 'Ranking': return 'destructive'
      default: return 'outline'
    }
  }

  const getMudancaColor = (tipo: string) => {
    return tipo === 'positivo' ? 'text-success' : 'text-destructive'
  }

  // Mock data for filters
  const equipesDisponiveis = [
    { id: "todas", nome: "Todas as Equipes" },
    { id: "soprano", nome: "Soprano" },
    { id: "contralto", nome: "Contralto" },
    { id: "tenor", nome: "Tenor" },
    { id: "baixo", nome: "Baixo" }
  ]

  const eventosDisponiveis = [
    { id: "todos", nome: "Todos os Eventos" },
    { id: "ensaio1", nome: "Ensaio - 12/01" },
    { id: "ensaio2", nome: "Ensaio - 15/01" },
    { id: "reuniao1", nome: "Reunião - 20/01" },
    { id: "apresentacao1", nome: "Apresentação - 25/01" }
  ]

  const relatoriosDisponiveis: any[] = []

  // Export functions
  const handleExportPresencas = async () => {
    if (isExporting) return
    
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate export
      
      const blob = new Blob(['Mock PDF content for presencas'], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `relatorio-presencas-${exportPeriodo}-${format(new Date(), 'yyyy-MM-dd')}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Relatório exportado com sucesso",
        description: "O arquivo foi baixado para seu dispositivo."
      })
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o relatório. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportDesempenho = async () => {
    if (isExporting) return
    
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock Excel content
      const mockData = `Relatório de Desempenho - ${exportTipo}\nGerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}\n\nNome,Equipe,Presença,Avaliação,Pontuação\nJoão Silva,Tenor,95%,8.5,92.3\nMaria Santos,Soprano,88%,9.2,89.7`
      
      const blob = new Blob([mockData], { type: 'application/vnd.ms-excel' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `analise-desempenho-${exportTipo}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Análise exportada com sucesso",
        description: "O arquivo Excel foi baixado para seu dispositivo."
      })
    } catch (error) {
      toast({
        title: "Erro na exportação", 
        description: "Não foi possível exportar a análise. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportAvaliacoes = async () => {
    if (isExporting) return
    
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const blob = new Blob(['Mock PDF content for questionários'], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `questionarios-avaliacoes-${exportAvaliacao}-${format(new Date(), 'yyyy-MM-dd')}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Avaliações exportadas com sucesso",
        description: "O relatório de questionários foi baixado."
      })
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar as avaliações. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleViewReport = (relatorio: any) => {
    toast({
      title: "Visualizando relatório",
      description: `Abrindo ${relatorio.titulo}...`
    })
  }

  const handleDownloadReport = (relatorio: any) => {
    const blob = new Blob(['Mock file content'], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = `${relatorio.titulo.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.${relatorio.formato.toLowerCase()}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Download iniciado",
      description: `Baixando ${relatorio.titulo}...`
    })
  }

  const clearFilters = () => {
    setFiltroTipo("todos")
    setFiltroEquipe("todas")
    setFiltroDataInicio(undefined)
    setFiltroDataFim(undefined)
    setFiltroEvento("todos")
  }

  return (
    <ProtectedRoute resource="relatorios">
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
                    Relatórios e Análises
                  </h1>
                  <p className="text-muted-foreground">
                    Visualize estatísticas detalhadas e exporte relatórios personalizados
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" />
                        Filtros {(filtroTipo !== "todos" || filtroEquipe !== "todas" || filtroEvento !== "todos" || filtroDataInicio || filtroDataFim) && <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">{[filtroTipo !== "todos", filtroEquipe !== "todas", filtroEvento !== "todos", filtroDataInicio, filtroDataFim].filter(Boolean).length}</Badge>}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Filtros de Relatórios</DialogTitle>
                        <DialogDescription>
                          Configure os filtros para encontrar os relatórios desejados
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="tipo">Tipo de Relatório</Label>
                            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="todos">Todos os tipos</SelectItem>
                                <SelectItem value="presenca">Presença</SelectItem>
                                <SelectItem value="performance">Performance</SelectItem>
                                <SelectItem value="avaliacoes">Avaliações</SelectItem>
                                <SelectItem value="ranking">Ranking</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="equipe">Equipe</Label>
                            <Select value={filtroEquipe} onValueChange={setFiltroEquipe}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {equipesDisponiveis.map((equipe) => (
                                  <SelectItem key={equipe.id} value={equipe.id}>
                                    {equipe.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Evento</Label>
                          <Select value={filtroEvento} onValueChange={setFiltroEvento}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {eventosDisponiveis.map((evento) => (
                                <SelectItem key={evento.id} value={evento.id}>
                                  {evento.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Data Início</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !filtroDataInicio && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {filtroDataInicio ? format(filtroDataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={filtroDataInicio}
                                  onSelect={setFiltroDataInicio}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-2">
                            <Label>Data Fim</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !filtroDataFim && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {filtroDataFim ? format(filtroDataFim, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={filtroDataFim}
                                  onSelect={setFiltroDataFim}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <Button variant="outline" onClick={clearFilters} className="gap-2">
                            <X className="w-4 h-4" />
                            Limpar Filtros
                          </Button>
                          <Button onClick={() => setShowFilterDialog(false)}>
                            Aplicar Filtros
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button className="gap-2" onClick={() => handleExportPresencas()}>
                    <Download className="w-4 h-4" />
                    Gerar Relatório
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{estatisticasRapidas.totalParticipantes}</p>
                    <p className="text-xs text-muted-foreground">Participantes</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-6 h-6 text-success mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{estatisticasRapidas.eventosAtivos}</p>
                    <p className="text-xs text-muted-foreground">Eventos Ativos</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 text-warning mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{estatisticasRapidas.presencaHoje}</p>
                    <p className="text-xs text-muted-foreground">Presentes Hoje</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                  <CardContent className="p-4 text-center">
                    <FileText className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{estatisticasRapidas.avaliacoesPendentes}</p>
                    <p className="text-xs text-muted-foreground">Pendentes</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-muted/20 to-muted/10 border-muted/30">
                  <CardContent className="p-4 text-center">
                    <Users className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{estatisticasRapidas.equipesAtivas}</p>
                    <p className="text-xs text-muted-foreground">Equipes</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-6 h-6 text-destructive mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{estatisticasRapidas.mediaGeralNotas}</p>
                    <p className="text-xs text-muted-foreground">Média Geral</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="metricas" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                  <TabsTrigger value="metricas">Métricas</TabsTrigger>
                  <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
                  <TabsTrigger value="exportar">Exportar</TabsTrigger>
                </TabsList>

                <TabsContent value="metricas" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {metricas.map((metrica, index) => (
                      <Card key={index} className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <metrica.icone className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{metrica.titulo}</h3>
                                <p className="text-sm text-muted-foreground">{metrica.descricao}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-3xl font-bold text-foreground">{metrica.valor}</p>
                            </div>
                            <div>
                              <Badge 
                                variant={metrica.tipo === 'positivo' ? 'default' : 'destructive'} 
                                className="gap-1"
                              >
                                <TrendingUp className={`w-3 h-3 ${
                                  metrica.tipo === 'negativo' ? 'rotate-180' : ''
                                }`} />
                                {metrica.mudanca}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="relatorios" className="space-y-6">
                  <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Relatórios Disponíveis</CardTitle>
                        <div className="flex items-center gap-2">
                          <Select defaultValue="todos">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todos">Todos os tipos</SelectItem>
                              <SelectItem value="presenca">Presença</SelectItem>
                              <SelectItem value="performance">Performance</SelectItem>
                              <SelectItem value="avaliacoes">Avaliações</SelectItem>
                              <SelectItem value="ranking">Ranking</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {relatoriosDisponiveis.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Nenhum relatório gerado ainda.</p>
                            <p className="text-sm mt-1">Use as opções de exportação acima para gerar relatórios.</p>
                          </div>
                        ) : (
                          relatoriosDisponiveis.map((relatorio) => (
                            <div key={relatorio.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-foreground">{relatorio.titulo}</h4>
                                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span>{relatorio.periodo}</span>
                                    <span>•</span>
                                    <span>{relatorio.geradoEm}</span>
                                    <span>•</span>
                                    <span>{relatorio.tamanho}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant={getTipoColor(relatorio.tipo)}>
                                  {relatorio.tipo}
                                </Badge>
                                <Badge variant="outline">
                                  {relatorio.formato}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleViewReport(relatorio)}
                                    className="h-8 w-8"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDownloadReport(relatorio)}
                                    className="h-8 w-8"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="exportar" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Relatório de Presenças
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Exporte dados de frequência e participação em eventos
                        </p>
                        <div className="space-y-3">
                          <Select value={exportPeriodo} onValueChange={setExportPeriodo}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="semana">Última semana</SelectItem>
                              <SelectItem value="mes">Último mês</SelectItem>
                              <SelectItem value="trimestre">Último trimestre</SelectItem>
                              <SelectItem value="personalizado">Período personalizado</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            className="w-full gap-2" 
                            onClick={handleExportPresencas}
                            disabled={isExporting}
                          >
                            <Download className="w-4 h-4" />
                            {isExporting ? "Exportando..." : "Exportar PDF"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-accent" />
                          Análise de Desempenho
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Relatório completo com métricas e rankings
                        </p>
                        <div className="space-y-3">
                          <Select value={exportTipo} onValueChange={setExportTipo}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">Por indivíduo</SelectItem>
                              <SelectItem value="equipe">Por equipe</SelectItem>
                              <SelectItem value="geral">Geral</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            className="w-full gap-2" 
                            variant="outline"
                            onClick={handleExportDesempenho}
                            disabled={isExporting}
                          >
                            <Download className="w-4 h-4" />
                            {isExporting ? "Exportando..." : "Exportar Excel"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-success" />
                          Questionários e Avaliações
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Resultados de questionários e feedback dos participantes
                        </p>
                        <div className="space-y-3">
                          <Select value={exportAvaliacao} onValueChange={setExportAvaliacao}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="completo">Relatório completo</SelectItem>
                              <SelectItem value="resumo">Apenas resumo</SelectItem>
                              <SelectItem value="detalhado">Detalhado por pessoa</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            className="w-full gap-2" 
                            variant="outline"
                            onClick={handleExportAvaliacoes}
                            disabled={isExporting}
                          >
                            <Download className="w-4 h-4" />
                            {isExporting ? "Exportando..." : "Exportar PDF"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-warning" />
                          Relatório de Eventos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Histórico de eventos realizados e estatísticas
                        </p>
                        <div className="space-y-3">
                          <Select defaultValue="cronologico">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cronologico">Ordem cronológica</SelectItem>
                              <SelectItem value="tipo">Por tipo de evento</SelectItem>
                              <SelectItem value="local">Por local</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button className="w-full gap-2" variant="outline">
                            <Download className="w-4 h-4" />
                            Exportar Excel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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

export default Relatorios;