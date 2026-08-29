import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Scientific draft revision endpoint
app.post('/api/revise', async (req, res) => {
  try {
    const { draft, topic, section, projectArea, projectLevel } = req.body;

    if (!draft || typeof draft !== 'string' || draft.trim().length === 0) {
      return res.status(400).json({ error: 'O rascunho da seção é obrigatório.' });
    }

    const secaoEscolhida = section || 'Introdução';
    const temaEscolhido = topic || 'Trabalho Científico Escolar';

    const ai = getGeminiClient();

    const systemPrompt = `Você é um mentor e avaliador de excelência de Mostras Científicas e Feiras de Ciências Escolares (Ensino Fundamental e Médio).
O estudante está escrevendo o texto de UMA SEÇÃO ESPECÍFICA do seu trabalho científico por vez (por exemplo: Introdução, Justificativa, Problema e Hipótese, Objetivos, Metodologia, Resultados e Discussão, Conclusão ou Resumo Geral).

SUA MISSÃO:
Transformar o rascunho do estudante em um texto científico formal, rigoroso, coeso e elegante para a SEÇÃO INFORMADA, respeitando rigorosamente a seguinte regra:

REGRAS OBRIGATÓRIAS:
1. O texto revisado da SEÇÃO DEVE SER COMPOSTO ESTRITAMENTE POR DOIS PARÁGRAFOS (nem mais, nem menos), focados especificamente nos objetivos e estrutura daquela seção:
   - Se for "Introdução":
     * 1º Parágrafo: Contextualização temática ampla no cenário atual e apresentação do problema de pesquisa investigado.
     * 2º Parágrafo: Delimitação do escopo do estudo na escola/comunidade, relevância acadêmica e articulação com a proposta do projeto.
   - Se for "Justificativa":
     * 1º Parágrafo: Relevância social, ambiental, pedagógica ou tecnológica do tema e identificação da lacuna de conhecimento.
     * 2º Parágrafo: Impacto prático da solução, justificativa do estudo para a comunidade local e motivação dos pesquisadores.
   - Se for "Problema e Hipótese":
     * 1º Parágrafo: Contextualização e formulação clara da pergunta norteadora de pesquisa.
     * 2º Parágrafo: Formulação formal da hipótese testável com variáveis e fundamentação lógica.
   - Se for "Objetivos":
     * 1º Parágrafo: Apresentação do Objetivo Geral do projeto com verbo de ação preciso e finalidade primordial.
     * 2º Parágrafo: Detalhamento dos Objetivos Específicos e metas intermediárias sequenciais.
   - Se for "Metodologia":
     * 1º Parágrafo: Especificação dos materiais, equipamentos, amostras, grupos de controle e preparação do ambiente.
     * 2º Parágrafo: Procedimento experimental sequencial, rotina de medições, coleta de dados e variáveis controladas.
   - Se for "Resultados e Discussão":
     * 1º Parágrafo: Apresentação clara dos dados coletados, medições quantitativas e observações principais.
     * 2º Parágrafo: Análise e interpretação científica dos dados, confronto com a literatura ou hipótese inicial.
   - Se for "Conclusão":
     * 1º Parágrafo: Resposta direta ao objetivo geral e verificação da hipótese à luz dos dados obtidos.
     * 2º Parágrafo: Contribuições do estudo, limitações observadas e sugestões fundamentadas para pesquisas futuras.
   - Se for "Resumo Geral do Projeto":
     * 1º Parágrafo: Contextualização, justificativa, problema e objetivo geral.
     * 2º Parágrafo: Metodologia sintética, principais resultados e conclusão/impacto.
   - Para qualquer outra seção: dividir a lógica do conteúdo da seção em dois parágrafos progressivos e bem delimitados.

2. Mantenha a essência, as descobertas e a autoria do aluno, mas eleve a redação para a norma culta, voz impessoal científica (3ª pessoa ou impessoal), precisão terminológica e coesão textual.
3. Aponte detalhadamente as mudanças realizadas com o trecho original, como ficou e a justificativa pedagógica.
4. Indique fontes e referências de pesquisa reais e pertinentes ao TEMA e à SEÇÃO (Google Acadêmico, SciELO, Embrapa, Fiocruz, IBGE, normas ABNT ou periódicos).
5. Forneça dicas valiosas e práticas para defender essa seção na banca avaliadora da Mostra Científica.`;

    const userPrompt = `Analise e transforme o rascunho do aluno para a seção indicada:

TEMA DO TRABALHO: ${temaEscolhido}
SEÇÃO ESCOLHIDA: ${secaoEscolhida}
ÁREA DO CONHECIMENTO: ${projectArea || 'Geral / Multidisciplinar'}
ETAPA ESCOLAR: ${projectLevel || 'Ensino Fundamental II / Médio'}

RASCUNHO DA SEÇÃO FEITO PELO ALUNO:
"""
${draft.trim()}
"""

Retorne o resultado no formato JSON estrito conforme o esquema, garantindo que os dois parágrafos sejam específicos para a seção "${secaoEscolhida}".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tituloSugerido: {
              type: Type.STRING,
              description: 'Título ou subtítulo acadêmico sugerido para esta seção e trabalho',
            },
            focoParagrafo1: {
              type: Type.STRING,
              description: 'Breve descrição de 3 a 6 palavras do papel desempenhado pelo 1º parágrafo nesta seção (ex: Contextualização e Problema Central)',
            },
            paragrafo1: {
              type: Type.STRING,
              description: 'Texto do primeiro parágrafo formal e aprimorado desta seção',
            },
            focoParagrafo2: {
              type: Type.STRING,
              description: 'Breve descrição de 3 a 6 palavras do papel desempenhado pelo 2º parágrafo nesta seção (ex: Relevância e Escopo do Estudo)',
            },
            paragrafo2: {
              type: Type.STRING,
              description: 'Texto do segundo parágrafo formal e aprimorado desta seção',
            },
            resumoDasMudancas: {
              type: Type.STRING,
              description: 'Avaliação pedagógica encorajadora destacando a evolução da escrita desta seção',
            },
            pontosAlterados: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  categoria: {
                    type: Type.STRING,
                    description: 'Categoria da alteração (Gramática e Ortografia, Clareza e Coesão, Linguagem Científica, Estrutura e Síntese)',
                  },
                  trechoOriginal: {
                    type: Type.STRING,
                    description: 'Trecho aproximado ou linguagem informal do rascunho do aluno',
                  },
                  sugestaoMelhoria: {
                    type: Type.STRING,
                    description: 'Como foi estruturado no texto científico',
                  },
                  explicacaoMotivo: {
                    type: Type.STRING,
                    description: 'Justificativa pedagógica/científica da mudança',
                  },
                },
                required: ['categoria', 'trechoOriginal', 'sugestaoMelhoria', 'explicacaoMotivo'],
              },
            },
            fontesPesquisa: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  titulo: {
                    type: Type.STRING,
                    description: 'Nome da fonte, artigo, autoridade ou base acadêmica',
                  },
                  tipo: {
                    type: Type.STRING,
                    description: 'Tipo da fonte (Portal Acadêmico, Artigo / Periódico, Instituição Científica, Base de Dados, Guia de Pesquisa)',
                  },
                  descricao: {
                    type: Type.STRING,
                    description: 'Por que esta fonte enriquece o tema e esta seção do projeto',
                  },
                  termoBuscaOuLink: {
                    type: Type.STRING,
                    description: 'Termo de busca recomendado no Google Acadêmico/SciELO',
                  },
                  dicaAplicacao: {
                    type: Type.STRING,
                    description: 'Como o estudante pode citar ou utilizar essa referência no caderno ou banner',
                  },
                },
                required: ['titulo', 'tipo', 'descricao', 'termoBuscaOuLink', 'dicaAplicacao'],
              },
            },
            dicasMostra: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: '2 a 3 orientações específicas para defender esta seção na banca de avaliação da feira',
            },
          },
          required: [
            'tituloSugerido',
            'focoParagrafo1',
            'paragrafo1',
            'focoParagrafo2',
            'paragrafo2',
            'resumoDasMudancas',
            'pontosAlterados',
            'fontesPesquisa',
            'dicasMostra',
          ],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');

    // Calculate statistics
    const p1 = (parsedJson.paragrafo1 || '').trim();
    const p2 = (parsedJson.paragrafo2 || '').trim();
    const textoCompleto = `${p1}\n\n${p2}`;

    const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

    const result = {
      ...parsedJson,
      tema: temaEscolhido,
      secao: secaoEscolhida,
      focoParagrafo1: parsedJson.focoParagrafo1 || '1º Parágrafo da Seção',
      focoParagrafo2: parsedJson.focoParagrafo2 || '2º Parágrafo da Seção',
      paragrafo1: p1,
      paragrafo2: p2,
      textoCompleto,
      estatisticas: {
        palavrasOriginal: countWords(draft),
        palavrasRevisado: countWords(textoCompleto),
        totalParagrafos: 2,
      },
    };

    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/revise:', error);
    return res.status(500).json({
      error: error.message || 'Erro ao processar a revisão do trabalho científico.',
    });
  }
});

// Setup Vite / Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

