import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useProfiles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      // Buscar profiles com roles e emails
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            role
          )
        `)
        .order('nome');
      
      if (profilesError) throw profilesError;

      // Buscar emails dos usuários
      const { data: usersData } = await supabase.auth.admin.listUsers();
      
      // Criar um mapa de id -> email
      const emailMap = new Map<string, string>();
      if (usersData && usersData.users) {
        usersData.users.forEach((u: any) => {
          if (u.id && u.email) {
            emailMap.set(u.id, u.email);
          }
        });
      }

      // Combinar dados
      const enrichedProfiles = profilesData?.map(profile => ({
        ...profile,
        email: emailMap.get(profile.id) || profile.id
      }));
      
      return enrichedProfiles;
    },
    staleTime: 30000 // Cache por 30 segundos
  });

  const updateProfile = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Perfil atualizado",
        description: "As informações foram atualizadas com sucesso.",
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

  return {
    profiles: profiles || [],
    isLoading,
    updateProfile: updateProfile.mutate
  };
}
