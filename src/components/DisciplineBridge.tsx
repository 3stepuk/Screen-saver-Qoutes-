import React, { useState } from 'react';
import { Quote, DisciplineId } from '../types/quote';
import { DISCIPLINES } from '../data/quotes';
import { QuoteCard } from './QuoteCard';
import { Sparkles, ArrowRightLeft, BookOpen } from 'lucide-react';

interface DisciplineBridgeProps {
  quotes: Quote[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenStudio: (quote: Quote) => void;
  onOpenReflection: (quote: Quote) => void;
  onShare?: (quote: Quote) => void;
}

export const DisciplineBridge: React.FC<DisciplineBridgeProps> = ({
  quotes,
  favorites,
  onToggleFavorite,
  onOpenStudio,
  onOpenReflection,
  onShare,
}) => {
  const [disc1, setDisc1] = useState<DisciplineId>('general_semantics');
  const [disc2, setDisc2] = useState<DisciplineId>('church_fathers');

  const info1 = DISCIPLINES[disc1];
  const info2 = DISCIPLINES[disc2];

  const quotes1 = quotes.filter((q) => q.discipline === disc1);
  const quotes2 = quotes.filter((q) => q.discipline === disc2);

  // Pick random or first quote from each
  const quote1 = quotes1[0];
  const quote2 = quotes2[0];

  const GET_NEXUS_INSIGHT = (d1: DisciplineId, d2: DisciplineId): string => {
    if ((d1 === 'general_semantics' && d2 === 'church_fathers') || (d2 === 'general_semantics' && d1 === 'church_fathers')) {
      return "Alfred Korzybski's principle that 'the map is not the territory' mirrors St. Gregory of Nyssa's Patristic teaching that 'concepts create idols; only wonder comprehends anything.' Both traditions warn against worshipping finite mental representations over lived, infinite reality.";
    }
    if ((d1 === 'nlp' && d2 === 'jesus') || (d2 === 'nlp' && d1 === 'jesus')) {
      return "Bandler and Grinder's focus on internal sensory representations echoes Jesus's teachings on 'Metanoia' (Greek for structural transformation of mind) and the realization that 'the kingdom of God is within you.'";
    }
    if ((d1 === 'systems_theory' && d2 === 'werner_erhard') || (d2 === 'systems_theory' && d1 === 'werner_erhard')) {
      return "Donella Meadows's systems leverage points (shifting paradigms and feedback loops) align directly with Werner Erhard's distinction between Content vs Context: true shift occurs by altering the underlying context in which a system operates.";
    }
    return "When these two disciplines converge, we observe a shared fundamental truth: human perception is governed by structural patterns, language, and context. Shifting the evaluational framework reorganizes lived experience.";
  };

  return (
    <div className="space-y-8 font-jakarta">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-center space-y-3">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Wisdom Convergence Matrix
        </span>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100">
          The Cross-Disciplinary Nexus
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Discover how modern cognitive science, systems engineering, transformational inquiry, and ancient patristic theology converge on identical structural truths.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
        {/* Left Discipline */}
        <div className="sm:col-span-5 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs text-slate-400 font-semibold block">Discipline Alpha</label>
          <select
            value={disc1}
            onChange={(e) => setDisc1(e.target.value as DisciplineId)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
          >
            {Object.values(DISCIPLINES).map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 leading-tight">{info1.subtitle}</p>
        </div>

        {/* Center Swap Icon */}
        <div className="sm:col-span-1 flex justify-center">
          <div className="p-3 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
        </div>

        {/* Right Discipline */}
        <div className="sm:col-span-5 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs text-slate-400 font-semibold block">Discipline Beta</label>
          <select
            value={disc2}
            onChange={(e) => setDisc2(e.target.value as DisciplineId)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
          >
            {Object.values(DISCIPLINES).map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 leading-tight">{info2.subtitle}</p>
        </div>
      </div>

      {/* Synthesis Nexus Callout */}
      <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" /> Epistemological Bridge
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          {GET_NEXUS_INSIGHT(disc1, disc2)}
        </p>
      </div>

      {/* Side-by-side Quotes comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quote1 && (
          <QuoteCard
            quote={quote1}
            isFavorite={favorites.includes(quote1.id)}
            onToggleFavorite={onToggleFavorite}
            onOpenStudio={onOpenStudio}
            onOpenReflection={onOpenReflection}
            onShare={onShare}
          />
        )}
        {quote2 && (
          <QuoteCard
            quote={quote2}
            isFavorite={favorites.includes(quote2.id)}
            onToggleFavorite={onToggleFavorite}
            onOpenStudio={onOpenStudio}
            onOpenReflection={onOpenReflection}
            onShare={onShare}
          />
        )}
      </div>
    </div>
  );
};
