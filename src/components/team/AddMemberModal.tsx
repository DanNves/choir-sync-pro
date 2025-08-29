import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Crown, Users as UsersIcon } from "lucide-react"

interface User {
  id: number
  nome: string
  email: string
  papel: string
  instrumento: string
  local: string
  status: string
}

interface Team {
  id: number
  nome: string
  members?: any[]
  limiteParticipantes?: number
}

interface AddMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMember: (teamId: number, member: any) => void
  team: Team | null
  availableUsers: User[]
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  open,
  onOpenChange,
  onAddMember,
  team,
  availableUsers
}) => {
  const { toast } = useToast()
  
  const [searchUser, setSearchUser] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [memberRole, setMemberRole] = useState<'leader' | 'member'>('member')
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([])

  const instrumentosDisponiveis = [
    'Vocal', 'Piano', 'Violão', 'Guitarra', 'Baixo', 'Bateria', 
    'Teclado', 'Órgão', 'Violino', 'Viola', 'Violoncelo', 'Flauta',
    'Clarinete', 'Saxofone', 'Trompete', 'Trombone'
  ]

  // Filtrar usuários que não estão na equipe atual
  const currentMemberIds = team?.members?.map(m => m.userId) || []
  const filteredUsers = availableUsers.filter(user =>
    user.nome.toLowerCase().includes(searchUser.toLowerCase()) &&
    !currentMemberIds.includes(user.id) &&
    user.status === 'Ativo'
  )

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    // Auto-adicionar instrumento do usuário se disponível
    if (user.instrumento && user.instrumento !== 'Não possui') {
      setSelectedInstruments([user.instrumento])
    }
    setSearchUser('')
  }

  const handleInstrumentChange = (instrumento: string, checked: boolean) => {
    if (checked) {
      setSelectedInstruments(prev => [...prev, instrumento])
    } else {
      setSelectedInstruments(prev => prev.filter(i => i !== instrumento))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!team || !selectedUser) return

    // Validações
    if (selectedInstruments.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um instrumento para o membro",
        variant: "destructive"
      })
      return
    }

    // Verificar limite de participantes
    const currentMemberCount = team.members?.length || 0
    const limite = team.limiteParticipantes || 20
    
    if (currentMemberCount >= limite) {
      toast({
        title: "Erro",
        description: `Esta equipe já atingiu o limite máximo de ${limite} participantes`,
        variant: "destructive"
      })
      return
    }

    const newMember = {
      userId: selectedUser.id,
      name: selectedUser.nome,
      email: selectedUser.email,
      role: memberRole,
      instruments: selectedInstruments,
      dataIngresso: new Date().toISOString()
    }

    onAddMember(team.id, newMember)
    
    toast({
      title: "Sucesso",
      description: `${selectedUser.nome} foi adicionado à equipe como ${memberRole === 'leader' ? 'líder' : 'membro'}!`,
    })

    // Reset form
    setSelectedUser(null)
    setMemberRole('member')
    setSelectedInstruments([])
    setSearchUser('')
    onOpenChange(false)
  }

  if (!team) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Membro à Equipe</DialogTitle>
            <DialogDescription>
              Adicione um novo membro à equipe "{team.nome}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-6">
            {/* Informações da equipe */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UsersIcon className="w-4 h-4" />
                <span>
                  Membros atuais: {team.members?.length || 0}/{team.limiteParticipantes || 20}
                </span>
              </div>
            </div>

            {/* Seleção de usuário */}
            {!selectedUser ? (
              <div className="space-y-3">
                <Label>Buscar Usuário</Label>
                <Input
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Digite o nome do usuário..."
                />
                
                {searchUser && filteredUsers.length > 0 && (
                  <div className="border rounded-lg max-h-60 overflow-y-auto">
                    {filteredUsers.slice(0, 10).map(user => (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="text-sm">
                              {user.nome.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.nome}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.papel} • {user.instrumento}
                            </p>
                            <p className="text-xs text-muted-foreground">{user.local}</p>
                          </div>
                        </div>
                        <Button type="button" size="sm">
                          Selecionar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {searchUser && filteredUsers.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum usuário encontrado disponível para adicionar
                  </p>
                )}
              </div>
            ) : (
              <>
                {/* Usuário selecionado */}
                <div className="space-y-3">
                  <Label>Usuário Selecionado</Label>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-sm">
                          {selectedUser.nome.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedUser.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedUser.papel} • {selectedUser.instrumento}
                        </p>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedUser(null)
                        setSelectedInstruments([])
                      }}
                    >
                      Alterar
                    </Button>
                  </div>
                </div>

                {/* Papel na equipe */}
                <div className="space-y-3">
                  <Label>Papel na Equipe</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={memberRole === 'member' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMemberRole('member')}
                    >
                      Membro
                    </Button>
                    <Button
                      type="button"
                      variant={memberRole === 'leader' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMemberRole('leader')}
                      className="gap-1"
                    >
                      <Crown className="w-4 h-4" />
                      Líder
                    </Button>
                  </div>
                  {memberRole === 'leader' && (
                    <p className="text-xs text-muted-foreground">
                      Definir como líder removerá a liderança dos outros membros
                    </p>
                  )}
                </div>

                {/* Instrumentos */}
                <div className="space-y-3">
                  <Label>Instrumentos *</Label>
                  <p className="text-sm text-muted-foreground">
                    Selecione os instrumentos que este membro irá tocar na equipe
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                    {instrumentosDisponiveis.map(instrumento => (
                      <div key={instrumento} className="flex items-center space-x-2">
                        <Checkbox
                          id={instrumento}
                          checked={selectedInstruments.includes(instrumento)}
                          onCheckedChange={(checked) => 
                            handleInstrumentChange(instrumento, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={instrumento}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {instrumento}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedInstruments.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedInstruments.map(instrumento => (
                        <Badge key={instrumento} variant="secondary">
                          {instrumento}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedUser}>
              Adicionar Membro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddMemberModal