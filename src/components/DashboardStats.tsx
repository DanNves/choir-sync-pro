import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Award,
  Clock,
  CheckCircle
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useProfiles } from "@/hooks/useProfiles"
import { useEvents } from "@/hooks/useEvents"
import { useAttendances } from "@/hooks/useAttendances"
import { useTeams } from "@/hooks/useTeams"

export function DashboardStats() {
  const navigate = useNavigate()
  const { profiles } = useProfiles()
  const { events } = useEvents()
  const { attendances } = useAttendances()
  const { teams } = useTeams()

  const handleNavigateToEvents = () => {
    navigate('/eventos')
  }

  const handleNavigateToPresencas = () => {
    navigate('/presencas')
  }

  const handleNavigateToRanking = () => {
    navigate('/ranking')
  }

  const currentMonth = new Date().getMonth()
  const eventsThisMonth = events.filter(e => {
    const eventMonth = new Date(e.data).getMonth()
    return eventMonth === currentMonth
  }).length

  const attendanceRate = attendances.length > 0 
    ? ((attendances.filter(a => a.status === 'Presente').length / attendances.length) * 100).toFixed(1)
    : "0"

  const upcomingEvents = events
    .filter(e => new Date(e.data) >= new Date())
    .slice(0, 3)
    .map(e => ({
      id: e.id,
      title: e.nome,
      time: `${e.horario}`,
      date: new Date(e.data).toLocaleDateString('pt-BR'),
      status: e.status.toLowerCase() as 'aberto' | 'agendado',
      participants: e.participantes_esperados
    }))
  
  type ChangeType = 'positive' | 'neutral' | 'negative'
  
  const stats: Array<{
    title: string
    value: string
    change: string
    changeType: ChangeType
    icon: any
    color: string
  }> = [
    {
      title: "Membros Ativos",
      value: profiles.length.toString(),
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Eventos este Mês",
      value: eventsThisMonth.toString(),
      change: "+3 novos",
      changeType: "neutral",
      icon: Calendar,
      color: "text-accent"
    },
    {
      title: "Presença Média",
      value: `${attendanceRate}%`,
      change: "+5.2%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Equipes Ativas",
      value: teams.length.toString(),
      change: `${teams.length} equipes`,
      changeType: "neutral",
      icon: Award,
      color: "text-info"
    }
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <Badge 
                variant={stat.changeType === 'positive' ? 'default' : 
                        stat.changeType === 'negative' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {stat.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Events */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Próximos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    event.status === 'aberto' ? 'bg-success' : 'bg-warning'
                  }`} />
                  <div>
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.date} • {event.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={event.status === 'aberto' ? 'default' : 'secondary'}>
                    {event.status === 'aberto' ? 'Aberto' : 'Agendado'}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.participants} participantes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={handleNavigateToEvents}
        >
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Criar Evento</h3>
            <p className="text-sm text-muted-foreground">Agendar novo ensaio ou reunião</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={handleNavigateToPresencas}
        >
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Registrar Presença</h3>
            <p className="text-sm text-muted-foreground">Check-in manual ou via QR Code</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={handleNavigateToRanking}
        >
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-success mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Ver Ranking</h3>
            <p className="text-sm text-muted-foreground">Classificação geral e por equipe</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}