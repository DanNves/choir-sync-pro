import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Crown, 
  Trash2, 
  UserMinus, 
  Settings, 
  Shield,
  Calendar,
  Clock,
  Users as UsersIcon
} from "lucide-react"

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
  configuracoes?: {
    autoAceiteNovos: boolean
    notificacoes: boolean
    visibilidadePublica: boolean
    avaliacaoAutomatica: boolean
  }
}

interface TeamSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateTeam: (team: Team) => void
  onDeleteTeam: (teamId: number) => void
  onRemoveMember: (teamId: number, memberId: number) => void
  team: Team | null
}

const TeamSettingsModal: React.FC<TeamSettingsModalProps> = ({
  open,
  onOpenChange,
  onUpdateTeam,
  onDeleteTeam,
  onRemoveMember,
  team
}) => {
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState<'geral' | 'membros' | 'configuracoes' | 'avancado'>('geral')
  const [settings, setSettings] = useState({
    autoAceiteNovos: false,
    notificacoes: true,
    visibilidadePublica: true,
    avaliacaoAutomatica: false
  })

  const tabs = [
    { id: 'geral', label: 'Geral', icon: Settings },
    { id: 'membros', label: 'Membros', icon: UsersIcon },
    { id: 'configuracoes', label: 'Configurações', icon: Shield },
    { id: 'avancado', label: 'Avançado', icon: Trash2 }
  ]

  useEffect(() => {
    if (team?.configuracoes) {
      setSettings(team.configuracoes)
    }
  }, [team])

  const handleUpdateSettings = () => {
    if (!team) return

    const updatedTeam: Team = {
      ...team,
      configuracoes: settings
    }

    onUpdateTeam(updatedTeam)
    
    toast({
      title: "Sucesso",
      description: "Configurações atualizadas com sucesso!",
    })
  }

  const handleRemoveMember = (memberId: number, memberName: string) => {
    if (!team) return
    
    onRemoveMember(team.id, memberId)
    
    toast({
      title: "Membro removido",
      description: `${memberName} foi removido da equipe`,
    })
  }

  const handleDeleteTeam = () => {
    if (!team) return
    
    onDeleteTeam(team.id)
    onOpenChange(false)
    
    toast({
      title: "Equipe excluída",
      description: "A equipe foi excluída permanentemente",
      variant: "destructive"
    })
  }

  if (!team) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Configurações da Equipe</DialogTitle>
          <DialogDescription>
            Gerencie todas as configurações de "{team.nome}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-6 py-6">
          {/* Sidebar de navegação */}
          <div className="w-48 space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              )
            })}
          </div>

          {/* Conteúdo das abas */}
          <div className="flex-1 space-y-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'geral' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informações Gerais</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Nome da Equipe</Label>
                      <p className="font-medium">{team.nome}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Tipo</Label>
                      <p className="font-medium">{team.tipo || 'Não definido'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Status</Label>
                      <Badge variant={team.status === 'Ativa' ? 'default' : 'secondary'}>
                        {team.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Membros</Label>
                      <p className="font-medium">{team.membros}/{team.limiteParticipantes || 20}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">Descrição</Label>
                    <p className="text-sm mt-1">{team.descricao || 'Nenhuma descrição fornecida'}</p>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">Instrumentos</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {team.instrumentos.map(instrumento => (
                        <Badge key={instrumento} variant="outline" className="text-xs">
                          {instrumento}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Atividades Recentes</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm">Último Ensaio</p>
                        <p className="text-sm text-muted-foreground">{team.ultimoEnsaio}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm">Próximo Evento</p>
                        <p className="text-sm text-muted-foreground">{team.proximoEvento}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'membros' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Membros da Equipe</h3>
                  <Badge variant="outline">
                    {team.members?.length || 0} membros
                  </Badge>
                </div>

                <div className="space-y-3">
                  {team.members && team.members.length > 0 ? (
                    team.members.map(member => (
                      <div key={member.userId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="text-sm">
                              {member.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{member.name}</p>
                              {member.role === 'leader' && (
                                <Crown className="w-4 h-4 text-yellow-500" />
                              )}
                              <Badge variant={member.role === 'leader' ? 'default' : 'secondary'} className="text-xs">
                                {member.role === 'leader' ? 'Líder' : 'Membro'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {member.instruments?.map((instrument: string) => (
                                <Badge key={instrument} variant="outline" className="text-xs">
                                  {instrument}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1">
                              <UserMinus className="w-4 h-4" />
                              Remover
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover membro</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza de que deseja remover {member.name} da equipe? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleRemoveMember(member.userId, member.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum membro registrado nesta equipe
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'configuracoes' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Configurações da Equipe</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto-aceitar novos membros</Label>
                      <p className="text-sm text-muted-foreground">
                        Aceitar automaticamente solicitações para entrar na equipe
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoAceiteNovos}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, autoAceiteNovos: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Notificações</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações sobre atividades da equipe
                      </p>
                    </div>
                    <Switch
                      checked={settings.notificacoes}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, notificacoes: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Visibilidade pública</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir que outros usuários vejam informações da equipe
                      </p>
                    </div>
                    <Switch
                      checked={settings.visibilidadePublica}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, visibilidadePublica: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Avaliação automática</Label>
                      <p className="text-sm text-muted-foreground">
                        Calcular automaticamente o desempenho baseado na presença
                      </p>
                    </div>
                    <Switch
                      checked={settings.avaliacaoAutomatica}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, avaliacaoAutomatica: checked }))
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleUpdateSettings} className="w-full">
                  Salvar Configurações
                </Button>
              </div>
            )}

            {activeTab === 'avancado' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-destructive">Zona de Perigo</h3>
                
                <div className="space-y-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="space-y-2">
                    <h4 className="font-medium text-destructive">Excluir Equipe</h4>
                    <p className="text-sm text-muted-foreground">
                      Esta ação excluirá permanentemente a equipe e todos os dados relacionados. 
                      Esta operação não pode ser desfeita.
                    </p>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="w-4 h-4" />
                        Excluir Equipe
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir equipe permanentemente</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza de que deseja excluir a equipe "{team.nome}"? 
                          Esta ação não pode ser desfeita e todos os dados da equipe serão perdidos permanentemente,
                          incluindo histórico de ensaios, avaliações e configurações.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteTeam}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Sim, excluir equipe
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TeamSettingsModal