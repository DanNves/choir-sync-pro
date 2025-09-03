import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  eventId: string
  type: "individual" | "team"
  questions: Question[]
  startDate: string
  endDate: string
}

interface QuestionarioResponseModalProps {
  questionario: Questionario | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitResponse?: (questionarioId: string, responses: Record<string, any>) => void
}

export function QuestionarioResponseModal({ 
  questionario, 
  open, 
  onOpenChange, 
  onSubmitResponse 
}: QuestionarioResponseModalProps) {
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  if (!questionario) return null

  const currentQuestion = questionario.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questionario.questions.length - 1
  const progress = ((currentQuestionIndex + 1) / questionario.questions.length) * 100

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const isCurrentQuestionAnswered = () => {
    const response = responses[currentQuestion.id]
    if (!currentQuestion.required) return true
    
    if (currentQuestion.type === 'text') {
      return response && response.trim().length > 0
    }
    
    return response !== undefined && response !== null
  }

  const handleNext = () => {
    if (!isCurrentQuestionAnswered()) {
      toast({
        title: "Pergunta obrigatória",
        description: "Esta pergunta é obrigatória e deve ser respondida",
        variant: "destructive"
      })
      return
    }

    if (isLastQuestion) {
      handleSubmit()
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    // Verificar se todas as perguntas obrigatórias foram respondidas
    const unansweredRequired = questionario.questions.filter(q => 
      q.required && (!responses[q.id] || (q.type === 'text' && !responses[q.id].trim()))
    )

    if (unansweredRequired.length > 0) {
      toast({
        title: "Respostas pendentes",
        description: `Existem ${unansweredRequired.length} pergunta(s) obrigatória(s) sem resposta`,
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular envio
      
      onSubmitResponse?.(questionario.id, responses)
      
      toast({
        title: "Respostas enviadas!",
        description: "Suas respostas foram registradas com sucesso"
      })
      
      // Reset state
      setResponses({})
      setCurrentQuestionIndex(0)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar suas respostas. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestion = (question: Question) => {
    const value = responses[question.id]

    switch (question.type) {
      case 'text':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="Digite sua resposta..."
            rows={4}
            className="w-full"
          />
        )

      case 'multiple':
        return (
          <RadioGroup 
            value={value || ''} 
            onValueChange={(newValue) => handleResponse(question.id, newValue)}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'scale':
        return (
          <RadioGroup 
            value={value?.toString() || ''} 
            onValueChange={(newValue) => handleResponse(question.id, parseInt(newValue))}
            className="flex flex-row justify-between"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex flex-col items-center space-y-2">
                <RadioGroupItem value={num.toString()} id={`${question.id}-${num}`} />
                <Label htmlFor={`${question.id}-${num}`} className="text-sm cursor-pointer">
                  {num}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'boolean':
        return (
          <RadioGroup 
            value={value?.toString() || ''} 
            onValueChange={(newValue) => handleResponse(question.id, newValue === 'true')}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="true" id={`${question.id}-true`} />
              <Label htmlFor={`${question.id}-true`} className="flex-1 cursor-pointer">
                Verdadeiro
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="false" id={`${question.id}-false`} />
              <Label htmlFor={`${question.id}-false`} className="flex-1 cursor-pointer">
                Falso
              </Label>
            </div>
          </RadioGroup>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{questionario.title}</DialogTitle>
          {questionario.description && (
            <p className="text-sm text-muted-foreground">{questionario.description}</p>
          )}
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Pergunta {currentQuestionIndex + 1} de {questionario.questions.length}
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Current Question */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{currentQuestionIndex + 1}
                    </Badge>
                    {currentQuestion.required && (
                      <Badge variant="destructive" className="text-xs">
                        Obrigatória
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      Peso: {currentQuestion.weight}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{currentQuestion.text}</CardTitle>
                </div>
                {isCurrentQuestionAnswered() ? (
                  <CheckCircle className="w-5 h-5 text-success shrink-0" />
                ) : currentQuestion.required ? (
                  <AlertCircle className="w-5 h-5 text-warning shrink-0" />
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              {renderQuestion(currentQuestion)}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Anterior
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Tempo estimado: {questionario.questions.length * 2} min</span>
            </div>

            {isLastQuestion ? (
              <Button 
                onClick={handleNext}
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? "Enviando..." : "Finalizar"}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Próxima
              </Button>
            )}
          </div>

          {/* Summary of answered questions */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Progresso das respostas:</p>
            <div className="flex flex-wrap gap-2">
              {questionario.questions.map((question, index) => {
                const isAnswered = responses[question.id] !== undefined && 
                  (question.type !== 'text' || responses[question.id]?.trim())
                const isCurrent = index === currentQuestionIndex
                
                return (
                  <Button
                    key={question.id}
                    variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}