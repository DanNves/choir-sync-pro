import React, { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useTeams } from "@/hooks/useTeams"
import { useProfiles } from "@/hooks/useProfiles"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ConditionalRender } from "@/components/ConditionalRender"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { 
  Music, 
  Users, 
  Plus,
  Crown,
  Star,
  TrendingUp,
  MoreHorizontal,
  Edit,
  UserPlus,
  Settings
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateTeamModal } from "@/components/team/CreateTeamModal"
import { EditTeamModal } from "@/components/team/EditTeamModal"
import { AddMemberModal } from "@/components/team/AddMemberModal"
import { TeamSettingsModal } from "@/components/team/TeamSettingsModal"

// Mock users data - in a real app this would come from an API
const mockUsers = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao.silva@email.com",
    papel: "Músico",
    local: "Centro - São Paulo - SP - Brasil",
    status: "Ativo",
    instrumento: "Violão",
    ultimoAcesso: "Hoje, 14:30"
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria.santos@email.com", 
    papel: "Organista",
    local: "Centro - Salvador - BA - Brasil",
    status: "Ativo",
    instrumento: "Órgão",
    ultimoAcesso: "Ontem, 19:45"
  },
  {
    id: 3,
    nome: "Pedro Costa",
    email: "pedro.costa@email.com",
    papel: "Ancião",
    local: "Norte - Rio de Janeiro - RJ - Brasil",
    status: "Ativo",  // Changed to Active for demo
    instrumento: "Vocal",  // Changed for demo
    ultimoAcesso: "2 dias atrás"
  },
  {
    id: 4,
    nome: "Ana Oliveira",
    email: "ana.oliveira@email.com",
    papel: "Instrutor",
    local: "Centro - Belo Horizonte - MG - Brasil", 
    status: "Ativo",
    instrumento: "Piano",
    ultimoAcesso: "Hoje, 16:20"
  },
  {
    id: 5,
    nome: "Carlos Lima",
    email: "carlos.lima@email.com",
    papel: "Músico",
    local: "Sul - Porto Alegre - RS - Brasil",
    status: "Ativo",
    instrumento: "Violino",
    ultimoAcesso: "Hoje, 18:00"
  },
  {
    id: 6,
    nome: "Fernanda Rocha",
    email: "fernanda.rocha@email.com",
    papel: "Encarregado",
    local: "Centro - Brasília - DF - Brasil",
    status: "Ativo",
    instrumento: "Flauta",
    ultimoAcesso: "Ontem, 15:30"
  },
  {
    id: 7,
    nome: "Roberto Mendes",
    email: "roberto.mendes@email.com",
    papel: "Músico",
    local: "Norte - Fortaleza - CE - Brasil",
    status: "Ativo",
    instrumento: "Bateria",
    ultimoAcesso: "Hoje, 12:45"
  },
  {
    id: 8,
    nome: "Juliana Alves",
    email: "juliana.alves@email.com",
    papel: "Músico",
    local: "Centro - Recife - PE - Brasil",
    status: "Ativo",
    instrumento: "Vocal",
    ultimoAcesso: "Hoje, 20:10"
  }
]

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
  status: string
  ultimoEnsaio: string
  proximoEvento: string
}

