import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Search,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Sparkles,
  ArrowRightLeft,
  GraduationCap,
  Layers,
  FileCheck,
  Lightbulb,
  Download,
  Award
} from 'lucide-react';
import { RevisionResult, RevisionChange } from '../types';

interface RevisionViewerProps {
  result: RevisionResult;
  originalDraft: string;
}

export const RevisionViewer: React.FC<RevisionViewerProps> = ({ result, originalDraft }) => {
  const [activeTab, setActiveTab] = useState<'final' | 'diff'>('final');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedP1, setCopiedP1] = useState(false);
  const [copiedP2, setCopiedP2] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const copyToClipboard = (text: string, type: 'all' | 'p1' | 'p2') => {
    navigator.clipboard.writeText(text);
    if (type === 'all') {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } else if (type === 'p1') {
      setCopiedP1(true);
      setTimeout(() => setCopiedP1(false), 2000);
    } else if (type === 'p2') {
      setCopiedP2(true);
      setTimeout(() => setCopiedP2(false), 2000);
    }
  };

  const handleDownload = () => {
    const content = `TRABALHO PARA MOSTRA CIENTÍFICA
Tema do Trabalho: ${result.tema || 'Não informado'}
Seção do Trabalho: ${result.secao || 'Seção Científica'}
Título/Subtítulo Sugerido: ${result.tituloSugerido}

1º PARÁGRAFO (${result.focoParagrafo1 || 'Contextualização & Abertura da Seção'}):
${result.paragrafo1}

2º PARÁGRAFO (${result.focoParagrafo2 || 'Detalhamento & Fechamento da Seção'}):
${result.paragrafo2}

---
PONTOS ALTERADOS E JUSTIFICATIVAS NA SEÇÃO:
${result.pontosAlterados
  .map(
    (item, index) =>
      `${index + 1}. [${item.categoria}]
Original: "${item.trechoOriginal}"
Melhoria: "${item.sugestaoMelhoria}"
Motivo: ${item.explicacaoMotivo}\n`
  )
  .join('\n')}

---
FONTES DE PESQUISA RECOMENDADAS:
${result.fontesPesquisa
  .map(
    (fonte, index) =>
      `${index + 1}. ${fonte.titulo} (${fonte.tipo})
Descrição: ${fonte.descricao}
Termo de busca sugerido: ${fonte.termoBuscaOuLink}
Dica de aplicação: ${fonte.dicaAplicacao}\n`
  )
  .join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeSecao = (result.secao || 'secao').toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.download = `secao_${safeSecao}_${result.tituloSugerido.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 25)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const categories: string[] = ['Todos', ...Array.from(new Set<string>(result.pontosAlterados.map((p) => p.categoria)))];

  const filteredChanges =
    selectedCategory === 'Todos'
      ? result.pontosAlterados
      : result.pontosAlterados.filter((p) => p.categoria === selectedCategory);

  const getCategoryBarColor = (category: string) => {
    switch (category) {
      case 'Gramática e Ortografia':
        return 'bg-teal-600';
      case 'Clareza e Coesão':
        return 'bg-[#0B3B48]';
      case 'Linguagem Científica':
        return 'bg-amber-500';
      case 'Estrutura e Síntese':
        return 'bg-yellow-600';
      default:
        return 'bg-slate-400';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Gramática e Ortografia':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Clareza e Coesão':
        return 'bg-cyan-50 text-[#0B3B48] border-cyan-200';
      case 'Linguagem Científica':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Estrutura e Síntese':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Section 1: Main Scientific Result Card */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Revisão Acadêmica da Seção ({result.secao})
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="tab-final-text"
              onClick={() => setActiveTab('final')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'final'
                  ? 'bg-[#0B3B48] text-amber-300 shadow-xs border border-teal-900/20'
                  : 'text-slate-500 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              Versão Final
            </button>

            <button
              type="button"
              id="tab-diff-text"
              onClick={() => setActiveTab('diff')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'diff'
                  ? 'bg-[#0B3B48] text-amber-300 shadow-xs border border-teal-900/20'
                  : 'text-slate-500 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Comparativo
            </button>
          </div>
        </div>

        {/* The 2-Paragraph Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm relative">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-teal-50 text-[#0B3B48] border border-teal-200 text-[10px] font-bold rounded-md uppercase tracking-wider">
              Seção: {result.secao}
            </span>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold rounded-md uppercase tracking-wider">
              2 Parágrafos Metodológicos
            </span>
            {result.tema && (
              <span className="text-[11px] text-slate-500 italic max-w-md truncate">
                Tema: <strong className="text-slate-700 not-italic">{result.tema}</strong>
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pt-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {result.tituloSugerido}
            </h3>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                id="btn-copy-all"
                onClick={() => copyToClipboard(result.textoCompleto, 'all')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#0B3B48] text-amber-300 hover:bg-[#072832] border border-amber-400/30 transition-colors shadow-sm cursor-pointer"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-300" />
                    Copiar Seção
                  </>
                )}
              </button>

              <button
                type="button"
                id="btn-download-file"
                onClick={handleDownload}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                title="Baixar seção em formato .txt"
              >
                <Download className="w-3.5 h-3.5" />
                .txt
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 mb-5 leading-relaxed bg-teal-50/40 p-3 rounded-xl border border-teal-100">
            <strong className="text-[#0B3B48]">Avaliação da Seção:</strong> {result.resumoDasMudancas}
          </p>

          {activeTab === 'final' ? (
            <div className="space-y-4">
              {/* Paragraph 1 */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200 relative group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#0B3B48] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    1º Parágrafo • {result.focoParagrafo1 || 'Abertura da Seção'}
                  </span>
                  <button
                    type="button"
                    id="btn-copy-p1"
                    onClick={() => copyToClipboard(result.paragrafo1, 'p1')}
                    className="text-[11px] text-slate-400 hover:text-[#0B3B48] flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-pointer"
                  >
                    {copiedP1 ? <Check className="w-3 h-3 text-amber-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedP1 ? 'Copiado' : 'Copiar P1'}</span>
                  </button>
                </div>
                <p className="text-slate-700 leading-relaxed italic text-sm sm:text-base font-serif">
                  {result.paragrafo1}
                </p>
              </div>

              {/* Paragraph 2 */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200 relative group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#0B3B48] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    2º Parágrafo • {result.focoParagrafo2 || 'Detalhamento da Seção'}
                  </span>
                  <button
                    type="button"
                    id="btn-copy-p2"
                    onClick={() => copyToClipboard(result.paragrafo2, 'p2')}
                    className="text-[11px] text-slate-400 hover:text-[#0B3B48] flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-pointer"
                  >
                    {copiedP2 ? <Check className="w-3 h-3 text-amber-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedP2 ? 'Copiado' : 'Copiar P2'}</span>
                  </button>
                </div>
                <p className="text-slate-700 leading-relaxed italic text-sm sm:text-base font-serif">
                  {result.paragrafo2}
                </p>
              </div>
            </div>
          ) : (
            /* Diff Side-by-side */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Rascunho Original do Aluno ({result.secao})
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-mono">
                  {originalDraft}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200">
                <div className="text-[11px] font-bold text-[#0B3B48] uppercase tracking-wider mb-2">
                  Versão Científica da Seção (2 Parágrafos)
                </div>
                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif space-y-3">
                  <p>{result.paragrafo1}</p>
                  <p>{result.paragrafo2}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Geometric Split for Changes & Research Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alterações Realizadas */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#0B3B48]" />
              Alterações Realizadas
            </h3>

            {/* Filter pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-[200px] sm:max-w-none">
              {categories.slice(0, 3).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0B3B48] text-amber-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-teal-100 p-4 sm:p-5 space-y-4 shadow-sm">
            {filteredChanges.map((item, idx) => (
              <div key={idx} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div className={`w-1.5 ${getCategoryBarColor(item.categoria)} rounded-full flex-shrink-0 my-0.5`} />
                <div className="text-xs space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-slate-800">{item.categoria}</p>
                    <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] my-1.5">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">
                      <span className="text-slate-400 font-semibold block text-[10px]">Antes:</span>
                      <span className="italic font-mono">"{item.trechoOriginal}"</span>
                    </div>
                    <div className="p-2 bg-teal-50/60 rounded-lg border border-teal-100 text-teal-950 font-medium">
                      <span className="text-teal-700 font-semibold block text-[10px]">Depois:</span>
                      "{item.sugestaoMelhoria}"
                    </div>
                  </div>

                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    <strong className="text-slate-700">Motivo:</strong> {item.explicacaoMotivo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sugestões de Pesquisa */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              Sugestões de Pesquisa
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              {result.fontesPesquisa.length} fontes sugeridas
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-teal-100 p-4 sm:p-5 space-y-3 shadow-sm">
            {result.fontesPesquisa.map((fonte, idx) => {
              const scholarQuery = encodeURIComponent(fonte.termoBuscaOuLink);
              const scholarUrl = `https://scholar.google.com.br/scholar?q=${scholarQuery}`;
              const scieloUrl = `https://search.scielo.org/?q=${scholarQuery}`;

              return (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50/60 rounded-xl border border-slate-200/80 hover:border-teal-400 hover:bg-white transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-[#0B3B48]">
                      {fonte.titulo}
                    </p>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#0B3B48] bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
                      {fonte.tipo}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {fonte.descricao}
                  </p>

                  <div className="text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-800">Aplicação no trabalho:</span> {fonte.dicaAplicacao}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                    <span className="text-teal-700 font-mono truncate max-w-[160px] sm:max-w-[200px]">
                      Busca: {fonte.termoBuscaOuLink}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={scholarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0B3B48] hover:text-amber-600 font-bold flex items-center gap-0.5"
                      >
                        Acadêmico <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <span className="text-slate-300">•</span>
                      <a
                        href={scieloUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-amber-600 font-bold flex items-center gap-0.5"
                      >
                        SciELO <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 3: Science Fair Tips */}
      {result.dicasMostra && result.dicasMostra.length > 0 && (
        <div className="bg-white rounded-2xl border border-teal-100 p-5 shadow-sm">
          <h3 className="text-xs font-bold text-[#0B3B48] uppercase tracking-wider flex items-center gap-2 mb-3">
            <GraduationCap className="w-4 h-4 text-amber-500" />
            Orientações para Apresentação na Mostra do Conhecimento
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.dicasMostra.map((dica, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50/70 p-3 rounded-xl border border-teal-100 shadow-xs"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{dica}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

