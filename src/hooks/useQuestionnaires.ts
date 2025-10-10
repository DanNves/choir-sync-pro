import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useQuestionnaires() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: questionnaires, isLoading } = useQuery({
    queryKey: ['questionnaires'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questionnaires')
        .select(`
          *,
          events(id, nome),
          questionnaire_questions(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createQuestionnaire = useMutation({
    mutationFn: async ({ questionnaire, questions }: any) => {
      const { data: newQuestionnaire, error: questionnaireError } = await supabase
        .from('questionnaires')
        .insert(questionnaire)
        .select()
        .single();
      
      if (questionnaireError) throw questionnaireError;

      if (questions && questions.length > 0) {
        const questionsWithId = questions.map((q: any) => ({
          ...q,
          questionnaire_id: newQuestionnaire.id
        }));

        const { error: questionsError } = await supabase
          .from('questionnaire_questions')
          .insert(questionsWithId);
        
        if (questionsError) throw questionsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
      toast({
        title: "Questionário criado",
        description: "O questionário foi criado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar questionário",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateQuestionnaire = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase
        .from('questionnaires')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
      toast({
        title: "Questionário atualizado",
        description: "O questionário foi atualizado com sucesso.",
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

  const deleteQuestionnaire = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('questionnaires')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
      toast({
        title: "Questionário removido",
        description: "O questionário foi removido com sucesso.",
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
    questionnaires: questionnaires || [],
    isLoading,
    createQuestionnaire: createQuestionnaire.mutate,
    updateQuestionnaire: updateQuestionnaire.mutate,
    deleteQuestionnaire: deleteQuestionnaire.mutate
  };
}
