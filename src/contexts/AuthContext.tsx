import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type UserRole = 
  | 'candidato' 
  | 'musico' 
  | 'instrutor' 
  | 'encarregado_local' 
  | 'encarregado_regional' 
  | 'examinadora' 
  | 'cooperador_jovens' 
  | 'cooperador_oficio' 
  | 'anciao' 
  | 'diacono' 
  | 'administrador';

export interface User {
  id: string;
  nome: string;
  email: string;
  papel: UserRole;
  localidade?: string;
  regiao?: string;
  equipes?: string[];
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  register: (email: string, password: string, nome: string, telefone?: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  canAccess: (resource: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


const rolePermissions: Record<UserRole, string[]> = {
  candidato: [
    'view_profile',
    'view_events', 
    'checkin_events',
    'answer_questionnaires',
    'view_own_teams',
    'view_own_performance'
  ],
  musico: [
    'view_profile',
    'view_events', 
    'checkin_events',
    'answer_questionnaires',
    'view_own_teams',
    'view_own_performance',
    'view_detailed_ranking'
  ],
  instrutor: [
    'view_profile',
    'view_events',
    'manage_own_teams',
    'create_questionnaires',
    'view_team_ranking',
    'view_team_performance'
  ],
  encarregado_local: [
    'view_profile',
    'view_events',
    'manage_local_events',
    'view_local_ranking',
    'manual_checkin',
    'create_local_teams',
    'manage_local_users'
  ],
  encarregado_regional: [
    'view_profile',
    'view_regional_reports',
    'view_regional_ranking',
    'view_regional_consolidated'
  ],
  examinadora: [
    'view_profile',
    'view_candidates_list',
    'view_questionnaires',
    'view_responses'
  ],
  cooperador_jovens: [
    'view_profile',
    'view_youth_teams',
    'view_youth_attendance',
    'view_youth_ranking'
  ],
  cooperador_oficio: [
    'view_profile',
    'view_office_teams',
    'view_office_attendance',
    'view_office_ranking'
  ],
  anciao: [
    'view_profile',
    'view_consolidated_reports',
    'view_church_performance',
    'view_growth_reports'
  ],
  diacono: [
    'view_profile',
    'view_consolidated_reports',
    'view_church_performance',
    'view_growth_reports'
  ],
  administrador: [
    'view_profile',
    'view_events',
    'view_users',
    'view_teams',
    'view_questionnaires',
    'view_ranking',
    'view_reports',
    'manage_settings',
    'manage_users',
    'manage_teams',
    'manage_events',
    'manage_questionnaires',
    'audit_logs',
    'system_config'
  ]
};

const resourceAccess: Record<string, UserRole[]> = {
  dashboard: ['administrador', 'encarregado_local', 'encarregado_regional', 'instrutor'],
  usuarios: ['administrador', 'encarregado_local'],
  eventos: ['administrador', 'encarregado_local', 'instrutor', 'musico', 'candidato'],
  presencas: ['administrador', 'encarregado_local', 'instrutor'],
  equipes: ['administrador', 'encarregado_local', 'instrutor', 'musico', 'candidato'],
  questionarios: ['administrador', 'encarregado_local', 'instrutor', 'examinadora'],
  ranking: ['administrador', 'encarregado_local', 'encarregado_regional', 'instrutor', 'musico'],
  relatorios: ['administrador', 'encarregado_local', 'encarregado_regional', 'anciao', 'diacono'],
  configuracoes: ['administrador']
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) throw rolesError;

      const primaryRole = roles?.[0]?.role || 'candidato';

      const userSession = await supabase.auth.getUser();
      const email = userSession.data.user?.email || '';

      setUser({
        id: userId,
        nome: profile.nome,
        email: email,
        papel: primaryRole as UserRole,
        localidade: profile.localidade,
        regiao: profile.regiao
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (email: string, password: string, nome: string, telefone?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nome,
            telefone
          }
        }
      });

      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.papel]?.includes(permission) || false;
  };

  const canAccess = (resource: string): boolean => {
    if (!user) return false;
    return resourceAccess[resource]?.includes(user.papel) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      login,
      register,
      logout,
      hasPermission,
      canAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}