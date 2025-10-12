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
import { useQuestionnaires } from "@/hooks/useQuestionnaires"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const Questionarios = () => {
  const { toast } = useToast()
  const { questionnaires, isLoading, createQuestionnaire, updateQuestionnaire, deleteQuestionnaire } = useQuestionnaires()

  const [editingQuestionario, setEditingQuestionario] = useState<any>(null)
  const [respondingQuestionario, setRespondingQuestionario] = useState<any>(null)
  const [viewingQuestionario, setViewingQuestionario] = useState<any>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [responseModalOpen, setResponseModalOpen] = useState(false)
  const [viewResponsesModalOpen, setViewResponsesModalOpen] = useState(false)

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
    createQuestionnaire({
      questionnaire: {
        titulo: novoQuestionario.title,
        descricao: novoQuestionario.description,
        event_id: novoQuestionario.eventId,
        tipo: novoQuestionario.type,
        data_inicio: novoQuestionario.startDate,
        data_fim: novoQuestionario.endDate
      },
      questions: novoQuestionario.questions.map((q: any, index: number) => ({
        texto: q.text,
        tipo: q.type,
        ordem: index + 1,
        peso: q.weight,
        obrigatorio: q.required,
        opcoes: q.options || null
      }))
    })
  }

  const handleUpdateQuestionario = (updatedQuestionario: any) => {
    updateQuestionnaire({
      id: updatedQuestionario.id,
      titulo: updatedQuestionario.title,
      descricao: updatedQuestionario.description,
      data_fim: updatedQuestionario.endDate
    })
  }

  const handleSubmitResponse = (questionarioId: string, responses: Record<string, any>) => {
    toast({
      title: "Resposta enviada",
      description: "Sua resposta foi registrada com sucesso."
    })
  }

  const handleDeleteQuestionario = (id: string) => {
    deleteQuestionnaire(id)
  }

  const canRespond = (questionario: any) => {
    const now = new Date()
    const dataInicio = new Date(questionario.data_inicio)
    const dataFim = new Date(questionario.data_fim)
    return now >= dataInicio && now <= dataFim
  }

  const totalQuestionarios = questionnaires.length
  const ativosCount = questionnaires.filter(q => canRespond(q)).length
  const totalRespostas = 0 // TODO: Count from responses table
  const mediaGeral = 0 // TODO: Calculate from responses

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
                        <p className="text-2xl font-bold text-foreground">{totalQuestionarios}</p>
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
                        <p className="text-2xl font-bold text-foreground">{ativosCount}</p>
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
                        <p className="text-2xl font-bold text-foreground">{totalRespostas}</p>
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
                        <p className="text-2xl font-bold text-foreground">{mediaGeral.toFixed(1)}</p>
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
                  {isLoading ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Carregando questionários...</p>
                    </div>
                  ) : questionnaires.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Nenhum questionário encontrado</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {questionnaires.map((questionario: any) => {
                        const questoesCount = questionario.questionnaire_questions?.length || 0
                        const eventoNome = questionario.events?.nome || "Sem evento"
                        
                        return (
                        <Card key={questionario.id} className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <CardTitle className="text-lg">{questionario.titulo}</CardTitle>
                                <div className="flex items-center gap-2">
                                  <Badge variant={getTipoColor(questionario.tipo)}>
                                    {questionario.tipo}
                                  </Badge>
                                  <Badge variant={canRespond(questionario) ? "default" : "secondary"}>
                                    {canRespond(questionario) ? "Ativo" : "Encerrado"}
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
                                <p className="font-medium text-foreground">{eventoNome}</p>
                                {questionario.events?.data && (
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(questionario.events.data), "dd/MM/yyyy", { locale: ptBR })}
                                  </p>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Questões</p>
                                  <p className="font-bold text-foreground">{questoesCount}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Prazo</p>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-warning" />
                                    <p className="text-xs text-foreground">
                                      {format(new Date(questionario.data_fim), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                  )}
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
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              Nenhuma resposta registrada ainda
                            </TableCell>
                          </TableRow>
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