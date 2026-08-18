import React, { useState, useEffect, useRef } from 'react';
import { Quote, ScreensaverConfig, AspectRatio, ThemeStyle } from '../types/quote';
import { drawScreensaverToCanvas, downloadCanvasImage } from '../utils/canvasExporter';
import { X, Download, Monitor, Smartphone, Maximize2, Square, Sparkles, Layout, Type, Frame, Eye, Share2 } from 'lucide-react';

interface ScreensaverStudioModalProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
  onShare?: (quote: Quote, imageUrl?: string) => void;
}

export const ScreensaverStudioModal: React.FC<ScreensaverStudioModalProps> = ({
  quote,
  isOpen,
  onClose,
  onShare,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [config, setConfig] = useState<ScreensaverConfig>({
    aspectRatio: '16:9',
    theme: 'obsidian_gold',
    fontSize: 'medium',
    fontFamily: 'cormorant',
    showAuthorBio: true,
    showDisciplineBadge: true,
    showBorderFrame: true,
    showWatermark: true,
    showCustomSubtitle: false,
    customSubtitle: 'Wisdom for quiet contemplation',
  });

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (isOpen && quote && canvasRef.current) {
      drawScreensaverToCanvas(canvasRef.current, quote, config);
    }
  }, [isOpen, quote, config]);

  if (!isOpen || !quote) return null;

  const handleDownload = () => {
    if (!canvasRef.current || !quote) return;
    setIsExporting(true);
    setTimeout(() => {
      const sanitizedAuthor = quote.author.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      downloadCanvasImage(canvasRef.current!, `axiom_screensaver_${sanitizedAuthor}_${config.aspectRatio.replace(':', 'x')}.png`);
      setIsExporting(false);
    }, 150);
  };

  const ASPECT_PRESETS: { id: AspectRatio; label: string; sub: string; icon: any }[] = [
    { id: '16:9', label: '16:9 Desktop', sub: '3840 x 2160 (4K)', icon: Monitor },
    { id: '16:10', label: '16:10 Macbook', sub: '2560 x 1600', icon: Layout },
    { id: '9:16', label: '9:16 Mobile', sub: '1080 x 1920 Phone', icon: Smartphone },
    { id: '1:1', label: '1:1 Square', sub: '2048 x 2048', icon: Square },
    { id: '21:9', label: '21:9 UltraWide', sub: '3440 x 1440', icon: Maximize2 },
  ];

  const THEME_OPTIONS: { id: ThemeStyle; name: string; previewClass: string }[] = [
    { id: 'obsidian_gold', name: 'Monastery Obsidian', previewClass: 'bg-slate-950 text-amber-300 border-amber-500/40' },
    { id: 'parchment_ink', name: 'Parchment & Ink', previewClass: 'bg-amber-100 text-stone-900 border-stone-400' },
    { id: 'cybernetic_slate', name: 'Cybernetic Slate', previewClass: 'bg-slate-900 text-cyan-300 border-cyan-500/40' },
    { id: 'emerald_sanctuary', name: 'Emerald Sanctuary', previewClass: 'bg-emerald-950 text-emerald-200 border-emerald-500/40' },
    { id: 'sunset_solitude', name: 'Sunset Solitude', previewClass: 'bg-indigo-950 text-amber-200 border-amber-500/40' },
    { id: 'japanese_zen', name: 'Japanese Zen', previewClass: 'bg-slate-100 text-slate-900 border-slate-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-jakarta">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-slate-100">4K Screensaver Studio</h2>
              <p className="text-xs text-slate-400">
                Customize resolution, typography, layout, and export pristine wallpapers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split view (Live Preview vs Control Panel) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Column: Live Canvas Preview */}
          <div className="lg:col-span-7 bg-slate-950/80 p-4 sm:p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800/80 overflow-y-auto">
            <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Eye className="w-4 h-4 text-amber-400" /> High-Resolution Canvas Render
              </span>
              <span>{config.aspectRatio} Aspect Ratio</span>
            </div>

            {/* Canvas Box */}
            <div className="relative w-full flex items-center justify-center min-h-[260px] sm:min-h-[360px] max-h-[460px] bg-slate-900/60 rounded-2xl border border-slate-800/80 p-2 overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[420px] object-contain rounded-xl shadow-2xl border border-slate-800/60 transition-all"
              />
            </div>

            <div className="mt-4 w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400 italic text-center sm:text-left">
                Rendered at full 4K UHD pixel density for pristine display wallpapers.
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onShare && (
                  <button
                    onClick={() => {
                      if (!canvasRef.current || !quote) return;
                      const dataUrl = canvasRef.current.toDataURL('image/png');
                      onShare(quote, dataUrl);
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition-all"
                    title="Share quote wallpaper to social media"
                  >
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>Share HD</span>
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Exporting...' : 'Download HD'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Controls Panel */}
          <div className="lg:col-span-5 p-5 space-y-5 overflow-y-auto max-h-[580px] text-xs">
            {/* Aspect Ratio Selector */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-amber-400" /> Device Resolution & Ratio
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ASPECT_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const selected = config.aspectRatio === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setConfig({ ...config, aspectRatio: preset.id })}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        selected
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs">{preset.label}</span>
                        <Icon className="w-3.5 h-3.5 opacity-70" />
                      </div>
                      <span className="text-[9px] font-mono opacity-80">{preset.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-[#E0E0E0] text-[10px] uppercase tracking-[0.2em] font-semibold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8A8A90]" /> Aesthetic Theme Palette
              </label>
              <div className="grid grid-cols-2 gap-2">
                {THEME_OPTIONS.map((th) => {
                  const selected = config.theme === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => setConfig({ ...config, theme: th.id })}
                      className={`p-2.5 rounded border text-left transition-all flex items-center justify-between ${th.previewClass} ${
                        selected ? 'ring-2 ring-[#E0E0E0] ring-offset-2 ring-offset-[#0F0F12] font-bold' : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      <span className="text-xs">{th.name}</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-current" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography Selector */}
            <div>
              <label className="block text-[#E0E0E0] text-[10px] uppercase tracking-[0.2em] font-semibold mb-2 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#8A8A90]" /> Typography Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cormorant', name: 'Cormorant' },
                  { id: 'cinzel', name: 'Cinzel Roman' },
                  { id: 'playfair', name: 'Playfair' },
                  { id: 'outfit', name: 'Outfit Sans' },
                  { id: 'jakarta', name: 'Jakarta' },
                  { id: 'mono', name: 'Monospace' },
                ].map((f) => {
                  const selected = config.fontFamily === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setConfig({ ...config, fontFamily: f.id as any })}
                      className={`p-2 rounded border transition-all text-center text-[10px] uppercase tracking-wider ${
                        selected
                          ? 'bg-[#E0E0E0] text-[#0F0F12] border-[#E0E0E0] font-bold'
                          : 'bg-[#0F0F12] text-[#8A8A90] border-[#2A2A30] hover:text-[#E0E0E0]'
                      }`}
                    >
                      {f.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Size & Frame Toggles */}
            <div className="space-y-3 pt-3 border-t border-[#2A2A30]">
              <label className="block text-[#E0E0E0] text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5">
                <Frame className="w-3.5 h-3.5 text-[#8A8A90]" /> Layout & Frame Options
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2 rounded bg-[#0F0F12] border border-[#2A2A30] text-[#B0B0B8] text-[11px] cursor-pointer hover:bg-[#1A1A20]">
                  <input
                    type="checkbox"
                    checked={config.showBorderFrame}
                    onChange={(e) => setConfig({ ...config, showBorderFrame: e.target.checked })}
                    className="rounded border-[#2A2A30] text-[#E0E0E0] focus:ring-0"
                  />
                  <span>Border Frame</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded bg-[#0F0F12] border border-[#2A2A30] text-[#B0B0B8] text-[11px] cursor-pointer hover:bg-[#1A1A20]">
                  <input
                    type="checkbox"
                    checked={config.showDisciplineBadge}
                    onChange={(e) => setConfig({ ...config, showDisciplineBadge: e.target.checked })}
                    className="rounded border-[#2A2A30] text-[#E0E0E0] focus:ring-0"
                  />
                  <span>Discipline Badge</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded bg-[#0F0F12] border border-[#2A2A30] text-[#B0B0B8] text-[11px] cursor-pointer hover:bg-[#1A1A20]">
                  <input
                    type="checkbox"
                    checked={config.showAuthorBio}
                    onChange={(e) => setConfig({ ...config, showAuthorBio: e.target.checked })}
                    className="rounded border-[#2A2A30] text-[#E0E0E0] focus:ring-0"
                  />
                  <span>Author Bio / Era</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded bg-[#0F0F12] border border-[#2A2A30] text-[#B0B0B8] text-[11px] cursor-pointer hover:bg-[#1A1A20]">
                  <input
                    type="checkbox"
                    checked={config.showWatermark}
                    onChange={(e) => setConfig({ ...config, showWatermark: e.target.checked })}
                    className="rounded border-[#2A2A30] text-[#E0E0E0] focus:ring-0"
                  />
                  <span>Axiom Signature</span>
                </label>
              </div>

              {/* Custom Subtitle input */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-[#B0B0B8] text-[11px] mb-1">
                  <input
                    type="checkbox"
                    checked={config.showCustomSubtitle}
                    onChange={(e) => setConfig({ ...config, showCustomSubtitle: e.target.checked })}
                    className="rounded border-[#2A2A30] text-[#E0E0E0] focus:ring-0"
                  />
                  <span>Include Personal Motto</span>
                </label>
                {config.showCustomSubtitle && (
                  <input
                    type="text"
                    value={config.customSubtitle}
                    onChange={(e) => setConfig({ ...config, customSubtitle: e.target.value })}
                    placeholder="Enter personal motto..."
                    className="w-full mt-1.5 px-3 py-2 rounded bg-[#0F0F12] border border-[#2A2A30] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#4A4A50]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
