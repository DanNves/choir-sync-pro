import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar as CalendarIcon, Trash2, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
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
  startDate: string
  endDate: string
  questions: Question[]
  status: string
  responses: any[]
}

interface EditQuestionarioModalProps {
  questionario: Questionario | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateQuestionario?: (questionario: Questionario) => void
}

export function EditQuestionarioModal({ 
  questionario, 
  open, 
  onOpenChange, 
  onUpdateQuestionario 
}: EditQuestionarioModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [eventId, setEventId] = useState("")
  const [type, setType] = useState<"individual" | "team">("individual")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: "",
    type: "text",
    weight: 1,
    required: true
  })
  const [newOption, setNewOption] = useState("")
  const { toast } = useToast()

  // Mock events data
  const eventos = [
    { id: "e1", name: "Ensaio Coral Juvenil", type: "Ensaio" },
    { id: "e2", name: "Reunião de Instrumentistas", type: "Reunião" },
    { id: "e3", name: "Encontro Musical de Natal", type: "Encontro Musical" },
    { id: "e4", name: "Ensaio Coral Adulto", type: "Ensaio" }
  ]

  const questionTypes = [
    { value: "text", label: "Texto livre" },
    { value: "multiple", label: "Múltipla escolha" },
    { value: "scale", label: "Escala 1-5" },
    { value: "boolean", label: "Verdadeiro/Falso" }
  ]

  // Populate form when questionario changes
  useEffect(() => {
    if (questionario) {
      setTitle(questionario.title)
      setDescription(questionario.description || "")
      setEventId(questionario.eventId)
      setType(questionario.type)
      setStartDate(new Date(questionario.startDate))
      setEndDate(new Date(questionario.endDate))
      setQuestions(questionario.questions)
    }
  }, [questionario])

  const hasResponses = questionario?.responses && questionario.responses.length > 0
  const isStarted = questionario?.status === "Ativo" || questionario?.status === "Finalizado"

  const addQuestion = () => {
    if (!newQuestion.text) {
      toast({
        title: "Erro",
        description: "O texto da pergunta é obrigatório",
        variant: "destructive"
      })
      return
    }

    const question: Question = {
      id: `q${Date.now()}`,
      text: newQuestion.text,
      type: newQuestion.type || "text",
      weight: newQuestion.weight || 1,
      required: newQuestion.required !== false,
      ...(newQuestion.type === "multiple" && newQuestion.options?.length ? { options: newQuestion.options } : {})
    }

    setQuestions([...questions, question])
    setNewQuestion({
      text: "",
      type: "text",
      weight: 1,
      required: true
    })
  }

  const removeQuestion = (id: string) => {
    if (hasResponses) {
      toast({
        title: "Ação não permitida",
        description: "Não é possível remover perguntas de questionários com respostas",
        variant: "destructive"
      })
      return
    }
    setQuestions(questions.filter(q => q.id !== id))
  }

  const addOption = () => {
    if (!newOption.trim()) return
    
    setNewQuestion(prev => ({
      ...prev,
      options: [...(prev.options || []), newOption.trim()]
    }))
    setNewOption("")
  }

  const removeOption = (index: number) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = () => {
    if (!questionario) return

    // Validações
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive"
      })
      return
    }

    if (!eventId) {
      toast({
        title: "Erro", 
        description: "Selecione um evento",
        variant: "destructive"
      })
      return
    }

    if (!startDate || !endDate) {
      toast({
        title: "Erro",
        description: "Defina as datas de início e término",
        variant: "destructive"
      })
      return
    }

    if (questions.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma pergunta",
        variant: "destructive"
      })
      return
    }

    const requiredQuestions = questions.filter(q => q.required)
    if (requiredQuestions.length === 0) {
      toast({
        title: "Erro",
        description: "Pelo menos uma pergunta deve ser obrigatória",
        variant: "destructive"
      })
      return
    }

    const updatedQuestionario: Questionario = {
      ...questionario,
      title: title.trim(),
      description: description.trim(),
      eventId,
      type,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      questions
    }

    onUpdateQuestionario?.(updatedQuestionario)
    
    toast({
      title: "Sucesso",
      description: "Questionário atualizado com sucesso!"
    })

    onOpenChange(false)
  }

  if (!questionario) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Questionário</DialogTitle>
          {hasResponses && (
            <div className="bg-warning/10 border border-warning/20 rounded-md p-3">
              <p className="text-sm text-warning-foreground">
                ⚠️ Este questionário possui respostas. Algumas modificações são limitadas.
              </p>
            </div>
          )}
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Avaliação Técnica - Ensaio do dia 12/09"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve resumo do objetivo do questionário"
                rows={3}
              />
            </div>
          </div>

          {/* Configurações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Evento *</Label>
              <Select value={eventId} onValueChange={setEventId} disabled={hasResponses}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um evento" />
                </SelectTrigger>
                <SelectContent>
                  {eventos.map((evento) => (
                    <SelectItem key={evento.id} value={evento.id}>
                      {evento.name} ({evento.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select 
                value={type} 
                onValueChange={(value: "individual" | "team") => setType(value)}
                disabled={hasResponses}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="team">Em equipe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Início *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                    disabled={isStarted}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data de Término *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    className="pointer-events-auto"
                    disabled={(date) => startDate ? date < startDate : false}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Perguntas existentes */}
          {questions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Perguntas ({questions.length})</h3>
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <Card key={question.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">#{index + 1}</span>
                            <Badge variant={question.type === "text" ? "default" : 
                                          question.type === "multiple" ? "secondary" :
                                          question.type === "scale" ? "outline" : "destructive"}>
                              {questionTypes.find(t => t.value === question.type)?.label}
                            </Badge>
                            {question.required && (
                              <Badge variant="outline" className="text-xs">Obrigatória</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">Peso: {question.weight}</Badge>
                          </div>
                          <p className="text-sm">{question.text}</p>
                          {question.options && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Opções:</p>
                              <div className="flex flex-wrap gap-1">
                                {question.options.map((option, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {option}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(question.id)}
                          className="text-destructive hover:text-destructive"
                          disabled={hasResponses}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Nova pergunta - só permite se não tem respostas */}
          {!hasResponses && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adicionar Pergunta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Texto da pergunta *</Label>
                  <Textarea
                    value={newQuestion.text || ""}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Digite a pergunta..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select 
                      value={newQuestion.type} 
                      onValueChange={(value: Question['type']) => setNewQuestion(prev => ({ ...prev, type: value, options: [] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Peso</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={newQuestion.weight || 1}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, weight: parseInt(e.target.value) || 1 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Obrigatória</Label>
                    <Select 
                      value={newQuestion.required ? "true" : "false"} 
                      onValueChange={(value) => setNewQuestion(prev => ({ ...prev, required: value === "true" }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Sim</SelectItem>
                        <SelectItem value="false">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Opções para múltipla escolha */}
                {newQuestion.type === "multiple" && (
                  <div className="space-y-2">
                    <Label>Opções</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Digite uma opção..."
                        onKeyPress={(e) => e.key === "Enter" && addOption()}
                      />
                      <Button type="button" onClick={addOption} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {newQuestion.options && newQuestion.options.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-1 bg-secondary/50 rounded-md px-2 py-1">
                            <span className="text-sm">{option}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOption(index)}
                              className="h-auto p-0 w-4 h-4"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <Button type="button" onClick={addQuestion} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Pergunta
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}