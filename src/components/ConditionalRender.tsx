import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ConditionalRenderProps {
  children: ReactNode;
  resource?: string;
  permission?: string;
  fallback?: ReactNode;
}

export function ConditionalRender({ 
  children, 
  resource, 
  permission, 
  fallback = null 
}: ConditionalRenderProps) {
  const { canAccess, hasPermission } = useAuth();

  const hasAccess = resource ? canAccess(resource) : permission ? hasPermission(permission) : true;

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}