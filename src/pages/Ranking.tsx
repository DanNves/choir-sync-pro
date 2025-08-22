import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Trophy, 
  Medal,
  Star,
  TrendingUp,
  TrendingDown,
  Crown,
  Award,
  Target,
  Users
} from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const Ranking = () => {
  const rankingGeral = [
    {
      posicao: 1,
      nome: "João Silva",
      equipe: "Coral Juvenil",
      instrumento: "Vocal/Piano",
      pontuacao: 2450,
      presenca: 98.5,
      notaMedia: 9.2,
      mudanca: 0,
      medalhas: { ouro: 3, prata: 1, bronze: 0 }
    },
    {
      posicao: 2,
      nome: "Maria Santos", 
      equipe: "Banda de Instrumentistas",
      instrumento: "Órgão",
      pontuacao: 2380,
      presenca: 97.2,
      notaMedia: 8.9,
      mudanca: 1,
      medalhas: { ouro: 2, prata: 3, bronze: 1 }
    },
    {
      posicao: 3,
      nome: "Carlos Lima",
      equipe: "Coral Adulto", 
      instrumento: "Vocal",
      pontuacao: 2290,
      presenca: 96.8,
      notaMedia: 8.7,
      mudanca: -1,
      medalhas: { ouro: 1, prata: 2, bronze: 3 }
    },
    {
      posicao: 4,
      nome: "Ana Oliveira",
      equipe: "Orquestra Regional",
      instrumento: "Violino",
      pontuacao: 2156,
      presenca: 94.3,
      notaMedia: 8.4,
      mudanca: 2,
      medalhas: { ouro: 1, prata: 1, bronze: 2 }
    },
    {
      posicao: 5,
      nome: "Pedro Costa",
      equipe: "Banda de Instrumentistas", 
      instrumento: "Bateria",
      pontuacao: 2089,
      presenca: 93.7,
      notaMedia: 8.1,
      mudanca: -2,
      medalhas: { ouro: 0, prata: 2, bronze: 4 }
    }
  ]

  const rankingEquipes = [
    {
      posicao: 1,
      nome: "Coral Adulto",
      membros: 67,
      pontuacaoTotal: 156780,
      pontuacaoMedia: 2340,
      presencaMedia: 95.8,
      notaMedia: 8.9,
      mudanca: 0
    },
    {
      posicao: 2,
      nome: "Coral Juvenil", 
      membros: 45,
      pontuacaoTotal: 98450,
      pontuacaoMedia: 2187,
      presencaMedia: 92.5,
      notaMedia: 8.7,
      mudanca: 1
    },
    {
      posicao: 3,
      nome: "Banda de Instrumentistas",
      membros: 23,
      pontuacaoTotal: 48920,
      pontuacaoMedia: 2127,
      presencaMedia: 89.2,
      notaMedia: 8.3,
      mudanca: -1
    },
    {
      posicao: 4,
      nome: "Orquestra Regional",
      membros: 34, 
      pontuacaoTotal: 68340,
      pontuacaoMedia: 2010,
      presencaMedia: 87.4,
      notaMedia: 8.0,
      mudanca: 0
    }
  ]

  const conquistasRecentes = [
    {
      id: 1,
      usuario: "João Silva",
      conquista: "Presença Perfeita - Janeiro",
      tipo: "Presença",
      data: "Hoje",
      icone: Trophy,
      cor: "text-warning"
    },
    {
      id: 2,
      usuario: "Maria Santos",
      conquista: "Nota Máxima - Teoria Musical",
      tipo: "Avaliação", 
      data: "Ontem",
      icone: Star,
      cor: "text-primary"
    },
    {
      id: 3,
      usuario: "Carlos Lima",
      conquista: "Líder Semanal",
      tipo: "Ranking",
      data: "2 dias atrás", 
      icone: Crown,
      cor: "text-accent"
    }
  ]

  const getPosicaoIcon = (posicao: number) => {
    switch (posicao) {
      case 1: return Crown
      case 2: return Medal  
      case 3: return Award
      default: return Trophy
    }
  }

  const getPosicaoColor = (posicao: number) => {
    switch (posicao) {
      case 1: return 'text-warning'
      case 2: return 'text-muted-foreground'
      case 3: return 'text-destructive'
      default: return 'text-muted-foreground'
    }
  }

  const getMudancaIcon = (mudanca: number) => {
    if (mudanca > 0) return TrendingUp
    if (mudanca < 0) return TrendingDown
    return null
  }

  const getMudancaColor = (mudanca: number) => {
    if (mudanca > 0) return 'text-success'
    if (mudanca < 0) return 'text-destructive'
    return 'text-muted-foreground'
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
                    Ranking e Classificações
                  </h1>
                  <p className="text-muted-foreground">
                    Acompanhe o desempenho e conquistas dos participantes
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Participantes</p>
                        <p className="text-2xl font-bold text-foreground">169</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                        <Crown className="w-6 h-6 text-warning" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pontuação Máxima</p>
                        <p className="text-2xl font-bold text-foreground">2,450</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Média Geral</p>
                        <p className="text-2xl font-bold text-foreground">1,847</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conquistas</p>
                        <p className="text-2xl font-bold text-foreground">342</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="individual" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                  <TabsTrigger value="individual">Ranking Individual</TabsTrigger>
                  <TabsTrigger value="equipes">Ranking por Equipes</TabsTrigger>
                  <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
                </TabsList>

                <TabsContent value="individual" className="space-y-6">
                  <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader>
                      <CardTitle>Top 5 - Ranking Individual</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {rankingGeral.map((participante) => {
                          const PosicaoIcon = getPosicaoIcon(participante.posicao)
                          const MudancaIcon = getMudancaIcon(participante.mudanca)
                          
                          return (
                            <div key={participante.posicao} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    participante.posicao === 1 ? 'bg-warning/10' :
                                    participante.posicao === 2 ? 'bg-muted/20' :
                                    participante.posicao === 3 ? 'bg-destructive/10' :
                                    'bg-muted/10'
                                  }`}>
                                    <PosicaoIcon className={`w-5 h-5 ${getPosicaoColor(participante.posicao)}`} />
                                  </div>
                                  <div className="text-lg font-bold text-foreground">
                                    #{participante.posicao}
                                  </div>
                                  <Avatar>
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {participante.nome.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-foreground">{participante.nome}</h4>
                                    {MudancaIcon && (
                                      <div className="flex items-center gap-1">
                                        <MudancaIcon className={`w-4 h-4 ${getMudancaColor(participante.mudanca)}`} />
                                        <span className={`text-sm ${getMudancaColor(participante.mudanca)}`}>
                                          {Math.abs(participante.mudanca)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {participante.equipe} • {participante.instrumento}
                                  </p>
                                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                    <span>Presença: {participante.presenca}%</span>
                                    <span>Média: {participante.notaMedia}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-foreground">{participante.pontuacao.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">pontos</p>
                                <div className="flex items-center gap-1 mt-2">
                                  {participante.medalhas.ouro > 0 && (
                                    <Badge variant="outline" className="text-xs gap-1">
                                      🥇 {participante.medalhas.ouro}
                                    </Badge>
                                  )}
                                  {participante.medalhas.prata > 0 && (
                                    <Badge variant="outline" className="text-xs gap-1">
                                      🥈 {participante.medalhas.prata}
                                    </Badge>
                                  )}
                                  {participante.medalhas.bronze > 0 && (
                                    <Badge variant="outline" className="text-xs gap-1">
                                      🥉 {participante.medalhas.bronze}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="equipes" className="space-y-6">
                  <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader>
                      <CardTitle>Ranking por Equipes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {rankingEquipes.map((equipe) => {
                          const PosicaoIcon = getPosicaoIcon(equipe.posicao)
                          const MudancaIcon = getMudancaIcon(equipe.mudanca)
                          
                          return (
                            <div key={equipe.posicao} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    equipe.posicao === 1 ? 'bg-warning/10' :
                                    equipe.posicao === 2 ? 'bg-muted/20' :
                                    equipe.posicao === 3 ? 'bg-destructive/10' :
                                    'bg-muted/10'
                                  }`}>
                                    <PosicaoIcon className={`w-5 h-5 ${getPosicaoColor(equipe.posicao)}`} />
                                  </div>
                                  <div className="text-lg font-bold text-foreground">
                                    #{equipe.posicao}
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-foreground">{equipe.nome}</h4>
                                    {MudancaIcon && (
                                      <div className="flex items-center gap-1">
                                        <MudancaIcon className={`w-4 h-4 ${getMudancaColor(equipe.mudanca)}`} />
                                        <span className={`text-sm ${getMudancaColor(equipe.mudanca)}`}>
                                          {Math.abs(equipe.mudanca)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      {equipe.membros} membros
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                    <span>Presença: {equipe.presencaMedia}%</span>
                                    <span>Média: {equipe.notaMedia}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-foreground">
                                  {equipe.pontuacaoTotal.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">pontos totais</p>
                                <p className="text-sm text-muted-foreground">
                                  Média: {equipe.pontuacaoMedia.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="conquistas" className="space-y-6">
                  <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                    <CardHeader>
                      <CardTitle>Conquistas Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {conquistasRecentes.map((conquista) => (
                          <div key={conquista.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-muted/20`}>
                              <conquista.icone className={`w-6 h-6 ${conquista.cor}`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{conquista.conquista}</h4>
                              <p className="text-sm text-muted-foreground">
                                {conquista.usuario} • {conquista.data}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {conquista.tipo}
                            </Badge>
                          </div>
                        ))}
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
  );
};

export default Ranking;