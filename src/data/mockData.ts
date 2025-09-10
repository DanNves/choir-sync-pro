// Dados mockados para desenvolvimento
export const mockUsers = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
    papel: "Músico",
    instrumento: "Vocal/Piano",
    status: "Ativo",
    equipe: "Coral Juvenil",
    dataIngresso: "2023-01-15",
    endereco: "Rua das Flores, 123 - São Paulo/SP"
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria.santos@email.com", 
    telefone: "(11) 97654-3210",
    papel: "Organista",
    instrumento: "Órgão",
    status: "Ativo",
    equipe: "Banda de Instrumentistas",
    dataIngresso: "2022-08-20",
    endereco: "Av. Central, 456 - São Paulo/SP"
  },
  {
    id: 3,
    nome: "Carlos Lima",
    email: "carlos.lima@email.com",
    telefone: "(11) 96543-2109",
    papel: "Ancião",
    instrumento: "Vocal",
    status: "Ativo",
    equipe: "Coral Adulto",
    dataIngresso: "2021-03-10",
    endereco: "Rua da Paz, 789 - São Paulo/SP"
  },
  {
    id: 4,
    nome: "Ana Oliveira",
    email: "ana.oliveira@email.com",
    telefone: "(11) 95432-1098",
    papel: "Músico",
    instrumento: "Violino",
    status: "Ativo",
    equipe: "Orquestra Regional",
    dataIngresso: "2023-05-22",
    endereco: "Rua Harmonia, 321 - São Paulo/SP"
  },
  {
    id: 5,
    nome: "Pedro Costa",
    email: "pedro.costa@email.com",
    telefone: "(11) 94321-0987",
    papel: "Músico",
    instrumento: "Bateria",
    status: "Inativo",
    equipe: "Banda de Instrumentistas",
    dataIngresso: "2022-11-08",
    endereco: "Rua Melodia, 654 - São Paulo/SP"
  },
  {
    id: 6,
    nome: "Lucia Ferreira",
    email: "lucia.ferreira@email.com",
    telefone: "(11) 93210-9876",
    papel: "Encarregado",
    instrumento: "Flauta",
    status: "Ativo",
    equipe: "Coral Juvenil",
    dataIngresso: "2023-02-14",
    endereco: "Av. Musical, 987 - São Paulo/SP"
  }
]

export const mockEvents = [
  {
    id: 1,
    nome: "Ensaio Coral Juvenil",
    tipo: "Ensaio",
    data: "2024-03-15",
    horario: "19:00",
    duracao: "120",
    local: "Salão Principal",
    responsavel: "Lucia Ferreira",
    descricao: "Ensaio semanal do coral juvenil com foco em repertório de primavera",
    status: "Agendado",
    participantesEsperados: 25,
    participantesConfirmados: 18
  },
  {
    id: 2,
    nome: "Reunião de Instrumentistas", 
    tipo: "Reunião",
    data: "2024-03-16",
    horario: "20:00",
    duracao: "90",
    local: "Sala de Música",
    responsavel: "Maria Santos",
    descricao: "Discussão sobre arranjos musicais e distribuição de partituras",
    status: "Confirmado",
    participantesEsperados: 15,
    participantesConfirmados: 15
  },
  {
    id: 3,
    nome: "Avaliação Técnica Mensal",
    tipo: "Avaliação",
    data: "2024-03-20",
    horario: "14:00", 
    duracao: "180",
    local: "Auditório",
    responsavel: "Carlos Lima",
    descricao: "Avaliação técnica individual de todos os músicos ativos",
    status: "Planejado",
    participantesEsperados: 45,
    participantesConfirmados: 32
  },
  {
    id: 4,
    nome: "Encontro Musical de Páscoa",
    tipo: "Encontro Musical",
    data: "2024-03-31",
    horario: "15:00",
    duracao: "240",
    local: "Igreja Principal", 
    responsavel: "João Silva",
    descricao: "Apresentação especial de Páscoa com todos os grupos musicais",
    status: "Confirmado",
    participantesEsperados: 80,
    participantesConfirmados: 65
  }
]

