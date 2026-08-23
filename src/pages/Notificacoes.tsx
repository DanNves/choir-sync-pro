import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/hooks/useNotifications"
import { Bell, Calendar, UserCheck, ClipboardList, Users, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const Notificacoes = () => {
  const { notifications, isLoading } = useNotifications()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event': return <Calendar className="w-5 h-5 text-primary" />
      case 'attendance': return <UserCheck className="w-5 h-5 text-success" />
      case 'questionnaire': return <ClipboardList className="w-5 h-5 text-accent" />
      case 'team': return <Users className="w-5 h-5 text-info" />
      default: return <Bell className="w-5 h-5 text-muted-foreground" />
    }
  }

  return (
    <ProtectedRoute resource="dashboard">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <Bell className="w-8 h-8 text-primary" />
                    Central de Notificações
                  </h1>
                  <p className="text-muted-foreground">
                    Acompanhe todas as atividades e alertas importantes do sistema.
                  </p>
                </div>

                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Histórico Recente</CardTitle>
                    <Badge variant="outline">{notifications.length} registros</Badge>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : notifications.length > 0 ? (
                        <div className="space-y-4">
                          {notifications.map((notification, index) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors group"
                            >
                              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border border-border shrink-0 group-hover:scale-110 transition-transform">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-foreground">{notification.title}</h4>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(notification.created_at).toLocaleDateString('pt-BR', {
                                      day: '2-digit',
                                      month: 'long',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {notification.message}
                                </p>
                              </div>
                              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Badge variant="secondary" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                                  <Check className="w-4 h-4" />
                                </Badge>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                          <Bell className="w-16 h-16 mb-4 opacity-20" />
                          <p>Nenhuma notificação encontrada.</p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}

export default Notificacoes