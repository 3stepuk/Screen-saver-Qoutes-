import React, { useState, useEffect, useMemo } from 'react';
import { Quote, DisciplineId } from './types/quote';
import { QUOTES_DATA, DISCIPLINES } from './data/quotes';
import { Navbar } from './components/Navbar';
import { QuoteCard } from './components/QuoteCard';
import { ScreensaverStudioModal } from './components/ScreensaverStudioModal';
import { LiveScreensaver } from './components/LiveScreensaver';
import { AiSynthesisModal } from './components/AiSynthesisModal';
import { DisciplineBridge } from './components/DisciplineBridge';
import { ShareModal } from './components/ShareModal';
import { Search, Shuffle, Filter, Bookmark, Sparkles, Monitor, Quote as QuoteIcon, Share2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'bridge' | 'favorites' | 'generator'>('explore');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Favorites state with localStorage persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('axiom_favorite_quotes');
      return saved ? JSON.parse(saved) : ['nlp-1', 'gs-1', 'we-1', 'cf-1'];
    } catch {
      return ['nlp-1', 'gs-1', 'we-1', 'cf-1'];
    }
  });

  // Custom AI quotes
  const [customQuotes, setCustomQuotes] = useState<Quote[]>(() => {
    try {
      const saved = localStorage.getItem('axiom_custom_quotes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Featured Random Quote
  const [featuredQuote, setFeaturedQuote] = useState<Quote>(() => {
    return QUOTES_DATA[Math.floor(Math.random() * QUOTES_DATA.length)];
  });

  // Modals state
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioQuote, setStudioQuote] = useState<Quote | null>(null);

  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [reflectionQuote, setReflectionQuote] = useState<Quote | null>(null);

  const [isLiveScreensaverOpen, setIsLiveScreensaverOpen] = useState(false);

  // Share Modal State
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareQuote, setShareQuote] = useState<Quote | null>(null);
  const [shareImageUrl, setShareImageUrl] = useState<string | undefined>(undefined);

  const handleOpenShare = (quote: Quote, imageUrl?: string) => {
    setShareQuote(quote);
    setShareImageUrl(imageUrl);
    setIsShareOpen(true);
  };

  // Deep Link URL checking on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const targetQuoteId = params.get('quote');
      if (targetQuoteId) {
        const found = QUOTES_DATA.find((q) => q.id === targetQuoteId);
        if (found) {
          setFeaturedQuote(found);
          handleOpenShare(found);
        }
      }
    } catch (e) {
      console.error('Deep link parse error:', e);
    }
  }, []);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem('axiom_favorite_quotes', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Sync custom quotes
  useEffect(() => {
    try {
      localStorage.setItem('axiom_custom_quotes', JSON.stringify(customQuotes));
    } catch (e) {
      console.error(e);
    }
  }, [customQuotes]);

  const allQuotesList = useMemo(() => {
    return [...QUOTES_DATA, ...customQuotes];
  }, [customQuotes]);

  // Filtered quotes logic
  const filteredQuotes = useMemo(() => {
    return allQuotesList.filter((q) => {
      // Tab filter
      if (activeTab === 'favorites' && !favorites.includes(q.id)) return false;

      // Discipline filter
      if (selectedDiscipline !== 'all' && q.discipline !== selectedDiscipline) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = q.text.toLowerCase().includes(query);
        const matchesAuthor = q.author.toLowerCase().includes(query);
        const matchesTags = q.tags.some((t) => t.toLowerCase().includes(query));
        const matchesNote = q.contextNote.toLowerCase().includes(query);
        return matchesText || matchesAuthor || matchesTags || matchesNote;
      }

      return true;
    });
  }, [allQuotesList, activeTab, selectedDiscipline, searchQuery, favorites]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleRandomQuote = () => {
    const pool = filteredQuotes.length > 0 ? filteredQuotes : allQuotesList;
    const nextRandom = pool[Math.floor(Math.random() * pool.length)];
    setFeaturedQuote(nextRandom);
  };

  const handleOpenStudio = (q: Quote) => {
    setStudioQuote(q);
    setIsStudioOpen(true);
  };

  const handleOpenReflection = (q: Quote) => {
    setReflectionQuote(q);
    setIsReflectionOpen(true);
  };

  const handleAddCustomQuote = (newQuote: Quote) => {
    setCustomQuotes((prev) => [newQuote, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-jakarta selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRandomQuote={handleRandomQuote}
        onLaunchScreensaver={() => setIsLiveScreensaverOpen(true)}
        favoriteCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero / Daily Random Highlight Banner */}
        {activeTab === 'explore' && (
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800/90 p-6 sm:p-10 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Daily Wisdom Spotlight
                  </span>
                  <span className="text-xs text-slate-400 font-mono-code uppercase tracking-wider">
                    {featuredQuote.discipline.replace('_', ' ')}
                  </span>
                </div>

                <blockquote className="font-cormorant text-2xl sm:text-3xl md:text-4xl text-slate-100 italic leading-snug">
                  “{featuredQuote.text}”
                </blockquote>

                <div className="flex items-baseline gap-3 pt-1">
                  <h3 className="font-cinzel text-lg font-bold text-amber-400">{featuredQuote.author}</h3>
                  <span className="text-xs text-slate-400">{featuredQuote.authorTitle}</span>
                </div>
              </div>

              {/* Action Buttons for Hero Quote */}
              <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => handleOpenStudio(featuredQuote)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Monitor className="w-4 h-4" />
                  <span>Generate Screensaver</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenShare(featuredQuote)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/40 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-all"
                  >
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>Share</span>
                  </button>

                  <button
                    onClick={handleRandomQuote}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/40 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-all"
                  >
                    <Shuffle className="w-4 h-4 text-amber-400" />
                    <span>Shuffle</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Explore & Filters Bar */}
        {(activeTab === 'explore' || activeTab === 'favorites') && (
          <div className="space-y-4">
            {/* Search & Discipline Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
              {/* Search input */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search quotes, authors, or concepts..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>

              {/* Discipline Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-medium">
                <button
                  onClick={() => setSelectedDiscipline('all')}
                  className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap ${
                    selectedDiscipline === 'all'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  All Disciplines ({allQuotesList.length})
                </button>

                {Object.values(DISCIPLINES).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDiscipline(d.id)}
                    className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap ${
                      selectedDiscipline === d.id
                        ? `${d.badgeBg} font-semibold`
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {d.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>
                Showing {filteredQuotes.length} {filteredQuotes.length === 1 ? 'quote' : 'quotes'}
                {activeTab === 'favorites' && ' in Favorites'}
              </span>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-amber-400 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Quotes Grid */}
            {filteredQuotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuotes.map((q) => (
                  <QuoteCard
                    key={q.id}
                    quote={q}
                    isFavorite={favorites.includes(q.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenStudio={handleOpenStudio}
                    onOpenReflection={handleOpenReflection}
                    onShare={handleOpenShare}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-slate-900/40 rounded-2xl border border-slate-800/60 space-y-3">
                <QuoteIcon className="w-10 h-10 text-slate-700 mx-auto" />
                <h3 className="font-cinzel text-lg font-bold text-slate-300">No quotes found</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try adjusting your search criteria or discipline category filters.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Discipline Bridge Matrix */}
        {activeTab === 'bridge' && (
          <DisciplineBridge
            quotes={allQuotesList}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenStudio={handleOpenStudio}
            onOpenReflection={handleOpenReflection}
            onShare={handleOpenShare}
          />
        )}

        {/* Tab 3: Custom Generator Mode */}
        {activeTab === 'generator' && (
          <div className="max-w-2xl mx-auto">
            <AiSynthesisModal
              quote={featuredQuote}
              isOpen={true}
              onClose={() => setActiveTab('explore')}
              onAddCustomQuote={handleAddCustomQuote}
              onOpenStudio={handleOpenStudio}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-center text-xs text-slate-400 font-jakarta mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-cinzel font-bold text-slate-300 tracking-wider">AXIOM STUDIO</p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              NLP • General Semantics • Systems Theory • Werner Erhard • Gospel • Patristics
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>4K Screensaver Engine</span>
            <span>•</span>
            <span>Gemini AI Wisdom Mirror</span>
          </div>
        </div>
      </footer>

      {/* Screensaver Studio Exporter Modal */}
      <ScreensaverStudioModal
        quote={studioQuote}
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        onShare={(q, img) => handleOpenShare(q, img)}
      />

      {/* AI Mirror Reflection Modal */}
      <AiSynthesisModal
        quote={reflectionQuote}
        isOpen={isReflectionOpen}
        onClose={() => setIsReflectionOpen(false)}
        onAddCustomQuote={handleAddCustomQuote}
        onOpenStudio={handleOpenStudio}
      />

      {/* Share to Social Deep Link & Preview Modal */}
      <ShareModal
        quote={shareQuote}
        imageUrl={shareImageUrl}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Live Ambient Fullscreen Screensaver */}
      <LiveScreensaver
        quotes={filteredQuotes.length > 0 ? filteredQuotes : allQuotesList}
        isOpen={isLiveScreensaverOpen}
        onClose={() => setIsLiveScreensaverOpen(false)}
      />
    </div>
  );
}
