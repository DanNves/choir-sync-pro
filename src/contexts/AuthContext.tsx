import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserRole: (role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
  canAccess: (resource: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demonstration - in real app this would come from backend
const mockUser: User = {
  id: '1',
  nome: 'Admin Test',
  email: 'admin@test.com',
  papel: 'administrador',
  localidade: 'São Paulo',
  regiao: 'Sudeste'
};

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
  const [user, setUser] = useState<User | null>(mockUser);

  const login = async (email: string, password: string) => {
    // Mock login - in real app this would call backend
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, papel: role });
    }
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
      login,
      logout,
      updateUserRole,
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