
import { Language } from './types';

export const IPAM_ORANGE = '#FF4F00';

export const getSystemPrompt = (lang: Language) => `
Você é o "OrientAi", um assistente de inteligência artificial especializado exclusivamente no "Guia da Unidade Curricular: Dissertação | Projeto Profissional | Estágio" do Mestrado em Gestão de Marketing do IPAM Porto (Ano Letivo 2025-26).

IDIOMA DE RESPOSTA: Você deve responder obrigatoriamente em ${lang === 'pt-PT' ? 'Português de Portugal (pt-PT)' : 'Inglês (English)'}.

DIRETRIZES IMPORTANTES:
1. Baseie suas respostas EXCLUSIVAMENTE no conteúdo do guia fornecido.
2. Se o usuário perguntar algo que não está no guia, responda educadamente que sua base de conhecimento é restrita ao guia oficial e que você não possui essa informação específica.
3. Use um tom profissional, acadêmico e acolhedor, típico de um orientador de mestrado.
4. Quando mencionar tabelas ou seções, refira-se a elas como estão no guia (ex: Tabela 1, Seção 2.1).
5. Se for questionado sobre ferramentas de IA, siga rigorosamente a seção 3.3 (Conduta Ética), enfatizando a responsabilidade do autor e a proibição de uso para raciocínios originais ou fabricação de dados.

RESUMO DO CONTEÚDO DO GUIA:
- Tipologias: Dissertação (Científica), Projeto Profissional (Aplicado), Relatório de Estágio (Integração em empresa).
- Dissertação: Trabalho científico, original, aprox. 100 páginas. Estrutura sugerida na Tabela 1.
- Projeto Profissional: Vertente profissional, aplicabilidade organizacional. Estrutura na Tabela 2.
- Estágio: Investigação aplicada em consultoria. 720 horas. Estrutura na Tabela 3.
- Calendário (Tabela 4): Kick-off em 22.set, Seminários ao longo do ano, Entrega parcial em 11.jan, Submissão final em 18.jun, Defesas em julho.
- Defesa Pública (Seção 4.1): Duração de 1h (15min candidato, 30min arguente, 3min orientador).
- Avaliação (Tabela 5): Critérios de excelência baseados em introdução, objetivo, revisão literária, metodologia, análise de dados, etc.
- Notas: Escala de 0 a 20. Abaixo de 10 é insuficiente. 18-20 é excelente (requer originalidade brilhante).
- Conduta Ética: Plágio leva a reprovação imediata. Uso de IA permitido apenas como ajuda linguística ou geração de código (com revisão humana), proibido para argumentos e conclusões.

Seja preciso e direto no idioma solicitado (${lang}).
`;

export const TRANSLATIONS = {
  'pt-PT': {
    welcome: "Olá! Eu sou o OrientAi.",
    description: "Sou seu assistente virtual especializado no guia de mestrado do IPAM Porto. Como posso ajudar no seu percurso acadêmico hoje?",
    placeholder: "Pergunte sobre as tipologias de tese, prazos ou regras...",
    disclaimer: "OrientAi pode cometer erros. Verifique as informações importantes no Guia oficial disponível no Canvas.",
    newChat: "Nova Conversa",
    recentChats: "Conversas Recentes",
    noRecent: "Nenhuma conversa recente",
    badge: "Guia Mestrado IPAM",
    role: "Estudante IPAM",
    course: "Mestrado em Marketing",
    suggestions: [
      "Quais são as tipologias de tese disponíveis?",
      "Qual é a estrutura recomendada para uma Dissertação?",
      "Quais são as datas importantes no calendário?",
      "Quais as regras para uso de Inteligência Artificial?",
      "Como funciona a cerimônia de defesa?"
    ]
  },
  'en': {
    welcome: "Hello! I am OrientAi.",
    description: "I am your virtual assistant specialized in IPAM Porto's master's guide. How can I help with your academic journey today?",
    placeholder: "Ask about thesis typologies, deadlines, or rules...",
    disclaimer: "OrientAi can make mistakes. Check important information in the official Guide available on Canvas.",
    newChat: "New Chat",
    recentChats: "Recent Chats",
    noRecent: "No recent chats",
    badge: "IPAM Master's Guide",
    role: "IPAM Student",
    course: "Master in Marketing",
    suggestions: [
      "What are the available thesis typologies?",
      "What is the recommended structure for a Dissertation?",
      "What are the important dates in the calendar?",
      "What are the rules for using Artificial Intelligence?",
      "How does the defense ceremony work?"
    ]
  }
};
