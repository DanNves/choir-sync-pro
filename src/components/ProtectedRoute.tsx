import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  resource?: string;
  permission?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  resource, 
  permission, 
  fallback 
}: ProtectedRouteProps) {
  const { user, canAccess, hasPermission } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = resource ? canAccess(resource) : permission ? hasPermission(permission) : true;

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar esta funcionalidade.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}