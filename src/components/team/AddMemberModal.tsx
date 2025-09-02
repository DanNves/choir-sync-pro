import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Users, Search, X } from "lucide-react"

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
}

interface AddMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMembers: (memberIds: number[]) => void
  users: User[]
  team: Team | null
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  open,
  onOpenChange,
  onAddMembers,
  users,
  team
}) => {
  const { toast } = useToast()
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  if (!team) return null

  // Filtrar usuários que não estão na equipe
  const currentMemberIds = team.members.map(m => m.userId)
  const availableUsers = users.filter(user => 
    user.status === "Ativo" && !currentMemberIds.includes(user.id)
  )

  // Filtrar por busca
  const filteredUsers = availableUsers.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.papel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.instrumento.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleMemberToggle = (userId: number, checked: boolean) => {
    if (checked) {
      // Verificar se ainda há vagas
      if (team.members.length + selectedMembers.length >= team.limit) {
        toast({
          title: "Limite atingido",
          description: `A equipe já atingiu o limite de ${team.limit} participantes`,
          variant: "destructive"
        })
        return
      }
      setSelectedMembers(prev => [...prev, userId])
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== userId))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedMembers.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um membro para adicionar",
        variant: "destructive"
      })
      return
    }

    // Verificar limite final
    if (team.members.length + selectedMembers.length > team.limit) {
      toast({
        title: "Erro",
        description: `O número total de membros excederia o limite de ${team.limit}`,
        variant: "destructive"
      })
      return
    }

    onAddMembers(selectedMembers)
    
    toast({
      title: "Sucesso",
      description: `${selectedMembers.length} membro(s) adicionado(s) com sucesso!`,
    })

    // Reset
    setSelectedMembers([])
    setSearchTerm("")
    onOpenChange(false)
  }

  const selectedUsers = selectedMembers.map(id => 
    users.find(user => user.id === id)!
  ).filter(Boolean)

  const availableSlots = team.limit - team.members.length
  const remainingSlots = availableSlots - selectedMembers.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Adicionar Membros à Equipe
            </DialogTitle>
            <DialogDescription>
              {team.name} - {availableSlots} vaga(s) disponível(is)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-6">
            {/* Status da equipe */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Membros atuais: {team.members.length}/{team.limit}
                </span>
              </div>
              <Badge variant={remainingSlots > 0 ? "default" : "destructive"}>
                {remainingSlots} vaga(s) restante(s)
              </Badge>
            </div>

            {/* Campo de busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários por nome, email, papel ou instrumento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Lista de usuários disponíveis */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Usuários Disponíveis</span>
                <span className="text-xs text-muted-foreground">
                  {filteredUsers.length} usuário(s) encontrado(s)
                </span>
              </div>
              
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={selectedMembers.includes(user.id)}
                            onCheckedChange={(checked) => 
                              handleMemberToggle(user.id, checked as boolean)
                            }
                            disabled={remainingSlots <= 0 && !selectedMembers.includes(user.id)}
                          />
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {user.nome.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.nome}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-1 text-xs">
                            {user.papel}
                          </Badge>
                          <br />
                          <Badge variant="outline" className="text-xs">
                            {user.instrumento}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {searchTerm ? "Nenhum usuário encontrado com esse termo" : "Nenhum usuário disponível"}
                  </p>
                )}
              </div>
            </div>

            {/* Membros selecionados */}
            {selectedMembers.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Membros selecionados ({selectedMembers.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
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

            {availableSlots === 0 && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  A equipe já atingiu o limite máximo de participantes
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setSelectedMembers([])
                setSearchTerm("")
                onOpenChange(false)
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={selectedMembers.length === 0 || remainingSlots < 0}
            >
              Adicionar {selectedMembers.length > 0 ? `(${selectedMembers.length})` : ''}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}