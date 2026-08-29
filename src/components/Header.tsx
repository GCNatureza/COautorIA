import React from 'react';
import { GraduationCap, Atom, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-teal-900/10 bg-[#0B3B48] text-white flex items-center justify-between px-4 sm:px-8 flex-shrink-0 sticky top-0 z-20 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-[#0e5163] to-[#082a34] border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-400 font-bold shadow-sm">
          <Atom className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5 font-serif">
            <span>COautor</span>
            <span className="text-amber-400 font-sans font-extrabold px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-xs sm:text-sm tracking-wider">
              IA
            </span>
          </h1>
          <p className="text-[10px] text-teal-200/80 -mt-0.5 font-medium hidden sm:block">
            Assistente de Escrita Científica
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-900/60 border border-amber-400/25 text-[11px] font-semibold text-amber-300">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Mostras do Conhecimento</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-teal-100 bg-[#072832] px-3 py-1.5 rounded-lg border border-teal-700/50 font-medium">
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <span className="hidden md:inline">Ensino Fundamental & Médio</span>
          <span className="md:hidden">Escolar</span>
        </div>
      </div>
    </header>
  );
};


