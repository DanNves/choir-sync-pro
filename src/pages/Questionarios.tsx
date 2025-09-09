import { useState } from "react"
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
  ClipboardList, 
  Plus, 
  Eye,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  MoreHorizontal,
  Play
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CreateQuestionarioModal } from "@/components/questionarios/CreateQuestionarioModal"
import { EditQuestionarioModal } from "@/components/questionarios/EditQuestionarioModal"
import { QuestionarioResponseModal } from "@/components/questionarios/QuestionarioResponseModal"
import { ViewResponsesModal } from "@/components/questionarios/ViewResponsesModal"
import { useToast } from "@/hooks/use-toast"

const Questionarios = () => {
  const [questionarios, setQuestionarios] = useState<Array<{
    id: number;
    titulo: string;
    evento: string;
    dataEvento: string;
    tipo: string;
    questoes: number;
    participantes: number;
    respostas: number;
    status: string;
    prazo: string;
    mediaNotas: number;
    fullData?: any;
  }>>([
    {
      id: 1,
      titulo: "Avaliação Técnica - Violão Básico",
      evento: "Ensaio Coral Juvenil",
      dataEvento: "2024-01-20",
      tipo: "Técnico",
      questoes: 15,
      participantes: 12,
      respostas: 8,
      status: "Ativo",
      prazo: "2024-01-21 23:59",
      mediaNotas: 7.8
    },
    {
      id: 2,
      titulo: "Conhecimento Musical - Teoria Básica", 
      evento: "Reunião de Instrumentistas",
      dataEvento: "2024-01-19",
      tipo: "Teórico",
      questoes: 20,
      participantes: 23,
      respostas: 21,
      status: "Finalizado",
      prazo: "2024-01-20 23:59",
      mediaNotas: 8.4
    },
    {
      id: 3,
      titulo: "Feedback do Ensaio",
      evento: "Ensaio Coral Adulto", 
      dataEvento: "2024-01-18",
      tipo: "Feedback",
      questoes: 8,
      participantes: 67,
      respostas: 58,
      status: "Finalizado",
      prazo: "2024-01-19 12:00",
      mediaNotas: 9.1
    },
    {
      id: 4,
      titulo: "Autoavaliação - Piano Intermediário",
      evento: "Avaliação Técnica Mensal",
      dataEvento: "2024-01-25", 
      tipo: "Autoavaliação",
      questoes: 12,
      participantes: 8,
      respostas: 0,
      status: "Agendado",
      prazo: "2024-01-26 18:00",
      mediaNotas: 0
    }
  ])

  const [editingQuestionario, setEditingQuestionario] = useState<any>(null)
  const [respondingQuestionario, setRespondingQuestionario] = useState<any>(null)
  const [viewingQuestionario, setViewingQuestionario] = useState<any>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [responseModalOpen, setResponseModalOpen] = useState(false)
  const [viewResponsesModalOpen, setViewResponsesModalOpen] = useState(false)
  const { toast } = useToast()

  const respostasRecentes = [
    {
      id: 1,
      usuario: "João Silva",
      questionario: "Avaliação Técnica - Violão Básico",
      nota: 8.5,
      tempo: "12 min",
      dataResposta: "Hoje, 15:30"
    },
    {
      id: 2,
      usuario: "Maria Santos",
      questionario: "Avaliação Técnica - Violão Básico", 
      nota: 7.2,
      tempo: "15 min",
      dataResposta: "Hoje, 14:45"
    },
    {
      id: 3,
      usuario: "Pedro Costa",
      questionario: "Conhecimento Musical - Teoria Básica",
      nota: 9.0,
      tempo: "18 min", 
      dataResposta: "Ontem, 21:15"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'default'
      case 'Finalizado': return 'secondary'
      case 'Agendado': return 'outline'
      case 'Cancelado': return 'destructive'
      default: return 'secondary'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Técnico': return 'destructive'
      case 'Teórico': return 'default'
      case 'Feedback': return 'secondary'
      case 'Autoavaliação': return 'outline'
      default: return 'outline'
    }
  }

  const getNotaColor = (nota: number) => {
    if (nota >= 8.5) return 'text-success'
    if (nota >= 7.0) return 'text-warning'
    return 'text-destructive'
  }

  const handleCreateQuestionario = (novoQuestionario: any) => {
    setQuestionarios(prev => [...prev, {
      id: novoQuestionario.id,
      titulo: novoQuestionario.title,
      evento: "Evento Selecionado", // This should come from the event selection
      dataEvento: new Date().toISOString().split('T')[0],
      tipo: novoQuestionario.questions.some((q: any) => q.type === 'scale') ? "Técnico" : 
            novoQuestionario.questions.some((q: any) => q.type === 'boolean') ? "Teórico" : "Feedback",
      questoes: novoQuestionario.questions.length,
      participantes: 0,
      respostas: 0,
      status: "Agendado",
      prazo: new Date(novoQuestionario.endDate).toLocaleString(),
      mediaNotas: 0,
      fullData: novoQuestionario
    }])
  }

  const handleUpdateQuestionario = (updatedQuestionario: any) => {
    setQuestionarios(prev => prev.map(q => 
      q.id === updatedQuestionario.id 
        ? {
            ...q,
            titulo: updatedQuestionario.title,
            questoes: updatedQuestionario.questions.length,
            prazo: new Date(updatedQuestionario.endDate).toLocaleString(),
            fullData: updatedQuestionario
          }
        : q
    ))
  }

  const handleSubmitResponse = (questionarioId: string, responses: Record<string, any>) => {
    setQuestionarios(prev => prev.map(q => 
      q.id.toString() === questionarioId 
        ? { ...q, respostas: q.respostas + 1 }
        : q
    ))
  }

  const handleDeleteQuestionario = (id: number) => {
    setQuestionarios(prev => prev.filter(q => q.id !== id))
    toast({
      title: "Questionário excluído",
      description: "O questionário foi removido com sucesso"
    })
  }

  const canRespond = (questionario: any) => {
    return questionario.status === "Ativo"
  }

  return (
    <ProtectedRoute resource="questionarios">
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
                    Questionários e Avaliações
                  </h1>
                  <p className="text-muted-foreground">
                    Crie avaliações técnicas e colete feedback dos participantes
                  </p>
                </div>
                <ConditionalRender permission="create_questionnaires">
                  <CreateQuestionarioModal onCreateQuestionario={handleCreateQuestionario}>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Novo Questionário
                    </Button>
                  </CreateQuestionarioModal>
                </ConditionalRender>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ClipboardList className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-foreground">28</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ativos</p>
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
                        <p className="text-sm text-muted-foreground">Participações</p>
                        <p className="text-2xl font-bold text-foreground">87</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Média Geral</p>
                        <p className="text-2xl font-bold text-foreground">8.4</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="questionarios" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                  <TabsTrigger value="questionarios">Questionários</TabsTrigger>
                  <TabsTrigger value="respostas">Respostas</TabsTrigger>
                </TabsList>

                <TabsContent value="questionarios" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {questionarios.map((questionario) => (
                      <Card key={questionario.id} className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <CardTitle className="text-lg">{questionario.titulo}</CardTitle>
                              <div className="flex items-center gap-2">
                                <Badge variant={getTipoColor(questionario.tipo)}>
                                  {questionario.tipo}
                                </Badge>
                                <Badge variant={getStatusColor(questionario.status)}>
                                  {questionario.status}
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
                                {canRespond(questionario) && (
                                  <DropdownMenuItem 
                                    className="gap-2"
                                    onClick={() => {
                                      setRespondingQuestionario(questionario.fullData || {
                                        id: questionario.id.toString(),
                                        title: questionario.titulo,
                                        description: "Questionário de avaliação",
                                        questions: [], // This would need to come from stored data
                                        startDate: new Date().toISOString(),
                                        endDate: new Date().toISOString()
                                      })
                                      setResponseModalOpen(true)
                                    }}
                                  >
                                    <Play className="w-4 h-4" />
                                    Responder
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  className="gap-2"
                                  onClick={() => {
                                    setViewingQuestionario(questionario.fullData || {
                                      id: questionario.id.toString(),
                                      title: questionario.titulo,
                                      description: "Questionário de avaliação",
                                      questions: [
                                        { id: "p1", text: "Afinou corretamente antes do ensaio?", type: "boolean", weight: 2, required: true },
                                        { id: "p2", text: "Como avalia sua pontualidade?", type: "scale", weight: 3, required: true },
                                        { id: "p3", text: "Comentários gerais sobre o ensaio:", type: "text", weight: 1, required: false },
                                        { id: "p4", text: "Qual sua avaliação geral?", type: "multiple", options: ["Excelente", "Bom", "Regular", "Precisa melhorar"], weight: 2, required: true }
                                      ]
                                    })
                                    setViewResponsesModalOpen(true)
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                  Ver Respostas
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="gap-2"
                                  onClick={() => {
                                    setEditingQuestionario(questionario.fullData || {
                                      id: questionario.id.toString(),
                                      title: questionario.titulo,
                                      description: "Questionário de avaliação",
                                      eventId: "e1",
                                      type: "individual",
                                      questions: [],
                                      startDate: new Date().toISOString(),
                                      endDate: new Date().toISOString(),
                                      status: questionario.status,
                                      responses: []
                                    })
                                    setEditModalOpen(true)
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="gap-2 text-destructive"
                                  onClick={() => handleDeleteQuestionario(questionario.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Evento vinculado</p>
                              <p className="font-medium text-foreground">{questionario.evento}</p>
                              <p className="text-xs text-muted-foreground">{questionario.dataEvento}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Questões</p>
                                <p className="font-medium text-foreground">{questionario.questoes}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Participantes</p>
                                <p className="font-medium text-foreground">{questionario.participantes}</p>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Progresso</span>
                                <span className="text-sm font-medium text-foreground">
                                  {questionario.respostas}/{questionario.participantes}
                                </span>
                              </div>
                              <Progress 
                                value={questionario.participantes > 0 
                                  ? (questionario.respostas / questionario.participantes) * 100 
                                  : 0
                                } 
                                className="h-2"
                              />
                            </div>

                            {questionario.mediaNotas > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Média das notas:</span>
                                <span className={`text-sm font-medium ${getNotaColor(questionario.mediaNotas)}`}>
                                  {questionario.mediaNotas.toFixed(1)}
                                </span>
                              </div>
                            )}

                            <div className="pt-2 border-t border-border/50">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                Prazo: {questionario.prazo}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="respostas" className="space-y-6">
                  <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader>
                      <CardTitle>Respostas Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Questionário</TableHead>
                            <TableHead>Nota</TableHead>
                            <TableHead>Tempo</TableHead>
                            <TableHead>Data</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {respostasRecentes.map((resposta) => (
                            <TableRow key={resposta.id}>
                              <TableCell className="font-medium text-foreground">
                                {resposta.usuario}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {resposta.questionario}
                              </TableCell>
                              <TableCell>
                                <span className={`font-medium ${getNotaColor(resposta.nota)}`}>
                                  {resposta.nota}
                                </span>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {resposta.tempo}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {resposta.dataResposta}
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

      {/* Modals */}
      <EditQuestionarioModal 
        questionario={editingQuestionario}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onUpdateQuestionario={handleUpdateQuestionario}
      />
      
      <QuestionarioResponseModal 
        questionario={respondingQuestionario}
        open={responseModalOpen}
        onOpenChange={setResponseModalOpen}
        onSubmitResponse={handleSubmitResponse}
      />
      
      <ViewResponsesModal 
        questionario={viewingQuestionario}
        open={viewResponsesModalOpen}
        onOpenChange={setViewResponsesModalOpen}
      />
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Questionarios;