const Equipes = () => {
  const { toast } = useToast()
  const { teams, isLoading, createTeam, updateTeam, addMember, removeMember } = useTeams()
  const { profiles } = useProfiles()
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)

  const mockUsers = profiles.map((profile: any) => ({
    id: profile.id,
    nome: profile.nome,
    instrumento: profile.instrumento || 'Não possui',
    email: profile.id,
    papel: profile.user_roles?.[0]?.role || 'candidato',
    status: 'Ativo'
  }))

  const equipes = teams.map((team: any) => ({
    id: team.id,
    name: team.nome,
    leaderId: team.instrutor_id,
    limit: 15,
    members: team.team_members?.map((tm: any) => ({
      userId: tm.user_id,
      nome: tm.profiles?.nome || 'Desconhecido',
      instrumento: tm.profiles?.instrumento || 'Não possui'
    })) || [],
    description: team.descricao,
    status: "Ativa",
    ultimoEnsaio: "Hoje",
    proximoEvento: "A definir"
  }))

  const handleTeamCreate = (teamData: any) => {
    createTeam({
      nome: teamData.name,
      tipo: 'musical',
      descricao: teamData.description,
      instrutor_id: teamData.leaderId,
      localidade: 'Central'
    })
  }

  const handleTeamUpdate = (updatedTeam: any) => {
    updateTeam({
      id: updatedTeam.id,
      nome: updatedTeam.name,
      descricao: updatedTeam.description,
      instrutor_id: updatedTeam.leaderId
    })
  }

  const handleAddMembers = (memberIds: any[]) => {
    if (!selectedTeam) return

    memberIds.forEach(userId => {
      addMember({
        team_id: selectedTeam.id,
        user_id: userId
      })
    })
  }

  const openEditModal = (team: Team) => {
    setSelectedTeam(team)
    setEditModalOpen(true)
  }

  const openAddMemberModal = (team: Team) => {
    setSelectedTeam(team)
    setAddMemberModalOpen(true)
  }

  const openSettingsModal = (team: Team) => {
    setSelectedTeam(team)
    setSettingsModalOpen(true)
  }

  // Statistics calculations
  const totalMembers = equipes.reduce((acc, team) => acc + team.members.length, 0)
  const totalLeaders = equipes.length
  const averagePerformance = 91.2 // Mock value

  return (
    <ProtectedRoute resource="equipes">
      <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Gerenciamento de Equipes
                  </h1>
                  <p className="text-muted-foreground">
                    Organize grupos musicais e acompanhe o desempenho das equipes
                  </p>
                </div>
                <ConditionalRender permission="manage_users">
                  <Button 
                    className="gap-2" 
                    onClick={() => setCreateModalOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Nova Equipe
                  </Button>
                </ConditionalRender>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Equipes Ativas</p>
                        <p className="text-2xl font-bold text-foreground">{equipes.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Membros</p>
                        <p className="text-2xl font-bold text-foreground">{totalMembers}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-warning" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Desempenho Médio</p>
                        <p className="text-2xl font-bold text-foreground">{averagePerformance}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Crown className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Líderes</p>
                        <p className="text-2xl font-bold text-foreground">{totalLeaders}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Teams Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {equipes.map((equipe) => {
                  const leader = mockUsers.find(u => u.id === equipe.leaderId)
                  const instrumentos = [...new Set(equipe.members.map(m => m.instrumento))] as string[]
                  
                  return (
                    <Card key={equipe.id} className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-lg">{equipe.name}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="default">
                                {equipe.status}
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                <Users className="w-3 h-3" />
                                {equipe.members.length}/{equipe.limit} membros
                              </Badge>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="gap-2" 
                                onClick={() => openEditModal(equipe)}
                              >
                                <Edit className="w-4 h-4" />
                                Editar Equipe
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2"
                                onClick={() => openAddMemberModal(equipe)}
                              >
                                <UserPlus className="w-4 h-4" />
                                Adicionar Membro
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2"
                                onClick={() => openSettingsModal(equipe)}
                              >
                                <Settings className="w-4 h-4" />
                                Configurações
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Leader */}
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Líder</p>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs bg-warning/10 text-warning">
                                  {leader ? leader.nome.split(' ').map(n => n[0]).join('') : '?'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-foreground">
                                {leader ? leader.nome : 'Líder não encontrado'}
                              </span>
                              <Crown className="w-4 h-4 text-warning" />
                            </div>
                          </div>

                          {/* Instruments */}
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Instrumentos ({instrumentos.length})
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {instrumentos.slice(0, 3).map((instrumento) => (
                                <Badge key={instrumento} variant="secondary" className="text-xs">
                                  {instrumento}
                                </Badge>
                              ))}
                              {instrumentos.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{instrumentos.length - 3} mais
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Members Preview */}
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Membros Recentes</p>
                            <div className="flex -space-x-2">
                              {equipe.members.slice(0, 4).map((member) => (
                                <Avatar key={member.userId} className="w-6 h-6 border-2 border-background">
                                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {member.nome.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {equipe.members.length > 4 && (
                                <div className="w-6 h-6 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">
                                    +{equipe.members.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Events */}
                          <div className="pt-2 border-t">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <p className="text-muted-foreground">Último Ensaio</p>
                                <p className="font-medium">{equipe.ultimoEnsaio}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Próximo Evento</p>
                                <p className="font-medium">{equipe.proximoEvento}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Empty State */}
              {equipes.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma equipe criada</h3>
                    <p className="text-muted-foreground mb-4">
                      Comece criando sua primeira equipe musical
                    </p>
                    <Button onClick={() => setCreateModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeira Equipe
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <CreateTeamModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onTeamCreate={handleTeamCreate}
        users={mockUsers}
      />

      <EditTeamModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onTeamUpdate={handleTeamUpdate}
        users={mockUsers}
        team={selectedTeam}
      />

      <AddMemberModal
        open={addMemberModalOpen}
        onOpenChange={setAddMemberModalOpen}
        onAddMembers={handleAddMembers}
        users={mockUsers}
        team={selectedTeam}
      />

      <TeamSettingsModal
        open={settingsModalOpen}
        onOpenChange={setSettingsModalOpen}
        team={selectedTeam}
        users={mockUsers}
        onEditTeam={() => {
          setSettingsModalOpen(false)
          openEditModal(selectedTeam!)
        }}
        onAddMember={() => {
          setSettingsModalOpen(false)
          openAddMemberModal(selectedTeam!)
        }}
      />
      </SidebarProvider>
    </ProtectedRoute>
  )
}

export default Equipes;