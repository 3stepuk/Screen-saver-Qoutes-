import React from 'react';
import { Sparkles, Shuffle, Bookmark, Layers, Monitor, Compass, PlusCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'bridge' | 'favorites' | 'generator';
  setActiveTab: (tab: 'explore' | 'bridge' | 'favorites' | 'generator') => void;
  onRandomQuote: () => void;
  onLaunchScreensaver: () => void;
  favoriteCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRandomQuote,
  onLaunchScreensaver,
  favoriteCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand logo & tagline */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 p-0.5 group-hover:border-amber-400/60 transition-all flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Compass className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code uppercase tracking-widest text-amber-400/80 block -mb-0.5">
                Wisdom Engine
              </span>
              <h1 className="font-cinzel text-2xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
                AXIOM
                <span className="text-xs font-jakarta font-semibold text-amber-300/90 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  Studio
                </span>
              </h1>
            </div>
          </div>

          {/* Mobile Random Button */}
          <button
            onClick={onRandomQuote}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:bg-slate-800 transition-all"
            title="Random Quote"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 w-full md:w-auto overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'explore'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('bridge')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'bridge'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Wisdom Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'generator'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>AI Synthesis</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap relative ${
              activeTab === 'favorites'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Favorites</span>
            {favoriteCount > 0 && (
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono-code ${
                activeTab === 'favorites' ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-800 text-slate-300'
              }`}>
                {favoriteCount}
              </span>
            )}
          </button>
        </nav>

        {/* Action Buttons: Random & Live Screensaver */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onRandomQuote}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/40 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-all group"
          >
            <Shuffle className="w-4 h-4 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
            <span>Random Quote</span>
          </button>

          <button
            onClick={onLaunchScreensaver}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Monitor className="w-4 h-4" />
            <span>Live Screensaver</span>
          </button>
        </div>
      </div>
    </header>
  );
};
