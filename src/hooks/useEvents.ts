import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useEvents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', user?.papel],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('data', { ascending: false });
      
      // Se não for admin, filtra apenas eventos ativos
      // Nota: Cast 'admin' para 'any' para evitar erro de overlap de tipo com UserRole se necessário
      if (user?.papel !== ('administrador' as any)) {
        query = query.filter('active', 'eq', true);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as any[];
    },
    staleTime: 30000,
    enabled: !!user
  });

  const createEvent = useMutation({
    mutationFn: async (eventData: any) => {
      const { error } = await supabase
        .from('events')
        .insert(eventData);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Evento criado",
        description: "O novo evento foi criado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar evento",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Evento atualizado",
        description: "As informações do evento foram atualizadas com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Evento cancelado",
        description: "O evento foi cancelado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao cancelar",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    events: events || [],
    isLoading,
    createEvent: createEvent.mutate,
    updateEvent: updateEvent.mutate,
    deleteEvent: deleteEvent.mutate
  };
}
