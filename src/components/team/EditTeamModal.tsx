import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Crown, X } from "lucide-react"

interface Team {
  id: number
  nome: string
  tipo?: string
  lider: string
  liderId?: number
  membros: number
  members?: any[]
  instrumentos: string[]
  desempenho: number
  status: string
  ultimoEnsaio: string
  proximoEvento: string
  descricao?: string
  limiteParticipantes?: number
  dataCriacao?: string
}

interface EditTeamModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateTeam: (team: Team) => void
  team: Team | null
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({
  open,
  onOpenChange,
  onUpdateTeam,
  team
}) => {
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    limiteParticipantes: 20,
    tipoEquipe: '',
    status: 'Ativa'
  })

  const tiposEquipe = [
    'Coral Juvenil',
    'Coral Adulto', 
    'Banda de Instrumentistas',
    'Orquestra',
    'Grupo de Louvor',
    'Conjunto Musical'
  ]

  const statusOptions = [
    'Ativa',
    'Inativa',
    'Em Formação',
    'Pausada'
  ]

  useEffect(() => {
    if (team) {
      setFormData({
        nome: team.nome,
        descricao: team.descricao || '',
        limiteParticipantes: team.limiteParticipantes || 20,
        tipoEquipe: team.tipo || '',
        status: team.status
      })
    }
  }, [team])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!team) return

    // Validações
    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome da equipe é obrigatório",
        variant: "destructive"
      })
      return
    }

    if (!formData.tipoEquipe) {
      toast({
        title: "Erro",
        description: "Tipo de equipe é obrigatório",
        variant: "destructive"
      })
      return
    }

    const updatedTeam: Team = {
      ...team,
      nome: formData.nome,
      tipo: formData.tipoEquipe,
      descricao: formData.descricao,
      limiteParticipantes: formData.limiteParticipantes,
      status: formData.status
    }

    onUpdateTeam(updatedTeam)
    
    toast({
      title: "Sucesso",
      description: "Equipe atualizada com sucesso!",
    })

    onOpenChange(false)
  }

  if (!team) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Equipe</DialogTitle>
            <DialogDescription>
              Atualize as informações da equipe
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Equipe *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Coral Juvenil"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Equipe *</Label>
                <Select 
                  value={formData.tipoEquipe} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tipoEquipe: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposEquipe.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="limite">Limite de Participantes</Label>
                <Input
                  id="limite"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.limiteParticipantes}
                  onChange={(e) => setFormData(prev => ({ ...prev, limiteParticipantes: parseInt(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status da Equipe</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva os objetivos e características da equipe..."
                rows={3}
              />
            </div>

            {/* Informações atuais da equipe */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Informações Atuais</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Líder:</span>
                  <p className="font-medium">{team.lider}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Membros:</span>
                  <p className="font-medium">{team.membros} participantes</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Instrumentos:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {team.instrumentos.map(instrumento => (
                      <Badge key={instrumento} variant="outline" className="text-xs">
                        {instrumento}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTeamModal