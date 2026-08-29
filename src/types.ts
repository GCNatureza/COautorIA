export interface RevisionChange {
  categoria: 'Gramática e Ortografia' | 'Clareza e Coesão' | 'Linguagem Científica' | 'Estrutura e Síntese';
  trechoOriginal: string;
  sugestaoMelhoria: string;
  explicacaoMotivo: string;
}

export interface ResearchSource {
  titulo: string;
  tipo: 'Portal Acadêmico' | 'Artigo / Periódico' | 'Instituição Científica' | 'Base de Dados' | 'Guia de Pesquisa';
  descricao: string;
  termoBuscaOuLink: string;
  dicaAplicacao: string;
}

export interface RevisionResult {
  tema: string;
  secao: string;
  tituloSugerido: string;
  focoParagrafo1: string;
  paragrafo1: string;
  focoParagrafo2: string;
  paragrafo2: string;
  textoCompleto: string;
  resumoDasMudancas: string;
  pontosAlterados: RevisionChange[];
  fontesPesquisa: ResearchSource[];
  dicasMostra: string[];
  estatisticas: {
    palavrasOriginal: number;
    palavrasRevisado: number;
    totalParagrafos: number;
  };
}

export interface SampleDraft {
  id: string;
  tema: string;
  secao: string;
  titulo: string;
  area: string;
  nivel: string;
  rascunho: string;
}

export interface SectionStructureDefinition {
  id: string;
  nome: string;
  icone: string;
  focoP1: string;
  focoP2: string;
  descricao: string;
  dicaPlaceholder: string;
}
