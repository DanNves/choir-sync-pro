# Plano de Melhoria Completa do Sistema Musical

Este plano visa transformar o sistema atual em uma plataforma robusta, visualmente atraente e funcional, focada em "dar vida" à gestão musical.

## 1. Experiência Visual e UI (Dashboard e Interface)
- **Dashboard "Vivo"**: Adicionar gráficos de desempenho (presença nos últimos 6 meses, evolução de notas técnicas).
- **Tematização Musical**: Substituir ícones genéricos por ícones mais específicos de música (partituras, instrumentos específicos) onde apropriado.
- **Micro-interações**: Adicionar animações suaves ao abrir modais, trocar abas e carregar dados.

## 2. Funcionalidades de Equipes e Membros
- **Gestão de Instrumentos**: Implementar um controle mais refinado de instrumentos (quem tem, estado do instrumento, histórico de empréstimo se aplicável).
- **Cálculo de Desempenho Real**: Conectar o ranking não apenas à presença, mas também às notas de questionários técnicos, criando uma média ponderada real.
- **Equipes Dinâmicas**: Permitir que membros pertençam a mais de uma equipe e visualizar estatísticas consolidadas.

## 3. Sistema de Questionários e Avaliação
- **Banco de Perguntas**: Criar um sistema onde instrutores possam reutilizar perguntas em diferentes questionários.
- **Gráficos de Resposta**: Visualizar o desempenho da equipe por pergunta para identificar onde os membros estão tendo mais dificuldade técnica.

## 4. Otimização Técnica e Performance
- **Otimização de Consultas**: Refinar os hooks de Supabase para buscar dados apenas quando necessário e usar `React Query` ou similar para cache eficiente.
- **Tratamento de Dados**: Garantir que todos os IDs de banco de dados sejam substituídos por nomes amigáveis em todas as telas (correção de "ajustes finos").

## 5. Notificações e Engajamento
- **Histórico de Notificações**: Uma página dedicada para ver todas as notificações passadas.
- **Notificações por Email/Push**: Preparar a estrutura para integração real de disparos.

## Detalhes Técnicos
- Utilização de `Recharts` para visualização de dados no Dashboard.
- Refatoração dos hooks `useTeams` e `useProfiles` para incluir lógica de agregação de dados.
- Implementação de policies RLS mais granulares para garantir que usuários só vejam o que suas roles permitem no nível de banco.
