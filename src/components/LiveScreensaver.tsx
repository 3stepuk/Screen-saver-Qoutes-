import React, { useState, useEffect } from 'react';
import { Quote } from '../types/quote';
import { DISCIPLINES } from '../data/quotes';
import { X, ChevronLeft, ChevronRight, Pause, Play, Clock, Sparkles, Compass } from 'lucide-react';

interface LiveScreensaverProps {
  quotes: Quote[];
  isOpen: boolean;
  onClose: () => void;
}

export const LiveScreensaver: React.FC<LiveScreensaverProps> = ({
  quotes,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [intervalSec, setIntervalSec] = useState(15);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock tick
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Slideshow auto-advance
  useEffect(() => {
    if (!isOpen || !isPlaying || quotes.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, intervalSec * 1000);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, intervalSec, quotes.length]);

  // Keyboard shortcut Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || quotes.length === 0) return null;

  const currentQuote = quotes[currentIndex];
  const disciplineInfo = DISCIPLINES[currentQuote.discipline] || DISCIPLINES.nlp;

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none font-jakarta">
      {/* Background Animated Ambient Particles & Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-20 transition-all duration-1000"
          style={{ backgroundColor: disciplineInfo.accentHex }}
        />
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-amber-400/40 animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-cyan-400/30 animate-float [animation-delay:2s]" />
        <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 rounded-full bg-purple-400/30 animate-float [animation-delay:4s]" />
      </div>

      {/* Top Bar: Brand, Clock, Exit */}
      <div className="relative z-10 flex items-center justify-between text-xs sm:text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          <span className="font-cinzel font-bold text-slate-200 tracking-wider text-base">AXIOM</span>
          <span className="hidden sm:inline text-slate-400">• Live Screensaver</span>
        </div>

        {/* Live Clock Overlay */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="font-mono-code text-slate-200 font-semibold">{formattedTime}</span>
          <span className="text-slate-400 hidden sm:inline">({formattedDate})</span>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-slate-100 hover:border-amber-500/40 transition-all"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Exit (Esc)</span>
        </button>
      </div>

      {/* Main Quote Display */}
      <div className="relative z-10 my-auto max-w-5xl mx-auto text-center px-4 transition-all duration-700">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 border bg-slate-900/80 backdrop-blur-md"
          style={{ borderColor: `${disciplineInfo.accentHex}44`, color: disciplineInfo.accentHex }}
        >
          {disciplineInfo.name}
        </span>

        <blockquote className="font-cormorant text-3xl sm:text-5xl md:text-6xl font-medium leading-tight text-slate-100 italic mb-8 drop-shadow-lg">
          “{currentQuote.text}”
        </blockquote>

        {/* Accent divider */}
        <div
          className="w-24 h-0.5 mx-auto mb-6 rounded-full"
          style={{ backgroundColor: disciplineInfo.accentHex }}
        />

        <h3 className="font-cinzel font-bold text-xl sm:text-3xl text-slate-100 mb-2">
          {currentQuote.author}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          {currentQuote.authorTitle} {currentQuote.eraOrDates && `(${currentQuote.eraOrDates})`}
        </p>
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-900 text-xs text-slate-400 font-jakarta">
        <div>
          <span>Quote {currentIndex + 1} of {quotes.length}</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-md">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-all"
            title="Previous Quote"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold transition-all"
            title={isPlaying ? 'Pause Slideshow' : 'Start Slideshow'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % quotes.length)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-all"
            title="Next Quote"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Timer selector */}
        <div className="flex items-center gap-2">
          <span>Interval:</span>
          {[10, 15, 30, 60].map((sec) => (
            <button
              key={sec}
              onClick={() => setIntervalSec(sec)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono-code transition-all ${
                intervalSec === sec
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'hover:text-slate-200'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
