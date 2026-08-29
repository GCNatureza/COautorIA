import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle, Lightbulb, Layers } from 'lucide-react';
import { SECTION_STRUCTURES } from '../data/samples';

export const ScientificGuideCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('Introdução');

  const selectedSec = SECTION_STRUCTURES.find((s) => s.id === activeSectionId) || SECTION_STRUCTURES[0];

  return (
    <div className="bg-white rounded-2xl border border-teal-100 shadow-sm overflow-hidden transition-all">
      <button
        type="button"
        id="btn-toggle-guide"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-teal-50/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0B3B48] flex items-center justify-center font-bold text-xs border border-teal-200">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <span>Guia de Estrutura: A Regra dos 2 Parágrafos por Seção</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 hidden sm:inline-block">
                Metodologia Científica
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Veja como cada seção do trabalho deve ser dividida em 2 blocos lógicos coesos
            </div>
          </div>
        </div>

        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-2 border-t border-teal-50 bg-slate-50/50 space-y-4 animate-fadeIn">
          {/* Section selector tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {SECTION_STRUCTURES.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSectionId(sec.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeSectionId === sec.id
                    ? 'bg-[#0B3B48] text-amber-300 shadow-xs border border-teal-900/20'
                    : 'bg-white text-slate-600 hover:bg-teal-50/60 border border-slate-200'
                }`}
              >
                {sec.nome}
              </button>
            ))}
          </div>

          {/* Section detail cards */}
          <div className="bg-white p-4 rounded-xl border border-teal-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Padrão para: <strong className="text-[#0B3B48]">{selectedSec.nome}</strong>
              </span>
              <span className="text-[11px] text-slate-500">
                {selectedSec.descricao}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-teal-100 text-xs">
                <div className="font-bold text-[#0B3B48] mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  1º Parágrafo: Abertura e Fundamentação
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px] bg-white p-2.5 rounded-lg border border-teal-50">
                  {selectedSec.focoP1}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-teal-100 text-xs">
                <div className="font-bold text-[#0B3B48] mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  2º Parágrafo: Aprofundamento e Conclusão
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px] bg-white p-2.5 rounded-lg border border-teal-50">
                  {selectedSec.focoP2}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 text-xs text-teal-950 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-[#0B3B48]">Dica Pedagógica:</strong> Escrever uma seção de cada vez permite que o estudante se concentre no objetivo de cada parte do projeto sem se sobrecarregar. A regra dos 2 parágrafos traz ritmo e objetividade para a banca avaliadora da Mostra do Conhecimento!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

