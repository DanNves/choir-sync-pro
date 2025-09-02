import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Crown, Music, X, Users, Edit } from "lucide-react"

interface User {
  id: number
  nome: string
  email: string
  papel: string
  instrumento: string
  status: string
}

interface TeamMember {
  userId: number
  nome: string
  instrumento: string
}

interface Team {
  id: string
  name: string
  leaderId: number
  limit: number
  members: TeamMember[]
  description?: string
}

interface EditTeamModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTeamUpdate: (team: Team) => void
  users: User[]
  team: Team | null
}

export const EditTeamModal: React.FC<EditTeamModalProps> = ({
  open,
  onOpenChange,
  onTeamUpdate,
  users,
  team
}) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    leaderId: '',
    limit: 10,
    description: ''
  })
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])

  // Sincronizar com dados da equipe quando abrir modal
  useEffect(() => {
    if (team && open) {
      setFormData({
        name: team.name,
        leaderId: team.leaderId.toString(),
        limit: team.limit,
        description: team.description || ''
      })
      setSelectedMembers(team.members.map(m => m.userId))
    }
  }, [team, open])

  const activeUsers = users.filter(user => user.status === "Ativo")

  const handleMemberToggle = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedMembers(prev => [...prev, userId])
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== userId))
      // Se remover o líder, limpar seleção de líder
      if (parseInt(formData.leaderId) === userId) {
        setFormData(prev => ({ ...prev, leaderId: '' }))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!team) return

    // Validações
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da equipe é obrigatório",
        variant: "destructive"
      })
      return
    }

    if (!formData.leaderId) {
      toast({
        title: "Erro", 
        description: "É necessário definir um líder para a equipe",
        variant: "destructive"
      })
      return
    }

    if (selectedMembers.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um membro para a equipe",
        variant: "destructive"
      })
      return
    }

    if (!selectedMembers.includes(parseInt(formData.leaderId))) {
      toast({
        title: "Erro",
        description: "O líder deve estar incluído na lista de membros",
        variant: "destructive"
      })
      return
    }

    if (selectedMembers.length > formData.limit) {
      toast({
        title: "Erro",
        description: `O número de membros não pode exceder o limite de ${formData.limit}`,
        variant: "destructive"
      })
      return
    }

    // Criar dados da equipe atualizada
    const members: TeamMember[] = selectedMembers.map(userId => {
      const user = users.find(u => u.id === userId)!
      return {
        userId: user.id,
        nome: user.nome,
        instrumento: user.instrumento
      }
    })

    const updatedTeam: Team = {
      ...team,
      name: formData.name,
      leaderId: parseInt(formData.leaderId),
      limit: formData.limit,
      members,
      description: formData.description
    }

    onTeamUpdate(updatedTeam)
    
    toast({
      title: "Sucesso",
      description: "Equipe atualizada com sucesso!",
    })

    onOpenChange(false)
  }

  const selectedMembersUsers = selectedMembers.map(id => 
    users.find(user => user.id === id)!
  ).filter(Boolean)

  const eligibleLeaders = selectedMembersUsers.filter(user =>
    ['Músico', 'Organista', 'Ancião', 'Encarregado', 'Instrutor'].includes(user.papel)
  )

  if (!team) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editar Equipe
            </DialogTitle>
            <DialogDescription>
              Modifique os dados e membros da equipe
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-6">
            {/* Nome da Equipe */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Equipe *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Coral Juvenil, Banda de Louvor..."
                required
              />
            </div>

            {/* Limite de Participantes */}
            <div className="space-y-2">
              <Label htmlFor="limit">Limite de Participantes *</Label>
              <Select 
                value={formData.limit.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, limit: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 participantes</SelectItem>
                  <SelectItem value="10">10 participantes</SelectItem>
                  <SelectItem value="15">15 participantes</SelectItem>
                  <SelectItem value="20">20 participantes</SelectItem>
                  <SelectItem value="30">30 participantes</SelectItem>
                  <SelectItem value="50">50 participantes</SelectItem>
                  <SelectItem value="100">100 participantes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Seleção de Membros */}
            <div className="space-y-3">
              <Label>Membros da Equipe *</Label>
              <p className="text-sm text-muted-foreground">
                Modifique os usuários que farão parte desta equipe
              </p>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                <div className="space-y-3">
                  {activeUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={selectedMembers.includes(user.id)}
                          onCheckedChange={(checked) => 
                            handleMemberToggle(user.id, checked as boolean)
                          }
                        />
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {user.nome.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.nome}</p>
                          <p className="text-xs text-muted-foreground">{user.papel}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {user.instrumento}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Membros Selecionados */}
              {selectedMembers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Membros selecionados ({selectedMembers.length}/{formData.limit})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMembersUsers.map((user) => (
                      <Badge key={user.id} variant="secondary" className="gap-2">
                        <Users className="w-3 h-3" />
                        {user.nome}
                        <button
                          type="button"
                          onClick={() => handleMemberToggle(user.id, false)}
                          className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Seleção do Líder */}
            {selectedMembers.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="leader">Líder da Equipe *</Label>
                <Select 
                  value={formData.leaderId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, leaderId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o líder da equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleLeaders.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-warning" />
                          {user.nome} - {user.papel}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva os objetivos e características da equipe..."
                rows={3}
              />
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
              Atualizar Equipe
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}