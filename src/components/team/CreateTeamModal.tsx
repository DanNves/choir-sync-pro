import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Plus, X, Crown, Users as UsersIcon } from "lucide-react"

interface User {
  id: number
  nome: string
  email: string
  papel: string
  instrumento: string
  local: string
  status: string
}

interface TeamMember {
  userId: number
  name: string
  role: 'leader' | 'member'
  instruments: string[]
}

interface CreateTeamModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTeam: (team: any) => void
  availableUsers: User[]
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  open,
  onOpenChange,
  onCreateTeam,
  availableUsers
}) => {
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    limiteParticipantes: 20,
    tipoEquipe: ''
  })

  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([])
  const [searchUser, setSearchUser] = useState('')

  const instrumentosDisponiveis = [
    'Vocal', 'Piano', 'Violão', 'Guitarra', 'Baixo', 'Bateria', 
    'Teclado', 'Órgão', 'Violino', 'Viola', 'Violoncelo', 'Flauta',
    'Clarinete', 'Saxofone', 'Trompete', 'Trombone'
  ]

  const tiposEquipe = [
    'Coral Juvenil',
    'Coral Adulto', 
    'Banda de Instrumentistas',
    'Orquestra',
    'Grupo de Louvor',
    'Conjunto Musical'
  ]

  const filteredUsers = availableUsers.filter(user =>
    user.nome.toLowerCase().includes(searchUser.toLowerCase()) &&
    !selectedMembers.some(member => member.userId === user.id)
  )

  const addMember = (user: User, role: 'leader' | 'member' = 'member') => {
    const newMember: TeamMember = {
      userId: user.id,
      name: user.nome,
      role,
      instruments: user.instrumento !== 'Não possui' ? [user.instrumento] : []
    }

    // Se está definindo como líder, remove liderança de outros
    if (role === 'leader') {
      setSelectedMembers(prev => [
        ...prev.map(m => ({ ...m, role: 'member' as const })),
        newMember
      ])
    } else {
      setSelectedMembers(prev => [...prev, newMember])
    }
    setSearchUser('')
  }

  const removeMember = (userId: number) => {
    setSelectedMembers(prev => prev.filter(m => m.userId !== userId))
  }

  const toggleMemberRole = (userId: number) => {
    setSelectedMembers(prev => {
      return prev.map(member => {
        if (member.userId === userId) {
          const newRole: 'leader' | 'member' = member.role === 'leader' ? 'member' : 'leader'
          return { ...member, role: newRole }
        }
        // Se outro membro está se tornando líder, remove liderança deste
        const targetMember = prev.find(m => m.userId === userId)
        if (targetMember && targetMember.role === 'member') {
          return { ...member, role: 'member' as const }
        }
        return member
      })
    })
  }

  const updateMemberInstruments = (userId: number, instruments: string[]) => {
    setSelectedMembers(prev => prev.map(member =>
      member.userId === userId 
        ? { ...member, instruments }
        : member
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
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

    if (selectedMembers.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um membro à equipe",
        variant: "destructive"
      })
      return
    }

    const leader = selectedMembers.find(m => m.role === 'leader')
    if (!leader) {
      toast({
        title: "Erro",
        description: "Uma equipe precisa ter pelo menos um líder",
        variant: "destructive"
      })
      return
    }

    // Verificar se todos os membros têm instrumentos
    const membersWithoutInstruments = selectedMembers.filter(m => m.instruments.length === 0)
    if (membersWithoutInstruments.length > 0) {
      toast({
        title: "Erro",
        description: "Todos os membros devem ter pelo menos um instrumento atribuído",
        variant: "destructive"
      })
      return
    }

    if (selectedMembers.length > formData.limiteParticipantes) {
      toast({
        title: "Erro",
        description: `Número de membros não pode exceder o limite de ${formData.limiteParticipantes}`,
        variant: "destructive"
      })
      return
    }

    const newTeam = {
      id: Date.now(),
      nome: formData.nome,
      tipo: formData.tipoEquipe,
      lider: leader.name,
      liderId: leader.userId,
      membros: selectedMembers.length,
      members: selectedMembers,
      instrumentos: [...new Set(selectedMembers.flatMap(m => m.instruments))],
      desempenho: 0,
      status: "Ativa" as const,
      ultimoEnsaio: "Nenhum ainda",
      proximoEvento: "A definir",
      descricao: formData.descricao,
      limiteParticipantes: formData.limiteParticipantes,
      dataCriacao: new Date().toISOString()
    }

    onCreateTeam(newTeam)
    
    toast({
      title: "Sucesso",
      description: "Equipe criada com sucesso!",
    })

    // Reset form
    setFormData({
      nome: '',
      descricao: '',
      limiteParticipantes: 20,
      tipoEquipe: ''
    })
    setSelectedMembers([])
    setSearchUser('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Nova Equipe</DialogTitle>
            <DialogDescription>
              Configure a equipe, adicione membros e defina seus instrumentos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-6">
            {/* Informações básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações da Equipe</h3>
              
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
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva os objetivos e características da equipe..."
                  rows={3}
                />
              </div>
            </div>

            {/* Seleção de membros */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Membros da Equipe</h3>
              
              <div className="space-y-2">
                <Label>Buscar Usuários</Label>
                <Input
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Digite o nome do usuário..."
                />
                
                {searchUser && filteredUsers.length > 0 && (
                  <div className="border rounded-lg p-2 space-y-2 max-h-40 overflow-y-auto">
                    {filteredUsers.slice(0, 5).map(user => (
                      <div key={user.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {user.nome.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.nome}</p>
                            <p className="text-xs text-muted-foreground">{user.papel} • {user.instrumento}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addMember(user, 'member')}
                          >
                            Membro
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => addMember(user, 'leader')}
                          >
                            Líder
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Membros selecionados */}
              {selectedMembers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Membros Selecionados ({selectedMembers.length}/{formData.limiteParticipantes})</Label>
                  </div>
                  
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedMembers.map(member => (
                      <div key={member.userId} className="border rounded-lg p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{member.name}</p>
                              <div className="flex items-center gap-2">
                                {member.role === 'leader' && <Crown className="w-3 h-3 text-yellow-500" />}
                                <Badge variant={member.role === 'leader' ? 'default' : 'secondary'} className="text-xs">
                                  {member.role === 'leader' ? 'Líder' : 'Membro'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => toggleMemberRole(member.userId)}
                            >
                              {member.role === 'leader' ? 'Tornar Membro' : 'Tornar Líder'}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => removeMember(member.userId)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Instrumentos do membro */}
                        <div className="space-y-2">
                          <Label className="text-xs">Instrumentos</Label>
                          <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                            {instrumentosDisponiveis.map(instrumento => (
                              <div key={instrumento} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${member.userId}-${instrumento}`}
                                  checked={member.instruments.includes(instrumento)}
                                  onCheckedChange={(checked) => {
                                    const newInstruments = checked
                                      ? [...member.instruments, instrumento]
                                      : member.instruments.filter(i => i !== instrumento)
                                    updateMemberInstruments(member.userId, newInstruments)
                                  }}
                                />
                                <Label 
                                  htmlFor={`${member.userId}-${instrumento}`}
                                  className="text-xs cursor-pointer"
                                >
                                  {instrumento}
                                </Label>
                              </div>
                            ))}
                          </div>
                          {member.instruments.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {member.instruments.map(instrumento => (
                                <Badge key={instrumento} variant="outline" className="text-xs">
                                  {instrumento}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              Criar Equipe
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTeamModal