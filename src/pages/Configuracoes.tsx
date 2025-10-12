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
  RotateCcw,
  MapPin,
  QrCode,
  Clock,
  UserCheck,
  History,
  Trash2,
  Plus,
  Edit
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
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { useProfiles } from "@/hooks/useProfiles"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

const Configuracoes = () => {
  const { user } = useAuth()
  const { profiles, updateProfile } = useProfiles()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    localidade: "",
    regiao: "",
    instrumento: ""
  })

  useEffect(() => {
    if (user) {
      const currentProfile = profiles.find(p => p.id === user.id)
      if (currentProfile) {
        setProfileData({
          nome: currentProfile.nome || "",
          telefone: currentProfile.telefone || "",
          endereco: currentProfile.endereco || "",
          localidade: currentProfile.localidade || "",
          regiao: currentProfile.regiao || "",
          instrumento: currentProfile.instrumento || ""
        })
      }
    }
  }, [user, profiles])

  const handleSaveProfile = () => {
    if (!user) return
    
    updateProfile({
      id: user.id,
      ...profileData
    })
  }

  return (
    <ProtectedRoute resource="configuracoes">
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
                <TabsList className="grid w-full grid-cols-6 lg:w-[800px]">
                  <TabsTrigger value="geral">Geral</TabsTrigger>
                  <TabsTrigger value="permissoes">Permissões</TabsTrigger>
                  <TabsTrigger value="eventos">Eventos</TabsTrigger>
                  <TabsTrigger value="locais">Locais</TabsTrigger>
                  <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
                  <TabsTrigger value="seguranca">Segurança</TabsTrigger>
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
                          <Label htmlFor="nome">Nome Completo</Label>
                          <Input 
                            id="nome" 
                            value={profileData.nome}
                            onChange={(e) => setProfileData(prev => ({ ...prev, nome: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input 
                            id="telefone" 
                            value={profileData.telefone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, telefone: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endereco">Endereço</Label>
                          <Input 
                            id="endereco" 
                            value={profileData.endereco}
                            onChange={(e) => setProfileData(prev => ({ ...prev, endereco: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="localidade">Localidade</Label>
                          <Input 
                            id="localidade" 
                            value={profileData.localidade}
                            onChange={(e) => setProfileData(prev => ({ ...prev, localidade: e.target.value }))}
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
                          <Label htmlFor="regiao">Região</Label>
                          <Input 
                            id="regiao" 
                            value={profileData.regiao}
                            onChange={(e) => setProfileData(prev => ({ ...prev, regiao: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instrumento">Instrumento</Label>
                          <Input 
                            id="instrumento" 
                            value={profileData.instrumento}
                            onChange={(e) => setProfileData(prev => ({ ...prev, instrumento: e.target.value }))}
                          />
                        </div>
                        <Button onClick={handleSaveProfile} className="w-full gap-2">
                          <Save className="w-4 h-4" />
                          Salvar Perfil
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Configurações de Equipes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="limite-membros">Limite de membros por equipe</Label>
                          <Input 
                            id="limite-membros" 
                            type="number" 
                            defaultValue="15"
                            min="1"
                            max="50"
                          />
                          <p className="text-xs text-muted-foreground">
                            Número máximo de membros permitidos por equipe
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="w-5 h-5 text-primary" />
                          Pesos para Ranking
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="peso-presenca">Peso da Presença (%)</Label>
                          <Input 
                            id="peso-presenca" 
                            type="number" 
                            defaultValue="40"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="peso-questionario">Peso dos Questionários (%)</Label>
                          <Input 
                            id="peso-questionario" 
                            type="number" 
                            defaultValue="30"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="peso-avaliacao">Peso da Avaliação Técnica (%)</Label>
                          <Input 
                            id="peso-avaliacao" 
                            type="number" 
                            defaultValue="30"
                            min="0"
                            max="100"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          A soma dos pesos deve ser igual a 100%
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="permissoes" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          Papéis e Permissões
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Administrador</h4>
                              <Badge variant="destructive">Admin</Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-3 h-3" />
                                <span>Acesso total ao sistema</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Settings className="w-3 h-3" />
                                <span>Gerenciar configurações</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-3 h-3" />
                                <span>Gerenciar usuários</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Encarregado Local</h4>
                              <Badge variant="default">Local</Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-3 h-3" />
                                <span>Criar/editar equipes locais</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <QrCode className="w-3 h-3" />
                                <span>Gerenciar presença local</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Database className="w-3 h-3" />
                                <span>Ver relatórios locais</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Instrutor</h4>
                              <Badge variant="outline">Instrutor</Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Bell className="w-3 h-3" />
                                <span>Criar questionários</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-3 h-3" />
                                <span>Avaliar participantes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Key className="w-5 h-5 text-primary" />
                          Acessos Especiais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Maria Santos</span>
                              <Badge variant="outline">Encarregado</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              maria.santos@email.com
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Plus className="w-3 h-3 text-green-500" />
                              <span>Acesso a relatórios globais</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Plus className="w-3 h-3 text-green-500" />
                              <span>Criar eventos regionais</span>
                            </div>
                          </div>

                          <div className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Pedro Costa</span>
                              <Badge variant="outline">Instrutor</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              pedro.costa@email.com
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Plus className="w-3 h-3 text-green-500" />
                              <span>Gerenciar configurações de QR Code</span>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full gap-2">
                          <Users className="w-4 h-4" />
                          Gerenciar Acessos Especiais
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
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
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              <p>Nenhum usuário com acesso especial configurado</p>
                              <p className="text-sm mt-2">Os usuários com acesso especial aparecerão aqui</p>
                            </TableCell>
                          </TableRow>
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

                <TabsContent value="eventos" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <QrCode className="w-5 h-5 text-primary" />
                          Configurações de QR Code
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="qr-expiracao">Tempo de expiração (minutos)</Label>
                          <Input 
                            id="qr-expiracao" 
                            type="number" 
                            defaultValue="5"
                            min="1"
                            max="60"
                          />
                          <p className="text-xs text-muted-foreground">
                            Tempo até o QR Code expirar após ser gerado
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label>Tipo de QR Code</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input type="radio" id="qr-rotativo" name="qr-type" value="rotativo" defaultChecked />
                              <Label htmlFor="qr-rotativo" className="text-sm font-normal">
                                QR Code Rotativo (renova automaticamente)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="radio" id="qr-unico" name="qr-type" value="unico" />
                              <Label htmlFor="qr-unico" className="text-sm font-normal">
                                QR Code Único por evento
                              </Label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="intervalo-rotacao">Intervalo de rotação (minutos)</Label>
                          <Input 
                            id="intervalo-rotacao" 
                            type="number" 
                            defaultValue="3"
                            min="1"
                            max="30"
                          />
                          <p className="text-xs text-muted-foreground">
                            Frequência de renovação automática do QR Code
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-primary" />
                          Configurações de Presença
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="janela-presenca">Janela de presença (minutos)</Label>
                          <Input 
                            id="janela-presenca" 
                            type="number" 
                            defaultValue="10"
                            min="5"
                            max="60"
                          />
                          <p className="text-xs text-muted-foreground">
                            Tempo antes/depois do evento para marcar presença
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="presenca-automatica" className="text-sm font-medium">
                            Presença automática por QR Code
                          </Label>
                          <Switch id="presenca-automatica" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="presenca-gps" className="text-sm font-medium">
                            Validação por GPS
                          </Label>
                          <Switch id="presenca-gps" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="raio-gps">Raio de validação GPS (metros)</Label>
                          <Input 
                            id="raio-gps" 
                            type="number" 
                            defaultValue="100"
                            min="10"
                            max="1000"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="locais" className="space-y-6">
                  <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Gerenciamento de Locais
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-medium">Adicionar Novo Local</h4>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor="nome-local">Nome do Local</Label>
                              <Input id="nome-local" placeholder="Ex: Igreja Central" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bairro">Bairro</Label>
                              <Input id="bairro" placeholder="Ex: Centro" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cidade">Cidade</Label>
                              <Input id="cidade" placeholder="Ex: São Paulo" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="estado">Estado</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o estado" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SP">São Paulo</SelectItem>
                                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                  <SelectItem value="MG">Minas Gerais</SelectItem>
                                  <SelectItem value="PR">Paraná</SelectItem>
                                  <SelectItem value="SC">Santa Catarina</SelectItem>
                                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="regional">Regional</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a regional" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sudeste">Sudeste</SelectItem>
                                  <SelectItem value="sul">Sul</SelectItem>
                                  <SelectItem value="nordeste">Nordeste</SelectItem>
                                  <SelectItem value="norte">Norte</SelectItem>
                                  <SelectItem value="centro-oeste">Centro-Oeste</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button className="w-full gap-2">
                              <Plus className="w-4 h-4" />
                              Adicionar Local
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium">Locais Cadastrados</h4>
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {[
                              { nome: "Igreja Central", bairro: "Centro", cidade: "São Paulo", estado: "SP", regional: "Sudeste" },
                              { nome: "Igreja Norte", bairro: "Santana", cidade: "São Paulo", estado: "SP", regional: "Sudeste" },
                              { nome: "Igreja Sul", bairro: "Vila Mariana", cidade: "São Paulo", estado: "SP", regional: "Sudeste" },
                              { nome: "Igreja Copacabana", bairro: "Copacabana", cidade: "Rio de Janeiro", estado: "RJ", regional: "Sudeste" }
                            ].map((local, index) => (
                              <div key={index} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="font-medium">{local.nome}</h5>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm">
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {local.bairro}, {local.cidade} - {local.estado}
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  {local.regional}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notificacoes" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-primary" />
                          Notificações por E-mail
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 mb-4">
                          <Label htmlFor="email-remetente">E-mail remetente padrão</Label>
                          <Input 
                            id="email-remetente" 
                            type="email" 
                            defaultValue="noreply@igreja.com.br"
                            placeholder="remetente@dominio.com"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email-eventos" className="text-sm font-medium">
                              Novos eventos criados
                            </Label>
                            <Switch id="email-eventos" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email-presenca" className="text-sm font-medium">
                              Alertas de presença baixa
                            </Label>
                            <Switch id="email-presenca" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email-avaliacoes" className="text-sm font-medium">
                              Novas avaliações disponíveis
                            </Label>
                            <Switch id="email-avaliacoes" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email-ranking" className="text-sm font-medium">
                              Atualizações de ranking
                            </Label>
                            <Switch id="email-ranking" defaultChecked />
                          </div>
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
                          <Label htmlFor="push-ativo" className="text-sm font-medium">
                            Notificações Push ativas
                          </Label>
                          <Switch id="push-ativo" defaultChecked />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="push-checkin" className="text-sm font-medium">
                              Lembretes de check-in
                            </Label>
                            <Switch id="push-checkin" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="push-eventos" className="text-sm font-medium">
                              Início de eventos
                            </Label>
                            <Switch id="push-eventos" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="push-questionarios" className="text-sm font-medium">
                              Questionários pendentes
                            </Label>
                            <Switch id="push-questionarios" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="push-conquistas" className="text-sm font-medium">
                              Novas conquistas
                            </Label>
                            <Switch id="push-conquistas" defaultChecked />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="w-5 h-5 text-primary" />
                          WhatsApp/SMS
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 mb-4">
                          <Label htmlFor="whatsapp-numero">Número padrão (WhatsApp)</Label>
                          <Input 
                            id="whatsapp-numero" 
                            defaultValue="+55 11 99999-9999"
                            placeholder="+55 11 99999-9999"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="whatsapp-ativo" className="text-sm font-medium">
                            WhatsApp ativo
                          </Label>
                          <Switch id="whatsapp-ativo" />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="sms-ativo" className="text-sm font-medium">
                            SMS ativo
                          </Label>
                          <Switch id="sms-ativo" />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="whatsapp-eventos" className="text-sm font-medium">
                              Eventos importantes
                            </Label>
                            <Switch id="whatsapp-eventos" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="whatsapp-urgente" className="text-sm font-medium">
                              Notificações urgentes
                            </Label>
                            <Switch id="whatsapp-urgente" defaultChecked />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="seguranca" className="space-y-6">
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
                          <Switch id="auth-2fa" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="ip-restrict" className="text-sm font-medium">
                            Restrição por IP
                          </Label>
                          <Switch id="ip-restrict" />
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
                          <Switch id="manutencao-auto" defaultChecked />
                        </div>
                        <Button variant="outline" className="w-full gap-2">
                          <Database className="w-4 h-4" />
                          Executar Backup Manual
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Sessões Ativas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { usuario: "João Silva", dispositivo: "Chrome - Windows 10", ip: "192.168.1.100", inicio: "14:30", status: "Ativo" },
                          { usuario: "Maria Santos", dispositivo: "Safari - iOS 17", ip: "192.168.1.105", inicio: "13:45", status: "Ativo" },
                          { usuario: "Pedro Costa", dispositivo: "Firefox - Linux", ip: "192.168.1.110", inicio: "12:20", status: "Inativo" }
                        ].map((sessao, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h5 className="font-medium">{sessao.usuario}</h5>
                                <p className="text-sm text-muted-foreground">{sessao.dispositivo}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={sessao.status === 'Ativo' ? 'default' : 'secondary'}>
                                  {sessao.status}
                                </Badge>
                                <Button variant="destructive" size="sm">
                                  Encerrar
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>IP: {sessao.ip}</span>
                              <span>Início: {sessao.inicio}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        Histórico de Ações Administrativas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {[
                          { usuario: "João Silva", acao: "Criou nova equipe", detalhes: "Equipe: Jovens Unidos", data: "Hoje, 15:30" },
                          { usuario: "Maria Santos", acao: "Alterou configurações", detalhes: "QR Code: tempo de expiração", data: "Hoje, 14:20" },
                          { usuario: "João Silva", acao: "Adicionou usuário admin", detalhes: "Usuário: Pedro Costa", data: "Ontem, 16:45" },
                          { usuario: "Pedro Costa", acao: "Criou questionário", detalhes: "Questionário: Avaliação Mensal", data: "Ontem, 14:10" },
                          { usuario: "Maria Santos", acao: "Exportou relatório", detalhes: "Relatório de presença - Janeiro", data: "2 dias atrás" }
                        ].map((log, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <h5 className="font-medium text-sm">{log.usuario}</h5>
                                <p className="text-sm text-foreground">{log.acao}</p>
                                <p className="text-xs text-muted-foreground">{log.detalhes}</p>
                              </div>
                              <span className="text-xs text-muted-foreground">{log.data}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          Ver Logs Completos
                        </Button>
                        <Button variant="outline" size="sm">
                          Exportar Logs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Configuracoes;