import React, { useState } from 'react';
import { Sparkles, FileText, Eraser, Lightbulb, BookOpen, Layers, Target, FlaskConical, BarChart3, CheckCircle2, HelpCircle } from 'lucide-react';
import { SAMPLE_DRAFTS, SECTION_STRUCTURES } from '../data/samples';

interface DraftInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  section: string;
  setSection: (section: string) => void;
  draft: string;
  setDraft: (text: string) => void;
  projectArea: string;
  setProjectArea: (area: string) => void;
  projectLevel: string;
  setProjectLevel: (level: string) => void;
  onRevise: () => void;
  isLoading: boolean;
}

const AREAS = [
  'Geral / Multidisciplinar',
  'Ciências Biológicas e Saúde',
  'Química e Meio Ambiente',
  'Física e Astronomia',
  'Tecnologia e Robótica',
  'Ciências Humanas e Sociais',
  'Matemática',
];

const LEVELS = [
  'Ensino Fundamental (Anos Finais)',
  'Ensino Médio / Técnico',
];

export const DraftInput: React.FC<DraftInputProps> = ({
  topic,
  setTopic,
  section,
  setSection,
  draft,
  setDraft,
  projectArea,
  setProjectArea,
  projectLevel,
  setProjectLevel,
  onRevise,
  isLoading,
}) => {
  const [showSamples, setShowSamples] = useState(false);

  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const charCount = draft.length;

  const currentSectionDef = SECTION_STRUCTURES.find((s) => s.id === section) || SECTION_STRUCTURES[0];

  const handleSelectSample = (sample: (typeof SAMPLE_DRAFTS)[0]) => {
    setTopic(sample.tema);
    setSection(sample.secao);
    setDraft(sample.rascunho);
    setProjectArea(sample.area);
    if (sample.nivel.includes('Fundamental')) {
      setProjectLevel('Ensino Fundamental (Anos Finais)');
    } else {
      setProjectLevel('Ensino Médio / Técnico');
    }
    setShowSamples(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 sm:p-7 flex flex-col justify-between transition-all">
      <div>
        {/* Header and sample loader */}
        <div className="flex items-center justify-between pb-3 border-b border-teal-50">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#0B3B48]" />
              Redação de Seção Individual
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-toggle-samples"
              onClick={() => setShowSamples(!showSamples)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg text-[#0B3B48] bg-teal-50 hover:bg-teal-100/80 border border-teal-200/80 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3 h-3 text-amber-600" />
              {showSamples ? 'Ocultar Exemplos' : 'Exemplos por Seção'}
            </button>

            {draft && (
              <button
                type="button"
                id="btn-clear-draft"
                onClick={() => setDraft('')}
                disabled={isLoading}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
                title="Limpar rascunho"
              >
                <Eraser className="w-3 h-3" />
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Sample presets modal/accordion */}
        {showSamples && (
          <div className="my-3 p-3.5 bg-slate-50/80 rounded-xl border border-teal-100 animate-fadeIn">
            <p className="text-[11px] font-bold text-[#0B3B48] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              Selecione um exemplo de rascunho por seção:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_DRAFTS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  id={`sample-${sample.id}`}
                  onClick={() => handleSelectSample(sample)}
                  className="text-left p-2.5 rounded-lg bg-white border border-slate-200 hover:border-teal-600 hover:shadow-xs transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-[#0B3B48] bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded">
                      {sample.secao}
                    </span>
                    <span className="text-[10px] text-slate-400">{sample.area}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-[#0B3B48] truncate">
                    {sample.titulo}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                    Tema: {sample.tema}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Core Input Fields: Tema do Trabalho & Seção */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 my-3">
          {/* Campo 1: Tema do Trabalho */}
          <div className="md:col-span-7">
            <label htmlFor="input-topic" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Tema ou Título do Trabalho <span className="text-amber-600 font-bold">*</span>
            </label>
            <input
              type="text"
              id="input-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
              placeholder="Ex: Eficiência de adubo de casca de banana no tomateiro"
              className="w-full text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-[#0B3B48] transition-all"
            />
          </div>

          {/* Campo 2: Seção do Trabalho */}
          <div className="md:col-span-5">
            <label htmlFor="select-section" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Seção a ser Escrita <span className="text-amber-600 font-bold">*</span>
            </label>
            <select
              id="select-section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              disabled={isLoading}
              className="w-full text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-[#0B3B48] transition-all cursor-pointer"
            >
              {SECTION_STRUCTURES.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section Target Indicators */}
        <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs mb-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#0B3B48] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              Estrutura em 2 Parágrafos para "{currentSectionDef.nome}":
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Rigor Acadêmico
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 pt-0.5">
            <div className="bg-white/95 p-2.5 rounded-lg border border-teal-100">
              <span className="font-bold text-[#0B3B48] block text-[10px] uppercase">1º Parágrafo</span>
              {currentSectionDef.focoP1}
            </div>
            <div className="bg-white/95 p-2.5 rounded-lg border border-teal-100">
              <span className="font-bold text-[#0B3B48] block text-[10px] uppercase">2º Parágrafo</span>
              {currentSectionDef.focoP2}
            </div>
          </div>
        </div>

        {/* Secondary Filters: Area and Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="select-area" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Área do Conhecimento
            </label>
            <select
              id="select-area"
              value={projectArea}
              onChange={(e) => setProjectArea(e.target.value)}
              disabled={isLoading}
              className="w-full text-xs bg-slate-50/70 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-[#0B3B48] transition-all font-medium cursor-pointer"
            >
              {AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="select-level" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Etapa Escolar
            </label>
            <select
              id="select-level"
              value={projectLevel}
              onChange={(e) => setProjectLevel(e.target.value)}
              disabled={isLoading}
              className="w-full text-xs bg-slate-50/70 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-[#0B3B48] transition-all font-medium cursor-pointer"
            >
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Textarea for the Specific Section */}
        <div className="relative mt-2">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="textarea-draft" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Rascunho do Aluno para a {currentSectionDef.nome}
            </label>
            <span className="text-[10px] text-slate-400">
              Escreva com suas próprias palavras
            </span>
          </div>

          <textarea
            id="textarea-draft"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={currentSectionDef.dicaPlaceholder}
            rows={7}
            disabled={isLoading}
            className="w-full p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-xl resize-y min-h-[160px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-[#0B3B48] text-slate-700 leading-relaxed text-sm placeholder:text-slate-400 transition-all"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>
              <strong className="text-slate-600 font-semibold">{wordCount}</strong> palavras •{' '}
              <strong className="text-slate-600 font-semibold">{charCount}</strong> caracteres
            </span>
            <span className="text-[#0B3B48] font-bold">
              Gera 2 parágrafos estritos para "{section}"
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <button
          type="button"
          id="btn-submit-draft"
          onClick={onRevise}
          disabled={isLoading || !draft.trim()}
          className={`w-full py-3.5 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs sm:text-sm ${
            isLoading || !draft.trim()
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-[#0B3B48] hover:bg-[#072832] text-amber-300 border border-amber-400/30 shadow-lg shadow-teal-950/10 active:scale-[0.99] cursor-pointer'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
              <span>Aprimorando {section} em 2 Parágrafos...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Aprimorar Seção ({section}) em 2 Parágrafos</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

