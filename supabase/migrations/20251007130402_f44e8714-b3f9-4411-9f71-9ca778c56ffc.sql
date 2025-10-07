-- Criar enum para papéis de usuário
CREATE TYPE public.app_role AS ENUM (
  'candidato',
  'musico',
  'instrutor',
  'encarregado_local',
  'encarregado_regional',
  'examinadora',
  'cooperador_jovens',
  'cooperador_oficio',
  'anciao',
  'diacono',
  'administrador'
);

-- Tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  instrumento TEXT,
  endereco TEXT,
  localidade TEXT,
  regiao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Tabela de papéis de usuário (SEPARADA para segurança)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função de segurança para verificar papéis
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Função para verificar se é admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'administrador')
$$;

-- Tabela de equipes
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  instrutor_id UUID REFERENCES public.profiles(id),
  localidade TEXT,
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Tabela de membros de equipes
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Tabela de eventos
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  duracao INTEGER NOT NULL,
  local TEXT NOT NULL,
  responsavel TEXT NOT NULL,
  participantes_esperados INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Agendado',
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Tabela de presenças
CREATE TABLE public.attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Presente',
  horario_entrada TIME,
  horario_saida TIME,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;

-- Tabela de questionários
CREATE TABLE public.questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  event_id UUID REFERENCES public.events(id),
  tipo TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;

-- Tabela de perguntas dos questionários
CREATE TABLE public.questionnaire_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID REFERENCES public.questionnaires(id) ON DELETE CASCADE NOT NULL,
  texto TEXT NOT NULL,
  tipo TEXT NOT NULL,
  opcoes JSONB,
  peso INTEGER NOT NULL DEFAULT 1,
  obrigatorio BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.questionnaire_questions ENABLE ROW LEVEL SECURITY;

-- Tabela de respostas aos questionários
CREATE TABLE public.questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID REFERENCES public.questionnaires(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questionnaire_questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  resposta TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(questionnaire_id, question_id, user_id)
);

ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Trigger para criar perfil quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, telefone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    NEW.raw_user_meta_data->>'telefone'
  );
  
  -- Adicionar papel padrão de candidato
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'candidato');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendances_updated_at BEFORE UPDATE ON public.attendances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_questionnaires_updated_at BEFORE UPDATE ON public.questionnaires
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies para profiles
CREATE POLICY "Usuários podem ver próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Usuários podem atualizar próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins podem atualizar qualquer perfil"
  ON public.profiles FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- RLS Policies para user_roles
CREATE POLICY "Usuários podem ver próprios papéis"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os papéis"
  ON public.user_roles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins podem gerenciar papéis"
  ON public.user_roles FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies para teams
CREATE POLICY "Todos podem ver equipes"
  ON public.teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins e instrutores podem criar equipes"
  ON public.teams FOR INSERT
  WITH CHECK (
    public.is_admin(auth.uid()) OR
    public.has_role(auth.uid(), 'instrutor') OR
    public.has_role(auth.uid(), 'encarregado_local')
  );

CREATE POLICY "Admins e instrutores podem atualizar equipes"
  ON public.teams FOR UPDATE
  USING (
    public.is_admin(auth.uid()) OR
    public.has_role(auth.uid(), 'instrutor') OR
    instrutor_id = auth.uid()
  );

CREATE POLICY "Admins podem deletar equipes"
  ON public.teams FOR DELETE
  USING (public.is_admin(auth.uid()));

-- RLS Policies para team_members
CREATE POLICY "Membros podem ver própria participação"
  ON public.team_members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Todos autenticados podem ver membros"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins e instrutores podem gerenciar membros"
  ON public.team_members FOR ALL
  USING (
    public.is_admin(auth.uid()) OR
    public.has_role(auth.uid(), 'instrutor') OR
    public.has_role(auth.uid(), 'encarregado_local')
  );

-- RLS Policies para events
CREATE POLICY "Todos podem ver eventos"
  ON public.events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins e encarregados podem criar eventos"
  ON public.events FOR INSERT
  WITH CHECK (
    public.is_admin(auth.uid()) OR
    public.has_role(auth.uid(), 'encarregado_local')
  );

CREATE POLICY "Admins e encarregados podem atualizar eventos"
  ON public.events FOR UPDATE
  USING (
    public.is_admin(auth.uid()) OR
    public.has_role(auth.uid(), 'encarregado_local')
  );

CREATE POLICY "Admins podem deletar eventos"
  ON public.events FOR DELETE
  USING (public.is_admin(auth.uid()));

-- RLS Policies para attendances
CREATE POLICY "Usuários podem ver próprias presenças"
  ON public.attendances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins e instrutores podem ver todas presenças"
  ON public.attendances FOR SELECT
  USING (
    public.is_admin(auth.uid()) OR
    public.has_role(auth.uid(), 'instrutor') OR
    public.has_role(auth.uid(), 'encarregado_local')
  );

CREATE POLICY "Admins e encarregados podem registrar presenças"
  ON public.attendances FOR INSERT
  WITH CHECK (
    public.is_admin(auth.uid()) OR
    public.has_role(auth.uid(), 'encarregado_local') OR
    public.has_role(auth.uid(), 'instrutor')
  );

CREATE POLICY "Admins e encarregados podem atualizar presenças"
  ON public.attendances FOR UPDATE
  USING (
    public.is_admin(auth.uid()) OR
    public.has_role(auth.uid(), 'encarregado_local') OR
    public.has_role(auth.uid(), 'instrutor')
  );

CREATE POLICY "Admins podem deletar presenças"
  ON public.attendances FOR DELETE
  USING (public.is_admin(auth.uid()));

-- RLS Policies para questionnaires
CREATE POLICY "Todos podem ver questionários"
  ON public.questionnaires FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins e instrutores podem criar questionários"
  ON public.questionnaires FOR INSERT
  WITH CHECK (
    public.is_admin(auth.uid()) OR
    public.has_role(auth.uid(), 'instrutor') OR
    public.has_role(auth.uid(), 'encarregado_local')
  );

CREATE POLICY "Admins e instrutores podem atualizar questionários"
  ON public.questionnaires FOR UPDATE
  USING (
    public.is_admin(auth.uid()) OR
    public.has_role(auth.uid(), 'instrutor') OR
    public.has_role(auth.uid(), 'encarregado_local')
  );

CREATE POLICY "Admins podem deletar questionários"
  ON public.questionnaires FOR DELETE
  USING (public.is_admin(auth.uid()));

-- RLS Policies para questionnaire_questions
CREATE POLICY "Todos podem ver perguntas"
  ON public.questionnaire_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins e instrutores podem gerenciar perguntas"
  ON public.questionnaire_questions FOR ALL
  USING (
    public.is_admin(auth.uid()) OR
    public.has_role(auth.uid(), 'instrutor') OR
    public.has_role(auth.uid(), 'encarregado_local')
  );

-- RLS Policies para questionnaire_responses
CREATE POLICY "Usuários podem ver próprias respostas"
  ON public.questionnaire_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins e instrutores podem ver todas respostas"
  ON public.questionnaire_responses FOR SELECT
  USING (
    public.is_admin(auth.uid()) OR
    public.has_role(auth.uid(), 'instrutor') OR
    public.has_role(auth.uid(), 'examinadora')
  );

CREATE POLICY "Usuários podem criar próprias respostas"
  ON public.questionnaire_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar próprias respostas"
  ON public.questionnaire_responses FOR UPDATE
  USING (auth.uid() = user_id);