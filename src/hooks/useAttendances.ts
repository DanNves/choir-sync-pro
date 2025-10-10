import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAttendances() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: attendances, isLoading } = useQuery({
    queryKey: ['attendances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendances')
        .select(`
          *,
          profiles(id, nome),
          events(id, nome)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createAttendance = useMutation({
    mutationFn: async (attendanceData: any) => {
      const { error } = await supabase
        .from('attendances')
        .insert(attendanceData);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      toast({
        title: "Presença registrada",
        description: "A presença foi registrada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao registrar presença",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateAttendance = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase
        .from('attendances')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      toast({
        title: "Presença atualizada",
        description: "Os dados da presença foram atualizados com sucesso.",
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

  const deleteAttendance = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('attendances')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      toast({
        title: "Presença removida",
        description: "O registro de presença foi removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    attendances: attendances || [],
    isLoading,
    createAttendance: createAttendance.mutate,
    updateAttendance: updateAttendance.mutate,
    deleteAttendance: deleteAttendance.mutate
  };
}
