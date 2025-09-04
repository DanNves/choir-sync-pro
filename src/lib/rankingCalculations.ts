// Ranking calculation service
export interface UserScore {
  userId: string
  nome: string
  equipe: string
  instrumento: string
  pontuacao: number
  presenca: number
  notaMedia: number
  medalhas: { ouro: number; prata: number; bronze: number }
  mudanca: number
  posicao?: number
}

export interface TeamScore {
  teamId: string
  nome: string
  membros: number
  pontuacaoTotal: number
  pontuacaoMedia: number
  presencaMedia: number
  notaMedia: number
  mudanca: number
  posicao?: number
}

export interface Achievement {
  id: string
  usuario: string
  conquista: string
  tipo: "Presença" | "Avaliação" | "Ranking" | "Participação"
  data: string
  pontos: number
}

// Mock users data - in real app this would come from a users service
const mockUsers = [
  { id: "u1", nome: "João Silva", equipe: "Coral Juvenil", instrumento: "Vocal/Piano" },
  { id: "u2", nome: "Maria Santos", equipe: "Banda de Instrumentistas", instrumento: "Órgão" },
  { id: "u3", nome: "Carlos Lima", equipe: "Coral Adulto", instrumento: "Vocal" },
  { id: "u4", nome: "Ana Oliveira", equipe: "Orquestra Regional", instrumento: "Violino" },
  { id: "u5", nome: "Pedro Costa", equipe: "Banda de Instrumentistas", instrumento: "Bateria" },
  { id: "u6", nome: "Lucia Ferreira", equipe: "Coral Juvenil", instrumento: "Flauta" },
  { id: "u7", nome: "Roberto Silva", equipe: "Coral Adulto", instrumento: "Saxofone" }
]

// Mock teams data
const mockTeams = [
  { id: "t1", nome: "Coral Adulto", membros: ["u3", "u7"] },
  { id: "t2", nome: "Coral Juvenil", membros: ["u1", "u6"] },
  { id: "t3", nome: "Banda de Instrumentistas", membros: ["u2", "u5"] },
  { id: "t4", nome: "Orquestra Regional", membros: ["u4"] }
]

// Mock presence data - would come from events/presence service
const mockPresenceData = [
  { userId: "u1", presencaPercentual: 98.5, eventosParticipados: 20, totalEventos: 20 },
  { userId: "u2", presencaPercentual: 97.2, eventosParticipados: 35, totalEventos: 36 },
  { userId: "u3", presencaPercentual: 96.8, eventosParticipados: 31, totalEventos: 32 },
  { userId: "u4", presencaPercentual: 94.3, eventosParticipados: 17, totalEventos: 18 },
  { userId: "u5", presencaPercentual: 93.7, eventosParticipados: 28, totalEventos: 30 },
  { userId: "u6", presencaPercentual: 95.1, eventosParticipados: 19, totalEventos: 20 },
  { userId: "u7", presencaPercentual: 92.4, eventosParticipados: 25, totalEventos: 27 }
]

// Mock questionnaire responses - would come from questionnaires service
const mockQuestionnaireData = [
  { userId: "u1", totalScore: 184, totalPossible: 200, mediaNotas: 9.2, avaliacoesCompletas: 8 },
  { userId: "u2", totalScore: 178, totalPossible: 200, mediaNotas: 8.9, avaliacoesCompletas: 9 },
  { userId: "u3", totalScore: 174, totalPossible: 200, mediaNotas: 8.7, avaliacoesCompletas: 7 },
  { userId: "u4", totalScore: 168, totalPossible: 200, mediaNotas: 8.4, avaliacoesCompletas: 6 },
  { userId: "u5", totalScore: 162, totalPossible: 200, mediaNotas: 8.1, avaliacoesCompletas: 5 },
  { userId: "u6", totalScore: 171, totalPossible: 200, mediaNotas: 8.6, avaliacoesCompletas: 7 },
  { userId: "u7", totalScore: 159, totalPossible: 200, mediaNotas: 8.0, avaliacoesCompletas: 6 }
]

// Mock achievements data
const mockAchievements: Achievement[] = [
  { id: "a1", usuario: "João Silva", conquista: "Presença Perfeita - Janeiro", tipo: "Presença", data: "Hoje", pontos: 100 },
  { id: "a2", usuario: "Maria Santos", conquista: "Nota Máxima - Teoria Musical", tipo: "Avaliação", data: "Ontem", pontos: 150 },
  { id: "a3", usuario: "Carlos Lima", conquista: "Líder Semanal", tipo: "Ranking", data: "2 dias atrás", pontos: 75 },
  { id: "a4", usuario: "João Silva", conquista: "10 Avaliações Completas", tipo: "Participação", data: "3 dias atrás", pontos: 80 },
  { id: "a5", usuario: "Ana Oliveira", conquista: "Primeira Colocação - Violino", tipo: "Ranking", data: "1 semana atrás", pontos: 120 }
]

// Scoring weights
const SCORING_WEIGHTS = {
  presence: 0.4,      // 40% do score vem da presença
  evaluations: 0.5,   // 50% do score vem das avaliações
  achievements: 0.1   // 10% do score vem das conquistas
}

