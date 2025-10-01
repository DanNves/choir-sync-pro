import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { UserCheck, Clock, Save } from "lucide-react"

interface EditPresencaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPresencaUpdate: (presenca: any) => void
  presenca: any
}

export function EditPresencaModal({ open, onOpenChange, onPresencaUpdate, presenca }: EditPresencaModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    horarioEntrada: "",
    horarioSaida: "",
    status: "Presente",
    observacoes: ""
  })

  useEffect(() => {
    if (presenca) {
      setFormData({
        horarioEntrada: presenca.horarioEntrada || "",
        horarioSaida: presenca.horarioSaida || "",
        status: presenca.status || "Presente",
        observacoes: presenca.observacoes || ""
      })
    }
  }, [presenca])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.status === "Presente" && !formData.horarioEntrada) {
      toast({
        title: "Erro",
        description: "Informe o horário de entrada para presença confirmada",
        variant: "destructive"
      })
      return
    }

    const updatedPresenca = {
      ...presenca,
      ...formData
    }

    onPresencaUpdate(updatedPresenca)
    
    toast({
      title: "Sucesso",
      description: "Presença atualizada com sucesso!"
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
            Editar Presença
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Usuário:</span> {presenca?.usuario}
            </div>
            <div className="text-sm">
              <span className="font-medium">Evento:</span> {presenca?.evento}
            </div>
            <div className="text-sm">
              <span className="font-medium">Data:</span> {presenca?.data}
            </div>
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
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
