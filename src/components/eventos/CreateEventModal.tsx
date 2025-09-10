import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { Calendar as CalendarIcon, Plus, MapPin, Clock, Users } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { eventTypes, mockUsers } from "@/data/mockData"

interface CreateEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEventCreate: (event: any) => void
}

export function CreateEventModal({ open, onOpenChange, onEventCreate }: CreateEventModalProps) {
  const { toast } = useToast()
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    horario: "",
    duracao: "120",
    local: "",
    responsavel: "",
    descricao: "",
    participantesEsperados: "20"
  })

  const activeUsers = mockUsers.filter(user => user.status === "Ativo")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.tipo || !date || !formData.horario || !formData.responsavel) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    const newEvent = {
      id: Date.now(),
      ...formData,
      data: format(date, "yyyy-MM-dd"),
      status: "Agendado",
      participantesConfirmados: 0,
      participantesEsperados: parseInt(formData.participantesEsperados)
    }

    onEventCreate(newEvent)
    
    toast({
      title: "Sucesso",
      description: "Evento criado com sucesso!"
    })

    // Reset form
    setFormData({
      nome: "",
      tipo: "",
      horario: "",
      duracao: "120",
      local: "",
      responsavel: "",
      descricao: "",
      participantesEsperados: "20"
    })
    setDate(undefined)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Criar Novo Evento
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Evento *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Ensaio Coral Juvenil"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Evento *</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario">Horário *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="horario"
                  type="time"
                  value={formData.horario}
                  onChange={(e) => setFormData(prev => ({ ...prev, horario: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duracao">Duração (min)</Label>
              <Select value={formData.duracao} onValueChange={(value) => setFormData(prev => ({ ...prev, duracao: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60 minutos</SelectItem>
                  <SelectItem value="90">90 minutos</SelectItem>
                  <SelectItem value="120">120 minutos</SelectItem>
                  <SelectItem value="180">180 minutos</SelectItem>
                  <SelectItem value="240">240 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="local">Local</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="local"
                  value={formData.local}
                  onChange={(e) => setFormData(prev => ({ ...prev, local: e.target.value }))}
                  placeholder="Ex: Salão Principal"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável *</Label>
              <Select value={formData.responsavel} onValueChange={(value) => setFormData(prev => ({ ...prev, responsavel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar responsável" />
                </SelectTrigger>
                <SelectContent>
                  {activeUsers.filter(user => ['Músico', 'Organista', 'Ancião', 'Encarregado', 'Instrutor'].includes(user.papel)).map((user) => (
                    <SelectItem key={user.id} value={user.nome}>
                      {user.nome} - {user.papel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="participantesEsperados">Participantes Esperados</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="participantesEsperados"
                type="number"
                min="1"
                max="200"
                value={formData.participantesEsperados}
                onChange={(e) => setFormData(prev => ({ ...prev, participantesEsperados: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descreva os objetivos e detalhes do evento..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Criar Evento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}