// Base points for different metrics
const BASE_POINTS = {
  maxPresencePoints: 1000,
  maxEvaluationPoints: 1000,
  achievementMultiplier: 1
}

export function calculateUserScore(userId: string): UserScore {
  const user = mockUsers.find(u => u.id === userId)
  if (!user) throw new Error(`User ${userId} not found`)

  const presenceData = mockPresenceData.find(p => p.userId === userId)
  const evaluationData = mockQuestionnaireData.find(q => q.userId === userId)
  const userAchievements = mockAchievements.filter(a => a.usuario === user.nome)

  // Calculate presence score (0-1000 points)
  const presenceScore = presenceData 
    ? (presenceData.presencaPercentual / 100) * BASE_POINTS.maxPresencePoints
    : 0

  // Calculate evaluation score (0-1000 points) 
  const evaluationScore = evaluationData
    ? (evaluationData.totalScore / evaluationData.totalPossible) * BASE_POINTS.maxEvaluationPoints
    : 0

  // Calculate achievements score
  const achievementScore = userAchievements.reduce((sum, achievement) => 
    sum + (achievement.pontos * BASE_POINTS.achievementMultiplier), 0
  )

  // Calculate total weighted score
  const totalScore = Math.round(
    (presenceScore * SCORING_WEIGHTS.presence) +
    (evaluationScore * SCORING_WEIGHTS.evaluations) +
    (achievementScore * SCORING_WEIGHTS.achievements)
  )

  // Calculate medals based on achievements
  const medalhas = {
    ouro: userAchievements.filter(a => a.pontos >= 120).length,
    prata: userAchievements.filter(a => a.pontos >= 80 && a.pontos < 120).length,
    bronze: userAchievements.filter(a => a.pontos >= 50 && a.pontos < 80).length
  }

  return {
    userId: user.id,
    nome: user.nome,
    equipe: user.equipe,
    instrumento: user.instrumento,
    pontuacao: totalScore,
    presenca: presenceData?.presencaPercentual || 0,
    notaMedia: evaluationData?.mediaNotas || 0,
    medalhas,
    mudanca: 0 // This would be calculated by comparing with previous rankings
  }
}

export function calculateIndividualRanking(): UserScore[] {
  const userScores = mockUsers.map(user => calculateUserScore(user.id))
  
  // Sort by score (descending)
  userScores.sort((a, b) => b.pontuacao - a.pontuacao)
  
  // Add positions and calculate rank changes
  return userScores.map((user, index) => ({
    ...user,
    posicao: index + 1,
    mudanca: Math.floor(Math.random() * 5) - 2 // Mock rank change (-2 to +2)
  }))
}

export function calculateTeamRanking(): TeamScore[] {
  const teamScores = mockTeams.map(team => {
    const memberScores = team.membros.map(memberId => calculateUserScore(memberId))
    
    const pontuacaoTotal = memberScores.reduce((sum, member) => sum + member.pontuacao, 0)
    const pontuacaoMedia = Math.round(pontuacaoTotal / memberScores.length)
    const presencaMedia = memberScores.reduce((sum, member) => sum + member.presenca, 0) / memberScores.length
    const notaMedia = memberScores.reduce((sum, member) => sum + member.notaMedia, 0) / memberScores.length

    return {
      teamId: team.id,
      nome: team.nome,
      membros: team.membros.length,
      pontuacaoTotal,
      pontuacaoMedia,
      presencaMedia: Math.round(presencaMedia * 10) / 10,
      notaMedia: Math.round(notaMedia * 10) / 10,
      mudanca: 0
    }
  })

  // Sort by total score (descending)
  teamScores.sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal)
  
  // Add positions and mock rank changes
  return teamScores.map((team, index) => ({
    ...team,
    posicao: index + 1,
    mudanca: Math.floor(Math.random() * 3) - 1 // Mock rank change (-1 to +1)
  }))
}

export function getRecentAchievements(): Achievement[] {
  return mockAchievements.slice().sort((a, b) => {
    // Sort by date (most recent first)
    const dateA = a.data === "Hoje" ? 0 : a.data === "Ontem" ? 1 : parseInt(a.data.split(' ')[0]) || 999
    const dateB = b.data === "Hoje" ? 0 : b.data === "Ontem" ? 1 : parseInt(b.data.split(' ')[0]) || 999
    return dateA - dateB
  })
}

export function getRankingStats() {
  const individualRanking = calculateIndividualRanking()
  const teamRanking = calculateTeamRanking()
  const achievements = getRecentAchievements()

  return {
    totalParticipants: individualRanking.length,
    maxScore: Math.max(...individualRanking.map(u => u.pontuacao)),
    averageScore: Math.round(individualRanking.reduce((sum, u) => sum + u.pontuacao, 0) / individualRanking.length),
    totalAchievements: achievements.length,
    individualRanking: individualRanking.slice(0, 10), // Top 10
    teamRanking,
    recentAchievements: achievements.slice(0, 10)
  }
}