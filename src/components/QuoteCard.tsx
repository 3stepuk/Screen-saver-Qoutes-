import React, { useState } from 'react';
import { Quote } from '../types/quote';
import { DISCIPLINES } from '../data/quotes';
import { Bookmark, Download, Sparkles, Copy, Check, BookOpen, Quote as QuoteIcon, Share2 } from 'lucide-react';

interface QuoteCardProps {
  quote: Quote;
  isFavorite: boolean;
  onToggleFavorite: (quoteId: string) => void;
  onOpenStudio: (quote: Quote) => void;
  onOpenReflection: (quote: Quote) => void;
  onShare?: (quote: Quote) => void;
  featured?: boolean;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  isFavorite,
  onToggleFavorite,
  onOpenStudio,
  onOpenReflection,
  onShare,
  featured = false,
}) => {
  const [copied, setCopied] = useState(false);
  const disciplineInfo = DISCIPLINES[quote.discipline] || DISCIPLINES.nlp;

  const handleCopy = () => {
    const textToCopy = `“${quote.text}” — ${quote.author} (${quote.authorTitle})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative group rounded-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden border ${
        featured
          ? 'bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border-amber-500/40 p-6 md:p-8 shadow-xl shadow-amber-500/5'
          : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700/80 p-6'
      }`}
    >
      {/* Background ambient glow */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none transition-opacity group-hover:opacity-20"
        style={{ backgroundColor: disciplineInfo.accentHex }}
      />

      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${disciplineInfo.badgeBg}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: disciplineInfo.accentHex }}
            />
            {disciplineInfo.name}
          </span>

          <button
            onClick={() => onToggleFavorite(quote.id)}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-amber-300 hover:border-amber-500/30'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Quote Text */}
        <div className="relative mb-6">
          <QuoteIcon className="absolute -top-3 -left-3 w-8 h-8 text-slate-800/60 pointer-events-none -z-0" />
          <blockquote
            className={`relative z-10 font-cormorant leading-snug font-medium text-slate-100 italic ${
              featured ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-xl sm:text-2xl'
            }`}
          >
            “{quote.text}”
          </blockquote>
        </div>
      </div>

      {/* Author & Context Section */}
      <div>
        <div className="border-t border-slate-800/80 pt-4 mb-4">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="font-cinzel font-bold text-slate-100 text-base sm:text-lg">
              {quote.author}
            </h4>
            {quote.eraOrDates && (
              <span className="text-xs font-mono-code text-slate-400">{quote.eraOrDates}</span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-jakarta mt-0.5">{quote.authorTitle}</p>

          {/* Context Note */}
          {quote.contextNote && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
              <span>{quote.contextNote}</span>
            </div>
          )}

          {/* Tags */}
          {quote.tags && quote.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {quote.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-slate-800/40 border border-slate-700/40 text-[11px] text-slate-400 font-jakarta"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-700/40 transition-all text-xs flex items-center gap-1.5"
              title="Copy quote text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {onShare && (
              <button
                onClick={() => onShare(quote)}
                className="p-2 rounded-lg bg-slate-800/40 text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 border border-slate-700/40 transition-all text-xs flex items-center gap-1.5"
                title="Share to social & generate link"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Share</span>
              </button>
            )}

            <button
              onClick={() => onOpenReflection(quote)}
              className="p-2 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/30 transition-all text-xs flex items-center gap-1.5 font-medium"
              title="AI Reflection Mirror"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Mirror</span>
            </button>
          </div>

          <button
            onClick={() => onOpenStudio(quote)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 font-jakarta text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Screensaver HD</span>
          </button>
        </div>
      </div>
    </div>
  );
};
