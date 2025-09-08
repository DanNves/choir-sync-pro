import { useAuth, UserRole } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RoleSelector() {
  const { user } = useAuth();

  const roles: { value: UserRole; label: string }[] = [
    { value: 'candidato', label: 'Candidato(a)' },
    { value: 'musico', label: 'Músico/Organista' },
    { value: 'instrutor', label: 'Instrutor(a)' },
    { value: 'encarregado_local', label: 'Encarregado Local' },
    { value: 'encarregado_regional', label: 'Encarregado Regional' },
    { value: 'examinadora', label: 'Examinadora' },
    { value: 'cooperador_jovens', label: 'Cooperador de Jovens' },
    { value: 'cooperador_oficio', label: 'Cooperador do Ofício' },
    { value: 'anciao', label: 'Ancião' },
    { value: 'diacono', label: 'Diácono' },
    { value: 'administrador', label: 'Administrador' }
  ];

  const handleRoleChange = (newRole: UserRole) => {
    // Mock role change - in real app this would be restricted
    if (user) {
      (user as any).papel = newRole;
      window.location.reload(); // Force refresh to update permissions
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Testar como:</span>
      <Select value={user?.papel} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}