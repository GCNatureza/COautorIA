import React, { useState } from 'react';
import { Header } from './components/Header';
import { DraftInput } from './components/DraftInput';
import { RevisionViewer } from './components/RevisionViewer';
import { ScientificGuideCard } from './components/ScientificGuideCard';
import { RevisionResult } from './types';
import { AlertCircle, RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  const [topic, setTopic] = useState<string>('');
  const [section, setSection] = useState<string>('Introdução');
  const [draft, setDraft] = useState<string>('');
  const [projectArea, setProjectArea] = useState<string>('Geral / Multidisciplinar');
  const [projectLevel, setProjectLevel] = useState<string>('Ensino Fundamental (Anos Finais)');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RevisionResult | null>(null);
  const [submittedDraft, setSubmittedDraft] = useState<string>('');

  const handleRevise = async () => {
    if (!draft.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/revise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          section,
          draft: draft.trim(),
          projectArea,
          projectLevel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro do servidor (${response.status})`);
      }

      const data: RevisionResult = await response.json();
      setResult(data);
      setSubmittedDraft(draft.trim());

      // Scroll smoothly to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Falha na revisão:', err);
      setError(
        err.message || 'Ocorreu um erro ao estruturar seu trabalho científico. Por favor, tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSubmittedDraft('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F8F9] text-slate-800 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Intro banner */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-teal-900/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-[#0B3B48] uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                COautorIA • Redação Científica
              </span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Regra dos 2 Parágrafos
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0B3B48] tracking-tight">
              Assistente de escrita para Mostras do Conhecimento
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Escreva o rascunho da sua seção com suas palavras. O sistema gera a versão refinada em <strong className="text-[#0B3B48] font-bold">2 parágrafos acadêmicos</strong>, explica todas as alterações e indica fontes para citar.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0B3B48] text-amber-300 border border-amber-400/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1 Seção por Vez
            </span>
          </div>
        </div>

        {/* Scientific Guide Accordion */}
        <ScientificGuideCard />

        {/* Draft input component */}
        <DraftInput
          topic={topic}
          setTopic={setTopic}
          section={section}
          setSection={setSection}
          draft={draft}
          setDraft={setDraft}
          projectArea={projectArea}
          setProjectArea={setProjectArea}
          projectLevel={projectLevel}
          setProjectLevel={setProjectLevel}
          onRevise={handleRevise}
          isLoading={isLoading}
        />

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold mb-0.5">Não foi possível concluir a análise</div>
              <div>{error}</div>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs text-red-600 hover:text-red-800 font-bold cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Loading state indicator */}
        {isLoading && (
          <div className="bg-white rounded-2xl border border-teal-100 p-8 text-center space-y-4 shadow-sm animate-pulse">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 text-[#0B3B48] border border-teal-200/80">
              <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#0B3B48] uppercase tracking-wide">
                Refinando a {section} com Rigor Científico...
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Estruturando rigorosamente em 2 parágrafos, aprimorando a coesão textual e levantando referências bibliográficas.
              </p>
            </div>
          </div>
        )}

        {/* Revision Result Section */}
        {result && (
          <div id="results-section" className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span className="text-xs font-bold text-[#0B3B48] uppercase tracking-wider">
                  Revisão de Seção Concluída ({result.secao})
                </span>
              </div>

              <button
                type="button"
                id="btn-new-revision"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0B3B48] hover:text-[#072832] bg-white border border-teal-200 hover:bg-teal-50 transition-colors shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                Novo Rascunho / Outra Seção
              </button>
            </div>

            <RevisionViewer result={result} originalDraft={submittedDraft} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-teal-900/10 bg-white py-4 text-xs text-slate-500 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#0B3B48]">COautorIA</span>
            <span>•</span>
            <span>Plataforma de Escrita Científica para Mostras do Conhecimento</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Padrão: 2 Parágrafos Metodológicos</span>
          </div>
          <span className="text-slate-400">Educação Básica & Iniciação Científica Escolar</span>
        </div>
      </footer>
    </div>
  );
}

