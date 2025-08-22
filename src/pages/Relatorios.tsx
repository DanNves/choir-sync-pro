import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
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
  Eye
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

const Relatorios = () => {
  const relatoriosDisponiveis = [
    {
      id: 1,
      titulo: "Relatório de Presenças - Janeiro",
      tipo: "Presença",
      periodo: "Janeiro 2024",
      geradoEm: "2024-01-20 10:30",
      status: "Disponível",
      tamanho: "2.4 MB",
      formato: "PDF"
    },
    {
      id: 2,
      titulo: "Análise de Desempenho por Equipe",
      tipo: "Performance", 
      periodo: "Último trimestre",
      geradoEm: "2024-01-18 15:45",
      status: "Disponível",
      tamanho: "1.8 MB",
      formato: "Excel"
    },
    {
      id: 3,
      titulo: "Questionários - Estatísticas Gerais",
      tipo: "Avaliações",
      periodo: "Janeiro 2024",
      geradoEm: "2024-01-15 09:20", 
      status: "Disponível",
      tamanho: "956 KB",
      formato: "PDF"
    },
    {
      id: 4,
      titulo: "Ranking Mensal Completo",
      tipo: "Ranking",
      periodo: "Dezembro 2023",
      geradoEm: "2024-01-02 14:15",
      status: "Disponível",
      tamanho: "3.1 MB", 
      formato: "PDF"
    }
  ]

  const metricas = [
    {
      titulo: "Taxa de Presença Média",
      valor: "87.5%",
      mudanca: "+5.2%",
      tipo: "positivo",
      icone: Users,
      descricao: "Comparado ao mês anterior"
    },
    {
      titulo: "Eventos Realizados",
      valor: "18",
      mudanca: "+3",
      tipo: "positivo", 
      icone: Calendar,
      descricao: "Este mês"
    },
    {
      titulo: "Questionários Aplicados",
      valor: "12",
      mudanca: "-2",
      tipo: "negativo",
      icone: FileText,
      descricao: "Este mês"
    },
    {
      titulo: "Participação Média",
      valor: "92.3%",
      mudanca: "-1.1%",
      tipo: "negativo",
      icone: TrendingUp,
      descricao: "Taxa de conclusão"
    }
  ]

  const estatisticasRapidas = {
    totalParticipantes: 243,
    eventosAtivos: 3,
    presencaHoje: 38,
    avaliacoesPendentes: 5,
    equipesAtivas: 4,
    mediaGeralNotas: 8.4
  }

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
                    Relatórios e Análises
                  </h1>
                  <p className="text-muted-foreground">
                    Visualize estatísticas detalhadas e exporte relatórios personalizados
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filtrar
                  </Button>
                  <Button className="gap-2">
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
                        {relatoriosDisponiveis.map((relatorio) => (
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
                                <Button variant="ghost" size="icon">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
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
                          <Select defaultValue="mes">
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
                          <Button className="w-full gap-2">
                            <Download className="w-4 h-4" />
                            Exportar PDF
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
                          <Select defaultValue="individual">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">Por indivíduo</SelectItem>
                              <SelectItem value="equipe">Por equipe</SelectItem>
                              <SelectItem value="geral">Geral</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button className="w-full gap-2" variant="outline">
                            <Download className="w-4 h-4" />
                            Exportar Excel
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
                          <Select defaultValue="completo">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="completo">Relatório completo</SelectItem>
                              <SelectItem value="resumo">Apenas resumo</SelectItem>
                              <SelectItem value="detalhado">Detalhado por pessoa</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button className="w-full gap-2" variant="outline">
                            <Download className="w-4 h-4" />
                            Exportar PDF
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
  );
};

export default Relatorios;