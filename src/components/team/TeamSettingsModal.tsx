import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Users, 
  Crown, 
  Music, 
  UserPlus, 
  UserMinus,
  TrendingUp,
  Shield,
  Edit2
} from "lucide-react"

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

interface TeamSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team: Team | null
  users: User[]
  onEditTeam: () => void
  onAddMember: () => void
}

export const TeamSettingsModal: React.FC<TeamSettingsModalProps> = ({
  open,
  onOpenChange,
  team,
  users,
  onEditTeam,
  onAddMember
}) => {
  if (!team) return null

  const leader = users.find(u => u.id === team.leaderId)
  const teamMembers = team.members.map(member => ({
    ...member,
    user: users.find(u => u.id === member.userId)!
  })).filter(m => m.user)

  // Estatísticas da equipe
  const stats = {
    totalMembers: team.members.length,
    availableSlots: team.limit - team.members.length,
    instruments: [...new Set(team.members.map(m => m.instrumento))].length,
    roles: [...new Set(teamMembers.map(m => m.user.papel))].length
  }

  const instrumentGroups = team.members.reduce((acc, member) => {
    const instrument = member.instrumento
    if (!acc[instrument]) {
      acc[instrument] = []
    }
    acc[instrument].push(member)
    return acc
  }, {} as Record<string, TeamMember[]>)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações da Equipe
          </DialogTitle>
          <DialogDescription>
            {team.name} - Gerencie membros, instrumentos e configurações
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="members">Membros</TabsTrigger>
            <TabsTrigger value="instruments">Instrumentos</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Aba de Membros */}
          <TabsContent value="members" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Membros da Equipe</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onAddMember}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Adicionar Membro
                </Button>
                <Button variant="outline" size="sm" onClick={onEditTeam}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar Equipe
                </Button>
              </div>
            </div>

            {/* Líder */}
            {leader && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Crown className="w-4 h-4 text-warning" />
                    Líder da Equipe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-warning/10 text-warning">
                          {leader.nome.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{leader.nome}</p>
                        <p className="text-sm text-muted-foreground">{leader.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="mb-1">
                        {leader.papel}
                      </Badge>
                      <br />
                      <Badge variant="outline">
                        {leader.instrumento}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Membros */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Membros ({team.members.length - 1})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers
                    .filter(member => member.userId !== team.leaderId)
                    .map((member) => (
                    <div key={member.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {member.user.nome.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{member.user.nome}</p>
                          <p className="text-xs text-muted-foreground">{member.user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-1 text-xs">
                          {member.user.papel}
                        </Badge>
                        <br />
                        <Badge variant="outline" className="text-xs">
                          {member.instrumento}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {teamMembers.filter(m => m.userId !== team.leaderId).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum membro além do líder
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Instrumentos */}
          <TabsContent value="instruments" className="space-y-4">
            <h3 className="text-lg font-semibold">Instrumentos por Categoria</h3>
            
            <div className="grid gap-4">
              {Object.entries(instrumentGroups).map(([instrument, members]) => (
                <Card key={instrument}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      {instrument} ({members.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {members.map((member) => {
                        const user = users.find(u => u.id === member.userId)!
                        const isLeader = member.userId === team.leaderId
                        
                        return (
                          <div key={member.userId} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {user.nome.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{user.nome}</span>
                              {isLeader && (
                                <Crown className="w-3 h-3 text-warning" />
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {user.papel}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Aba de Estatísticas */}
          <TabsContent value="stats" className="space-y-4">
            <h3 className="text-lg font-semibold">Estatísticas da Equipe</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Membros</p>
                      <p className="text-xl font-bold">{stats.totalMembers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                      <UserPlus className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vagas</p>
                      <p className="text-xl font-bold">{stats.availableSlots}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Music className="w-4 h-4 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Instrumentos</p>
                      <p className="text-xl font-bold">{stats.instruments}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Papéis</p>
                      <p className="text-xl font-bold">{stats.roles}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Distribuição de Papéis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Distribuição de Papéis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(
                    teamMembers.reduce((acc, member) => {
                      const role = member.user.papel
                      acc[role] = (acc[role] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                  ).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between">
                      <span className="text-sm">{role}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Configurações */}
          <TabsContent value="settings" className="space-y-4">
            <h3 className="text-lg font-semibold">Configurações Gerais</h3>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Informações da Equipe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Nome:</span>
                  <span className="text-sm">{team.name}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Limite de participantes:</span>
                  <span className="text-sm">{team.limit}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Vagas disponíveis:</span>
                  <span className="text-sm">{stats.availableSlots}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">ID da equipe:</span>
                  <span className="text-sm font-mono">{team.id}</span>
                </div>
                {team.description && (
                  <>
                    <Separator />
                    <div>
                      <span className="text-sm font-medium">Descrição:</span>
                      <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onEditTeam}>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar Configurações
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}