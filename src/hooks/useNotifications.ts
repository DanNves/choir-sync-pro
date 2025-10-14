import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  type: 'event' | 'attendance' | 'questionnaire' | 'team' | 'user';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export function useNotifications() {
  const { user } = useAuth();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const notifications: Notification[] = [];
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      // Notificações para Administradores
      if (user.papel === 'administrador') {
        // Novos usuários cadastrados hoje
        const { data: newUsers } = await supabase
          .from('profiles')
          .select('id, nome, created_at')
          .gte('created_at', today)
          .order('created_at', { ascending: false });

        newUsers?.forEach((u) => {
          notifications.push({
            id: `user-${u.id}`,
            type: 'user',
            title: 'Novo usuário cadastrado',
            message: `${u.nome} se cadastrou no sistema`,
            created_at: u.created_at,
            read: false
          });
        });

        // Eventos criados recentemente
        const { data: newEvents } = await supabase
          .from('events')
          .select('id, nome, created_at')
          .gte('created_at', today)
          .order('created_at', { ascending: false });

        newEvents?.forEach((e) => {
          notifications.push({
            id: `event-${e.id}`,
            type: 'event',
            title: 'Novo evento criado',
            message: `Evento "${e.nome}" foi criado`,
            created_at: e.created_at,
            read: false
          });
        });
      }

      // Notificações para todos os usuários autenticados
      if (user.id) {
        // Próximos eventos (próximos 7 dias)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const { data: upcomingEvents } = await supabase
          .from('events')
          .select('id, nome, data, horario')
          .gte('data', today)
          .lte('data', nextWeek.toISOString().split('T')[0])
          .eq('status', 'Agendado')
          .order('data', { ascending: true })
          .limit(3);

        upcomingEvents?.forEach((e) => {
          notifications.push({
            id: `upcoming-${e.id}`,
            type: 'event',
            title: 'Evento próximo',
            message: `${e.nome} - ${new Date(e.data).toLocaleDateString('pt-BR')} às ${e.horario}`,
            created_at: e.data,
            read: false
          });
        });
      }

      // Notificações para Instrutores e Encarregados
      if (['instrutor', 'encarregado_local'].includes(user.papel)) {
        // Questionários pendentes de resposta
        const { data: pendingQuestionnaires } = await supabase
          .from('questionnaires')
          .select('id, titulo, data_fim')
          .gte('data_fim', today)
          .order('data_fim', { ascending: true });

        pendingQuestionnaires?.forEach((q) => {
          notifications.push({
            id: `questionnaire-${q.id}`,
            type: 'questionnaire',
            title: 'Questionário disponível',
            message: `"${q.titulo}" - Prazo até ${new Date(q.data_fim).toLocaleDateString('pt-BR')}`,
            created_at: q.data_fim,
            read: false
          });
        });
      }

      // Ordenar por data mais recente
      return notifications.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 10); // Limitar a 10 notificações mais recentes
    },
    enabled: !!user,
    staleTime: 60000, // Cache por 1 minuto
    refetchInterval: 300000 // Refetch a cada 5 minutos
  });

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return {
    notifications: notifications || [],
    unreadCount,
    isLoading
  };
}
