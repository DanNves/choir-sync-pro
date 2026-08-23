# Choir Sync Pro - Plano de Melhorias e Correções

Este plano detalha as melhorias e correções para garantir que o Choir Sync Pro esteja 100% funcional, seguro e otimizado para o uso real com o Supabase.

## Objetivos
- Consolidar o sistema de permissões (RBAC) no banco de dados.
- Corrigir bugs de interface e fluxos de dados.
- Implementar as melhorias solicitadas em Eventos (Ativo/Inativo e Modelos de Horário).
- Garantir que todos os CRUDs reflitam os dados reais do banco.

## Mudanças Propostas

### Backend (Supabase)

#### 1. Esquema de Banco de Dados e RLS
- **Tabela `events`**: Adicionar coluna `active` (boolean, default true) e `horario` (mudar para TEXT se necessário para suportar intervalos).
- **Políticas RLS**:
    - `events`: Filtro dinâmico para que usuários comuns vejam apenas `active = true`.
    - `user_roles`: Garantir que administradores possam deletar e inserir papéis sem erro de RLS.
- **Trigger `handle_new_user`**: Ajustar para capturar metadados corretamente e atribuir o papel 'candidato'.

### Frontend (React + TypeScript)

#### 1. Gestão de Usuários (`src/pages/Usuarios.tsx`)
- **Fix RLS**: Implementar lógica de "delete old role, insert new role" com tratamento de erro robusto.
- **Tratamento de Dados**: Garantir que IDs técnicos (UUIDs) nunca apareçam para o usuário final.
- **Self-View**: Garantir que o administrador consiga ver e editar o próprio perfil na lista.

#### 2. Gestão de Eventos (`src/pages/Eventos.tsx`)
- **Modelos de Horário**: Substituir inputs de texto por um `Select` com modelos pré-definidos ("19:00 - 21:00", "08:00 - 10:00", etc.).
- **Status Ativo/Inativo**: Adicionar um `Switch` no formulário para controlar a visibilidade do evento.
- **Filtragem**: Integrar com o hook `useEvents` para respeitar as novas políticas de visibilidade.

#### 3. Presenças e Relatórios
- **Limpeza de Mocks**: Substituir quaisquer cálculos manuais remanescentes por agregações vindas do Supabase.
- **Tratamento de Nomes**: Garantir que o nome do participante venha sempre do join com `profiles`.

#### 4. Notificações (`src/hooks/useNotifications.ts`)
- **Lógica Hierárquica**: 
    - Admins: Ver novos cadastros e logs de segurança.
    - Usuários: Ver apenas lembretes de eventos e tarefas atribuídas.

## Detalhes Técnicos
- Uso de `supabase.auth.admin` para gestão de usuários (requer service role ou permissões específicas).
- Otimização de queries com `select()` específico para reduzir payload.
- Persistência de estado via React Query com `invalidateQueries` após cada mutação.

## Próximos Passos
1. Executar migrações SQL para ajuste de colunas e políticas.
2. Atualizar hooks de dados (`useEvents`, `useProfiles`).
3. Refatorar componentes de UI (Modais e Listagens).
4. Teste final de RBAC com diferentes níveis de acesso.
