import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useTeams() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          id,
          nome,
          tipo,
          descricao,
          instrutor_id,
          instrutor:profiles!teams_instrutor_id_fkey(id, nome),
          team_members(
            user_id,
            profiles(id, nome, instrumento)
          )
        `)
        .order('nome');
      
      if (error) throw error;
      return data;
    },
    staleTime: 30000 // Cache por 30 segundos
  });

  const createTeam = useMutation({
    mutationFn: async (teamData: any) => {
      const { data, error } = await supabase
        .from('teams')
        .insert(teamData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Equipe criada",
        description: "A nova equipe foi criada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar equipe",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateTeam = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Equipe atualizada",
        description: "As informações da equipe foram atualizadas com sucesso.",
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

  const deleteTeam = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Equipe removida",
        description: "A equipe foi removida com sucesso.",
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

  const addMember = useMutation({
    mutationFn: async ({ team_id, user_id }: { team_id: string; user_id: string }) => {
      const { error } = await supabase
        .from('team_members')
        .insert({ team_id, user_id });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Membro adicionado",
        description: "O membro foi adicionado à equipe com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao adicionar membro",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const removeMember = useMutation({
    mutationFn: async ({ team_id, user_id }: { team_id: string; user_id: string }) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', team_id)
        .eq('user_id', user_id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Membro removido",
        description: "O membro foi removido da equipe com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover membro",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    teams: teams || [],
    isLoading,
    createTeam: createTeam.mutate,
    updateTeam: updateTeam.mutate,
    deleteTeam: deleteTeam.mutate,
    addMember: addMember.mutate,
    removeMember: removeMember.mutate
  };
}
