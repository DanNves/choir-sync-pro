import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  User,
  Calendar
} from "lucide-react"

interface Response {
  userId: string
  userName: string
  answers: Record<string, any>
  completedAt?: string
  score?: number
}

interface Question {
  id: string
  text: string
  type: 'text' | 'multiple' | 'scale' | 'boolean'
  options?: string[]
  weight: number
  required: boolean
}

interface Questionario {
  id: string
  title: string
  description?: string
  questions: Question[]
  responses?: Response[]
}

interface ViewResponsesModalProps {
  questionario: Questionario | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewResponsesModal({ 
  questionario, 
  open, 
  onOpenChange 
}: ViewResponsesModalProps) {
  if (!questionario) return null

  // Mock data para demonstração
  const mockResponses: Response[] = [
    {
      userId: "u1",
      userName: "João Silva",
      answers: {
        "p1": true,
        "p2": 4,
        "p3": "Excelente organização do ensaio",
        "p4": "Opção A"
      },
      completedAt: "2024-01-20 14:30",
      score: 8.5
    },
    {
      userId: "u2", 
      userName: "Maria Santos",
      answers: {
        "p1": false,
        "p2": 3,
        "p3": "Poderia melhorar a pontualidade",
        "p4": "Opção B"
      },
      completedAt: "2024-01-20 15:45",
      score: 6.8
    },
    {
      userId: "u3",
      userName: "Pedro Costa", 
      answers: {
        "p1": true,
        "p2": 5,
        "p3": "Muito bom, continuem assim!",
        "p4": "Opção A"
      },
      completedAt: "2024-01-20 16:20",
      score: 9.2
    }
  ]

  const responses = questionario.responses || mockResponses
  const totalResponses = responses.length
  const averageScore = responses.reduce((acc, r) => acc + (r.score || 0), 0) / (totalResponses || 1)

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-success'
    if (score >= 7.0) return 'text-warning' 
    return 'text-destructive'
  }

  const formatAnswer = (question: Question, answer: any) => {
    switch (question.type) {
      case 'boolean':
        return answer ? 'Verdadeiro' : 'Falso'
      case 'scale':
        return `${answer}/5`
      case 'text':
        return answer || 'Não respondeu'
      case 'multiple':
        return answer || 'Não selecionou'
      default:
        return String(answer || 'N/A')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Respostas: {questionario.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Respostas</p>
                    <p className="text-xl font-bold text-foreground">{totalResponses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Média Geral</p>
                    <p className={`text-xl font-bold ${getScoreColor(averageScore)}`}>
                      {averageScore.toFixed(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Resposta</p>
                    <p className="text-xl font-bold text-foreground">
                      {Math.round((totalResponses / Math.max(totalResponses, 15)) * 100)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Individual Responses */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Respostas Individuais</h3>
            
            {responses.map((response, index) => (
              <Card key={response.userId} className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{response.userName}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {response.completedAt || 'Data não disponível'}
                        </div>
                      </div>
                    </div>
                    {response.score && (
                      <Badge 
                        variant="outline" 
                        className={`text-sm font-medium ${getScoreColor(response.score)}`}
                      >
                        {response.score.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {questionario.questions.map((question) => (
                      <div key={question.id} className="space-y-1">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-foreground flex-1 pr-4">
                            {question.text}
                          </p>
                          <Badge variant="outline" className="text-xs shrink-0">
                            Peso: {question.weight}
                          </Badge>
                        </div>
                        <div className="bg-muted/30 rounded-md p-3">
                          <p className="text-sm text-foreground">
                            {formatAnswer(question, response.answers[question.id])}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Question Analysis */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Análise por Pergunta</h3>
            
            {questionario.questions.map((question) => {
              const questionResponses = responses.map(r => r.answers[question.id]).filter(Boolean)
              const responseCount = questionResponses.length
              
              return (
                <Card key={question.id} className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base flex-1">{question.text}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Peso: {question.weight}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {responseCount} respostas
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Taxa de resposta</span>
                        <span className="font-medium">{Math.round((responseCount / totalResponses) * 100)}%</span>
                      </div>
                      <Progress value={(responseCount / totalResponses) * 100} className="h-2" />
                    </div>
                    
                    {question.type === 'scale' && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-2">Distribuição das notas:</p>
                        <div className="grid grid-cols-5 gap-2 text-xs">
                          {[1, 2, 3, 4, 5].map(num => {
                            const count = questionResponses.filter(r => r === num).length
                            const percentage = responseCount > 0 ? (count / responseCount) * 100 : 0
                            return (
                              <div key={num} className="text-center">
                                <div className="font-medium">{num}</div>
                                <div className="text-muted-foreground">{count} ({percentage.toFixed(0)}%)</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}