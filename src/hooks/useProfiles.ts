import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useProfiles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      // Buscar profiles com roles
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

      // Buscar emails dos usuários - nota: supabase.auth.admin.listUsers() 
      // só funciona se tivermos a service role key configurada.
      let emailMap = new Map<string, string>();
      try {
        const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        if (usersData && usersData.users) {
          usersData.users.forEach((u: any) => {
            if (u.id && u.email) {
              emailMap.set(u.id, u.email);
            }
          });
        }
      } catch (e) {
        console.warn("Could not list users from auth admin API", e);
      }

      // Combinar dados
      const enrichedProfiles = profilesData?.map(profile => ({
        ...profile,
        email: emailMap.get(profile.id) || profile.id.substring(0, 8) + '...'
      }));
      
      return enrichedProfiles;
    },
    staleTime: 30000
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
