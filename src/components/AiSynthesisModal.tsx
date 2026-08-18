import React, { useState, useEffect } from 'react';
import { Quote, ReflectionResult } from '../types/quote';
import { DISCIPLINES } from '../data/quotes';
import { X, Sparkles, BookOpen, Lightbulb, Compass, Loader2, Download, Copy, Check } from 'lucide-react';

interface AiSynthesisModalProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
  onAddCustomQuote?: (quote: Quote) => void;
  onOpenStudio?: (quote: Quote) => void;
}

export const AiSynthesisModal: React.FC<AiSynthesisModalProps> = ({
  quote,
  isOpen,
  onClose,
  onAddCustomQuote,
  onOpenStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'reflection' | 'generator'>('reflection');
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState<ReflectionResult | null>(null);

  // Generator form
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('nlp');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [generatedQuote, setGeneratedQuote] = useState<Quote | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && quote && activeTab === 'reflection' && !reflection) {
      fetchReflection(quote);
    }
  }, [isOpen, quote, activeTab]);

  const fetchReflection = async (q: Quote) => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteText: q.text,
          author: q.author,
          discipline: q.discipline,
          contextNote: q.contextNote,
        }),
      });

      if (!res.ok) throw new Error('API server response failed');
      const data = await res.json();
      setReflection({
        quoteId: q.id,
        synthesis: data.synthesis || 'A deep synthesis of human perception, context, and structural feedback.',
        crossParadigmInsight: data.crossParadigmInsight || 'This quote connects deeply across cognitive science, systems dynamics, and ancient patristic wisdom.',
        practicalAction: data.practicalAction || 'Pause today and notice when you confuse your mental map with the actual territory.',
      });
    } catch (err) {
      console.error('Reflection error:', err);
      setReflection({
        quoteId: q.id,
        synthesis: 'This quote illustrates how internal mental models and neurological representations govern lived experience.',
        crossParadigmInsight: 'Bridging General Semantics and Systems Theory: changing the structure of evaluation shifts the output of the whole system.',
        practicalAction: 'Notice your state right now and ask: What presupposition am I holding that can be reframed?',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCustomQuote = async () => {
    setLoading(true);
    setGeneratedQuote(null);
    try {
      const res = await fetch('/api/gemini/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discipline: selectedDiscipline,
          author: selectedAuthor,
          topic: topic.trim() || 'Transformation and Perception',
        }),
      });

      const data = await res.json();
      const newQuote: Quote = {
        id: `ai-quote-${Date.now()}`,
        text: data.quote || 'In any system, when you alter the context of evaluation, the problem ceases to exist in its original form.',
        author: data.author || selectedAuthor || 'Axiom AI Synthesis',
        authorTitle: `${DISCIPLINES[selectedDiscipline]?.name || 'Wisdom Tradition'} Insight`,
        eraOrDates: 'AI Synthesis',
        discipline: (selectedDiscipline as any) || 'nlp',
        tags: ['AI Synthesis', topic || 'Transformation'],
        contextNote: data.contextNote || `Original synthesis generated on topic: ${topic || 'Transformation'}.`,
      };

      setGeneratedQuote(newQuote);
      if (onAddCustomQuote) onAddCustomQuote(newQuote);
    } catch (err) {
      console.error('Quote generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyGenerated = () => {
    if (!generatedQuote) return;
    navigator.clipboard.writeText(`“${generatedQuote.text}” — ${generatedQuote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0F12]/90 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-[#141418] border border-[#2A2A30] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A30] bg-[#0F0F12]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#1A1A20] text-[#E0E0E0] border border-[#3A3A40]">
              <Sparkles className="w-5 h-5 text-[#E0E0E0]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-light tracking-widest text-[#F0F0F0] uppercase">Wisdom Engine Mirror</h2>
              <p className="text-[11px] text-[#8A8A90]">
                Deep cross-paradigm synthesis & custom aphorism generator
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded text-[#8A8A90] hover:text-[#F0F0F0] hover:bg-[#1A1A20]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#2A2A30] bg-[#0F0F12] px-6 pt-2">
          <button
            onClick={() => setActiveTab('reflection')}
            className={`px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold border-b-2 transition-all ${
              activeTab === 'reflection'
                ? 'border-[#E0E0E0] text-[#F0F0F0]'
                : 'border-transparent text-[#8A8A90] hover:text-[#E0E0E0]'
            }`}
          >
            AI Mirror Reflection
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold border-b-2 transition-all ${
              activeTab === 'generator'
                ? 'border-[#E0E0E0] text-[#F0F0F0]'
                : 'border-transparent text-[#8A8A90] hover:text-[#E0E0E0]'
            }`}
          >
            Custom Aphorism Synthesizer
          </button>
        </div>

        {/* Tab 1: AI Mirror Reflection */}
        {activeTab === 'reflection' && (
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {quote && (
              <div className="p-4 rounded bg-[#0F0F12] border border-[#2A2A30] text-center">
                <blockquote className="font-cormorant text-xl text-[#F0F0F0] italic mb-2">
                  “{quote.text}”
                </blockquote>
                <p className="font-sans text-xs uppercase tracking-widest text-[#B0B0B8]">— {quote.author}</p>
              </div>
            )}

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-[#8A8A90] space-y-3">
                <Loader2 className="w-8 h-8 text-[#E0E0E0] animate-spin" />
                <p className="text-xs uppercase tracking-wider">Synthesizing reflections via Gemini AI...</p>
              </div>
            ) : reflection ? (
              <div className="space-y-4">
                {/* 1. Core Synthesis */}
                <div className="p-4 rounded bg-[#0F0F12] border border-[#2A2A30]">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B0B0B8] flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-4 h-4 text-[#8A8A90]" />
                    1. Philosophical Mechanics
                  </h4>
                  <p className="text-xs text-[#E0E0E0] leading-relaxed">{reflection.synthesis}</p>
                </div>

                {/* 2. Cross-Paradigm Convergence */}
                <div className="p-4 rounded bg-[#0F0F12] border border-[#2A2A30]">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B0B0B8] flex items-center gap-1.5 mb-2">
                    <Compass className="w-4 h-4 text-[#8A8A90]" />
                    2. Cross-Paradigm Convergence
                  </h4>
                  <p className="text-xs text-[#E0E0E0] leading-relaxed">{reflection.crossParadigmInsight}</p>
                </div>

                {/* 3. Practical Action */}
                <div className="p-4 rounded bg-[#0F0F12] border border-[#2A2A30]">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B0B0B8] flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-4 h-4 text-[#8A8A90]" />
                    3. Contemplative Micro-Action
                  </h4>
                  <p className="text-xs text-[#E0E0E0] leading-relaxed font-medium">{reflection.practicalAction}</p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Tab 2: Custom Quote Generator */}
        {activeTab === 'generator' && (
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8A8A90] text-[10px] uppercase tracking-wider font-semibold mb-1">Target Discipline</label>
                <select
                  value={selectedDiscipline}
                  onChange={(e) => setSelectedDiscipline(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0F0F12] border border-[#2A2A30] text-[#E0E0E0] focus:outline-none focus:border-[#4A4A50]"
                >
                  {Object.values(DISCIPLINES).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#8A8A90] text-[10px] uppercase tracking-wider font-semibold mb-1">Author Inspiration (Optional)</label>
                <input
                  type="text"
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  placeholder="e.g. Richard Bandler, St. Augustine..."
                  className="w-full px-3 py-2 rounded bg-[#0F0F12] border border-[#2A2A30] text-[#E0E0E0] focus:outline-none focus:border-[#4A4A50]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8A8A90] text-[10px] uppercase tracking-wider font-semibold mb-1">Topic or Contemplative Focus</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Overcoming anxiety, Map vs Territory, Responsibility..."
                className="w-full px-3 py-2 rounded bg-[#0F0F12] border border-[#2A2A30] text-[#E0E0E0] focus:outline-none focus:border-[#4A4A50]"
              />
            </div>

            <button
              onClick={handleGenerateCustomQuote}
              disabled={loading}
              className="w-full py-3 rounded bg-[#E0E0E0] text-[#0F0F12] font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing via Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Aphorism</span>
                </>
              )}
            </button>

            {/* Generated Output */}
            {generatedQuote && (
              <div className="mt-6 p-5 rounded bg-[#0F0F12] border border-[#2A2A30] space-y-4">
                <blockquote className="font-cormorant text-2xl text-[#F0F0F0] italic leading-relaxed">
                  “{generatedQuote.text}”
                </blockquote>
                <div className="flex items-center justify-between border-t border-[#2A2A30] pt-3">
                  <div>
                    <h5 className="font-sans font-light uppercase tracking-widest text-[#E0E0E0] text-sm">{generatedQuote.author}</h5>
                    <p className="text-[10px] text-[#8A8A90]">{generatedQuote.contextNote}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyGenerated}
                      className="p-2 rounded bg-[#1A1A20] border border-[#2A2A30] text-[#B0B0B8] hover:text-[#F0F0F0]"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {onOpenStudio && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenStudio(generatedQuote);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#E0E0E0] text-[#0F0F12] text-[10px] uppercase tracking-wider font-bold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Wallpaper</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
