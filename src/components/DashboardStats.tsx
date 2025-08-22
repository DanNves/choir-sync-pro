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

export function DashboardStats() {
  const stats = [
    {
      title: "Membros Ativos",
      value: "243",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Eventos este Mês",
      value: "18",
      change: "+3 novos",
      changeType: "neutral" as const,
      icon: Calendar,
      color: "text-accent"
    },
    {
      title: "Presença Média",
      value: "87.5%",
      change: "+5.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Taxa de Conclusão",
      value: "92.3%",
      change: "-1.1%",
      changeType: "negative" as const,
      icon: Award,
      color: "text-info"
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Ensaio Coral Juvenil",
      time: "19:00 - 21:00",
      date: "Hoje",
      status: "aberto" as const,
      participants: 45
    },
    {
      id: 2,
      title: "Reunião de Instrumentistas",
      time: "20:00 - 22:00", 
      date: "Amanhã",
      status: "agendado" as const,
      participants: 23
    },
    {
      id: 3,
      title: "Avaliação Técnica Mensal",
      time: "14:00 - 17:00",
      date: "Sábado",
      status: "agendado" as const,
      participants: 67
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
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Criar Evento</h3>
            <p className="text-sm text-muted-foreground">Agendar novo ensaio ou reunião</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Registrar Presença</h3>
            <p className="text-sm text-muted-foreground">Check-in manual ou via QR Code</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-lg transition-shadow cursor-pointer">
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