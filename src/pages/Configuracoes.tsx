import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Users,
  Shield,
  Bell,
  Database,
  Key,
  Globe,
  Mail,
  Smartphone,
  Save,
  RotateCcw
} from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Configuracoes = () => {
  const usuariosComAcesso = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@email.com",
      papel: "Administrador",
      local: "São Paulo - Central",
      ultimoAcesso: "Hoje, 14:30",
      status: "Ativo"
    },
    {
      id: 2,
      nome: "Maria Santos", 
      email: "maria.santos@email.com",
      papel: "Encarregado Local",
      local: "São Paulo - Central",
      ultimoAcesso: "Ontem, 19:45",
      status: "Ativo"
    },
    {
      id: 3,
      nome: "Pedro Costa",
      email: "pedro.costa@email.com",
      papel: "Instrutor",
      local: "Rio de Janeiro - Norte",
      ultimoAcesso: "2 dias atrás",
      status: "Ativo"
    }
  ]

  const configuracoesSistema = {
    nomeOrganizacao: "Igreja Central",
    emailPrincipal: "admin@igreja.com.br",
    telefone: "+55 11 99999-9999",
    endereco: "Rua da Igreja, 123 - São Paulo/SP",
    fusoHorario: "America/Sao_Paulo",
    idioma: "pt-BR",
    moeda: "BRL"
  }

  const configuracoesFuncionalidades = {
    qrCodeExpiracao: 60,
    presencaAutomatica: true,
    notificacoesEmail: true,
    notificacoesPush: true,
    avaliacaoMinima: 5.0,
    presencaMinimaRanking: 80,
    backupAutomatico: true,
    logAuditoria: true
  }

  return (
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
                    Configurações do Sistema
                  </h1>
                  <p className="text-muted-foreground">
                    Gerencie configurações gerais, permissões e funcionalidades
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Restaurar Padrões
                  </Button>
                  <Button className="gap-2">
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="geral" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                  <TabsTrigger value="geral">Geral</TabsTrigger>
                  <TabsTrigger value="permissoes">Permissões</TabsTrigger>
                  <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
                  <TabsTrigger value="sistema">Sistema</TabsTrigger>
                </TabsList>

                <TabsContent value="geral" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-primary" />
                          Informações da Organização
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome-org">Nome da Organização</Label>
                          <Input 
                            id="nome-org" 
                            defaultValue={configuracoesSistema.nomeOrganizacao}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail Principal</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            defaultValue={configuracoesSistema.emailPrincipal}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input 
                            id="telefone" 
                            defaultValue={configuracoesSistema.telefone}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endereco">Endereço</Label>
                          <Input 
                            id="endereco" 
                            defaultValue={configuracoesSistema.endereco}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="w-5 h-5 text-primary" />
                          Configurações Regionais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Fuso Horário</Label>
                          <Select defaultValue={configuracoesSistema.fusoHorario}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/Sao_Paulo">Brasília (UTC-3)</SelectItem>
                              <SelectItem value="America/Manaus">Manaus (UTC-4)</SelectItem>
                              <SelectItem value="America/Rio_Branco">Rio Branco (UTC-5)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Idioma</Label>
                          <Select defaultValue={configuracoesSistema.idioma}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                              <SelectItem value="en-US">English (US)</SelectItem>
                              <SelectItem value="es-ES">Español</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Moeda</Label>
                          <Select defaultValue={configuracoesSistema.moeda}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BRL">Real (R$)</SelectItem>
                              <SelectItem value="USD">Dólar ($)</SelectItem>
                              <SelectItem value="EUR">Euro (€)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        Configurações de Funcionalidades
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="qr-expiracao">Expiração do QR Code (segundos)</Label>
                            <Input 
                              id="qr-expiracao" 
                              type="number" 
                              defaultValue={configuracoesFuncionalidades.qrCodeExpiracao}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nota-minima">Nota Mínima para Avaliações</Label>
                            <Input 
                              id="nota-minima" 
                              type="number" 
                              step="0.1"
                              defaultValue={configuracoesFuncionalidades.avaliacaoMinima}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="presenca-minima">Presença Mínima p/ Ranking (%)</Label>
                            <Input 
                              id="presenca-minima" 
                              type="number"
                              defaultValue={configuracoesFuncionalidades.presencaMinimaRanking}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="presenca-auto" className="text-sm font-medium">
                              Presença Automática por QR
                            </Label>
                            <Switch 
                              id="presenca-auto" 
                              checked={configuracoesFuncionalidades.presencaAutomatica}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="backup-auto" className="text-sm font-medium">
                              Backup Automático Diário
                            </Label>
                            <Switch 
                              id="backup-auto" 
                              checked={configuracoesFuncionalidades.backupAutomatico}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="log-auditoria" className="text-sm font-medium">
                              Log de Auditoria
                            </Label>
                            <Switch 
                              id="log-auditoria" 
                              checked={configuracoesFuncionalidades.logAuditoria}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="permissoes" className="space-y-6">
                  <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Usuários com Acesso Administrativo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Papel</TableHead>
                            <TableHead>Local</TableHead>
                            <TableHead>Último Acesso</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {usuariosComAcesso.map((usuario) => (
                            <TableRow key={usuario.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium text-foreground">{usuario.nome}</p>
                                  <p className="text-sm text-muted-foreground">{usuario.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  usuario.papel === 'Administrador' ? 'destructive' : 'default'
                                }>
                                  {usuario.papel}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {usuario.local}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {usuario.ultimoAcesso}
                              </TableCell>
                              <TableCell>
                                <Badge variant="default">
                                  {usuario.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">
                                  Editar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="mt-4">
                        <Button className="gap-2">
                          <Users className="w-4 h-4" />
                          Adicionar Usuário Admin
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notificacoes" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-primary" />
                          Notificações por E-mail
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-eventos" className="text-sm font-medium">
                            Novos eventos criados
                          </Label>
                          <Switch id="email-eventos" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-presenca" className="text-sm font-medium">
                            Alertas de presença baixa
                          </Label>
                          <Switch id="email-presenca" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-avaliacoes" className="text-sm font-medium">
                            Novas avaliações disponíveis
                          </Label>
                          <Switch id="email-avaliacoes" checked={false} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-ranking" className="text-sm font-medium">
                            Atualizações de ranking
                          </Label>
                          <Switch id="email-ranking" checked={true} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Smartphone className="w-5 h-5 text-primary" />
                          Notificações Push
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-checkin" className="text-sm font-medium">
                            Lembretes de check-in
                          </Label>
                          <Switch id="push-checkin" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-eventos" className="text-sm font-medium">
                            Início de eventos
                          </Label>
                          <Switch id="push-eventos" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-questionarios" className="text-sm font-medium">
                            Questionários pendentes
                          </Label>
                          <Switch id="push-questionarios" checked={false} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-conquistas" className="text-sm font-medium">
                            Novas conquistas
                          </Label>
                          <Switch id="push-conquistas" checked={true} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="sistema" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Key className="w-5 h-5 text-primary" />
                          Configurações de Segurança
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Tempo de Sessão (minutos)</Label>
                          <Input type="number" defaultValue="480" />
                        </div>
                        <div className="space-y-2">
                          <Label>Tentativas de Login (máximo)</Label>
                          <Input type="number" defaultValue="3" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="auth-2fa" className="text-sm font-medium">
                            Autenticação de 2 Fatores
                          </Label>
                          <Switch id="auth-2fa" checked={false} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="ip-restrict" className="text-sm font-medium">
                            Restrição por IP
                          </Label>
                          <Switch id="ip-restrict" checked={false} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="w-5 h-5 text-primary" />
                          Backup e Manutenção
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Frequência de Backup</Label>
                          <Select defaultValue="diario">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="diario">Diário</SelectItem>
                              <SelectItem value="semanal">Semanal</SelectItem>
                              <SelectItem value="mensal">Mensal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Retenção de Logs (dias)</Label>
                          <Input type="number" defaultValue="90" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="manutencao-auto" className="text-sm font-medium">
                            Manutenção Automática
                          </Label>
                          <Switch id="manutencao-auto" checked={true} />
                        </div>
                        <Button variant="outline" className="w-full gap-2">
                          <Database className="w-4 h-4" />
                          Executar Backup Manual
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Configuracoes;