export const mockTeams = [
  {
    id: "t1",
    name: "Coral Adulto",
    leaderId: 3,
    leaderName: "Carlos Lima",
    limit: 30,
    members: [
      { userId: 3, nome: "Carlos Lima", instrumento: "Vocal" }
    ],
    createdAt: "2023-01-10",
    status: "Ativo"
  },
  {
    id: "t2", 
    name: "Coral Juvenil",
    leaderId: 6,
    leaderName: "Lucia Ferreira",
    limit: 25,
    members: [
      { userId: 1, nome: "João Silva", instrumento: "Vocal/Piano" },
      { userId: 6, nome: "Lucia Ferreira", instrumento: "Flauta" }
    ],
    createdAt: "2023-02-01",
    status: "Ativo"
  },
  {
    id: "t3",
    name: "Banda de Instrumentistas", 
    leaderId: 2,
    leaderName: "Maria Santos",
    limit: 20,
    members: [
      { userId: 2, nome: "Maria Santos", instrumento: "Órgão" },
      { userId: 5, nome: "Pedro Costa", instrumento: "Bateria" }
    ],
    createdAt: "2022-12-15",
    status: "Ativo"
  },
  {
    id: "t4",
    name: "Orquestra Regional",
    leaderId: 4,
    leaderName: "Ana Oliveira", 
    limit: 50,
    members: [
      { userId: 4, nome: "Ana Oliveira", instrumento: "Violino" }
    ],
    createdAt: "2023-05-20",
    status: "Ativo"
  }
]

export const mockPresencas = [
  {
    id: 1,
    usuarioId: 1,
    eventoId: 1,
    usuario: "João Silva",
    evento: "Ensaio Coral Juvenil",
    data: "2024-03-08",
    horarioEntrada: "19:00",
    horarioSaida: "21:00",
    status: "Presente",
    observacoes: ""
  },
  {
    id: 2,
    usuarioId: 2,
    eventoId: 2,
    usuario: "Maria Santos",
    evento: "Reunião de Instrumentistas",
    data: "2024-03-09",
    horarioEntrada: "20:00",
    horarioSaida: "21:30",
    status: "Presente",
    observacoes: "Chegou pontualmente"
  },
  {
    id: 3,
    usuarioId: 3,
    eventoId: 1,
    usuario: "Carlos Lima",
    evento: "Ensaio Coral Juvenil", 
    data: "2024-03-08",
    horarioEntrada: "",
    horarioSaida: "",
    status: "Ausente",
    observacoes: "Informou que não poderia comparecer"
  },
  {
    id: 4,
    usuarioId: 1,
    eventoId: 3,
    usuario: "João Silva",
    evento: "Avaliação Técnica Mensal",
    data: "2024-03-10",
    horarioEntrada: "14:15",
    horarioSaida: "16:45",
    status: "Presente",
    observacoes: "Participação exemplar"
  }
]

export const mockQuestionarios = [
  {
    id: "q1",
    title: "Avaliação Técnica - Ensaio 08/03",
    description: "Avaliação do desempenho técnico e participação no ensaio",
    eventId: "e1",
    eventName: "Ensaio Coral Juvenil",
    type: "individual",
    startDate: "2024-03-08T19:00:00",
    endDate: "2024-03-10T23:59:59",
    questions: [
      {
        id: "q1_1",
        text: "Como você avalia sua preparação técnica para este ensaio?",
        type: "scale",
        weight: 2,
        required: true
      },
      {
        id: "q1_2", 
        text: "Qual foi sua maior dificuldade durante o ensaio?",
        type: "multiple",
        options: ["Ritmo", "Afinação", "Letra", "Coordenação", "Nenhuma"],
        weight: 1,
        required: true
      }
    ],
    status: "Ativo",
    responses: [
      {
        id: "r1",
        userId: 1,
        userName: "João Silva",
        submittedAt: "2024-03-09T20:30:00",
        answers: [
          { questionId: "q1_1", answer: "4" },
          { questionId: "q1_2", answer: "Nenhuma" }
        ],
        score: 95
      }
    ]
  },
  {
    id: "q2",
    title: "Feedback - Reunião Instrumentistas",
    description: "Coleta de opiniões sobre os arranjos discutidos",
    eventId: "e2", 
    eventName: "Reunião de Instrumentistas",
    type: "individual",
    startDate: "2024-03-09T20:00:00",
    endDate: "2024-03-12T23:59:59",
    questions: [
      {
        id: "q2_1",
        text: "Os arranjos propostos estão adequados ao seu instrumento?",
        type: "boolean",
        weight: 1,
        required: true
      }
    ],
    status: "Ativo",
    responses: []
  }
]

export const roles = [
  "Ancião",
  "Encarregado", 
  "Instrutor",
  "Organista",
  "Músico",
  "Coralista",
  "Visitante",
  "Candidato",
  "Ex-Membro",
  "Inativo",
  "Convidado"
]

export const instruments = [
  "Vocal",
  "Piano", 
  "Órgão",
  "Violão",
  "Guitarra",
  "Baixo",
  "Bateria",
  "Violino",
  "Viola",
  "Violoncelo",
  "Flauta",
  "Clarinete",
  "Saxofone",
  "Trompete",
  "Trombone",
  "Tuba",
  "Vocal/Piano",
  "Outro"
]

export const eventTypes = [
  "Ensaio",
  "Reunião", 
  "Avaliação",
  "Encontro Musical",
  "Apresentação",
  "Workshop",
  "Culto",
  "Conferência"
]