import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { UserCheck, Clock, Calendar, MapPin } from "lucide-react"
import { mockUsers, mockEvents } from "@/data/mockData"

interface RegistrarPresencaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPresencaCreate: (presenca: any) => void
}

export function RegistrarPresencaModal({ open, onOpenChange, onPresencaCreate }: RegistrarPresencaModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    usuarioId: "",
    eventoId: "",
    horarioEntrada: "",
    horarioSaida: "",
    status: "Presente",
    observacoes: ""
  })

  const activeUsers = mockUsers.filter(user => user.status === "Ativo")
  const selectedUser = activeUsers.find(user => user.id.toString() === formData.usuarioId)
  const selectedEvent = mockEvents.find(event => event.id.toString() === formData.eventoId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.usuarioId || !formData.eventoId) {
      toast({
        title: "Erro",
        description: "Selecione o usuário e o evento",
        variant: "destructive"
      })
      return
    }

    if (formData.status === "Presente" && !formData.horarioEntrada) {
      toast({
        title: "Erro",
        description: "Informe o horário de entrada para presença confirmada",
        variant: "destructive"
      })
      return
    }

    const newPresenca = {
      id: Date.now(),
      usuarioId: parseInt(formData.usuarioId),
      eventoId: parseInt(formData.eventoId),
      usuario: selectedUser?.nome || "",
      evento: selectedEvent?.nome || "",
      data: selectedEvent?.data || new Date().toISOString().split('T')[0],
      horarioEntrada: formData.status === "Presente" ? formData.horarioEntrada : "",
      horarioSaida: formData.status === "Presente" ? formData.horarioSaida : "",
      status: formData.status,
      observacoes: formData.observacoes
    }

    onPresencaCreate(newPresenca)
    
    toast({
      title: "Sucesso",
      description: `Presença ${formData.status === "Presente" ? "confirmada" : "registrada"} com sucesso!`
    })

    // Reset form
    setFormData({
      usuarioId: "",
      eventoId: "",
      horarioEntrada: "",
      horarioSaida: "",
      status: "Presente",
      observacoes: ""
    })
    onOpenChange(false)
  }

  const getCurrentTime = () => {
    return new Date().toTimeString().slice(0, 5)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Registrar Presença
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="usuarioId">Usuário *</Label>
            <Select value={formData.usuarioId} onValueChange={(value) => setFormData(prev => ({ ...prev, usuarioId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar usuário" />
              </SelectTrigger>
              <SelectContent>
                {activeUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{user.nome}</span>
                      <Badge variant="outline" className="text-xs">{user.instrumento}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventoId">Evento *</Label>
            <Select value={formData.eventoId} onValueChange={(value) => setFormData(prev => ({ ...prev, eventoId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar evento" />
              </SelectTrigger>
              <SelectContent>
                {mockEvents.filter(event => event.status !== "Cancelado").map((event) => (
                  <SelectItem key={event.id} value={event.id.toString()}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{event.nome}</span>
                        <Badge variant="secondary" className="text-xs">{event.tipo}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {event.data}
                        <Clock className="w-3 h-3" />
                        {event.horario}
                        {event.local && (
                          <>
                            <MapPin className="w-3 h-3" />
                            {event.local}
                          </>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Presente">Presente</SelectItem>
                <SelectItem value="Ausente">Ausente</SelectItem>
                <SelectItem value="Atrasado">Atrasado</SelectItem>
                <SelectItem value="Saída Antecipada">Saída Antecipada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.status === "Presente" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horarioEntrada">Entrada *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="horarioEntrada"
                    type="time"
                    value={formData.horarioEntrada}
                    onChange={(e) => setFormData(prev => ({ ...prev, horarioEntrada: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => setFormData(prev => ({ ...prev, horarioEntrada: getCurrentTime() }))}
                >
                  Agora ({getCurrentTime()})
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="horarioSaida">Saída</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="horarioSaida"
                    type="time"
                    value={formData.horarioSaida}
                    onChange={(e) => setFormData(prev => ({ ...prev, horarioSaida: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => setFormData(prev => ({ ...prev, horarioSaida: getCurrentTime() }))}
                >
                  Agora ({getCurrentTime()})
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Informações adicionais sobre a presença..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              <UserCheck className="w-4 h-4 mr-2" />
              Registrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}