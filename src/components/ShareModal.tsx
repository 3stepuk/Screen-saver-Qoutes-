import React, { useState } from 'react';
import { Quote } from '../types/quote';
import { DISCIPLINES } from '../data/quotes';
import { X, Copy, Check, Share2, ExternalLink, Sparkles, MessageSquare, Send } from 'lucide-react';

interface ShareModalProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string | null; // Optional generated canvas data URL from wallpaper studio
}

export const ShareModal: React.FC<ShareModalProps> = ({ quote, isOpen, onClose, imageUrl }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  if (!isOpen || !quote) return null;

  const disciplineInfo = DISCIPLINES[quote.discipline] || DISCIPLINES.nlp;

  // Build deep link URL
  const baseUrl = window.location.origin + window.location.pathname;
  const deepLink = `${baseUrl}?quote=${encodeURIComponent(quote.id)}`;

  // Formatted text for social media
  const socialFormattedText = `“${quote.text}”\n\n— ${quote.author}${quote.authorTitle ? ` (${quote.authorTitle})` : ''}\n\nVia AXIOM Studio: ${deepLink}`;

  const shareTitle = `Aphorism by ${quote.author} - AXIOM Studio`;

  // Native share handler
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `“${quote.text}” — ${quote.author}`,
          url: deepLink,
        });
      } catch (err) {
        console.log('Share dismissed or failed', err);
      }
    }
  };

  // Copy Deep Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(deepLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Copy Full Social Text
  const handleCopyText = () => {
    navigator.clipboard.writeText(socialFormattedText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Copy Canvas Image to Clipboard (if supported)
  const handleCopyImage = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      } else {
        // Fallback: download
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `axiom-quote-${quote.id}.png`;
        a.click();
      }
    } catch (e) {
      console.error('Failed to copy image', e);
    }
  };

  // Social URLs
  const encodedText = encodeURIComponent(`“${quote.text}” — ${quote.author}`);
  const encodedUrl = encodeURIComponent(deepLink);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=Wisdom,AxiomStudio,${quote.discipline.replace('_', '')}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`“${quote.text}” — ${quote.author}\n${deepLink}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-jakarta">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-slate-100">Share Aphorism</h3>
              <p className="text-xs text-slate-400">Generate deep link & social posts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Quote Card Preview */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center relative overflow-hidden">
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-15 pointer-events-none"
              style={{ backgroundColor: disciplineInfo.accentHex }}
            />
            {imageUrl ? (
              <div className="mb-3 rounded-xl overflow-hidden border border-slate-800 max-h-48 flex items-center justify-center bg-black/40">
                <img src={imageUrl} alt="Wallpaper Preview" className="max-h-48 object-contain" />
              </div>
            ) : (
              <>
                <blockquote className="font-cormorant text-xl text-slate-100 italic leading-snug mb-3">
                  “{quote.text}”
                </blockquote>
                <p className="font-cinzel text-xs font-bold text-amber-400">
                  — {quote.author}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{quote.authorTitle}</p>
              </>
            )}
          </div>

          {/* Social Share Buttons Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Share to Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* X / Twitter */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/60 text-slate-200 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-amber-500/20 text-slate-200 group-hover:text-amber-300 flex items-center justify-center mb-1.5 transition-all">
                  <span className="font-bold text-sm">𝕏</span>
                </div>
                <span className="text-[11px] font-semibold">Post on X</span>
              </a>

              {/* LinkedIn */}
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/60 text-slate-200 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-cyan-500/20 text-slate-200 group-hover:text-cyan-300 flex items-center justify-center mb-1.5 transition-all">
                  <span className="font-bold text-xs">in</span>
                </div>
                <span className="text-[11px] font-semibold">LinkedIn</span>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/60 text-slate-200 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-emerald-500/20 text-slate-200 group-hover:text-emerald-300 flex items-center justify-center mb-1.5 transition-all">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold">WhatsApp</span>
              </a>

              {/* Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-800/60 text-slate-200 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-purple-500/20 text-slate-200 group-hover:text-purple-300 flex items-center justify-center mb-1.5 transition-all">
                  <span className="font-bold text-xs">fb</span>
                </div>
                <span className="text-[11px] font-semibold">Facebook</span>
              </a>
            </div>
          </div>

          {/* Native Mobile Share if supported */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Use Native Device Share Sheet</span>
            </button>
          )}

          {/* Deep Link URL Copy Section */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Structured Deep Link URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={deepLink}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono-code select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Copy Full Formatted Text */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleCopyText}
              className="flex-1 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 flex items-center justify-center gap-2 transition-all"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Quote Text Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Formatted Post Text</span>
                </>
              )}
            </button>

            {imageUrl && (
              <button
                onClick={handleCopyImage}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 flex items-center justify-center gap-2 transition-all"
              >
                {copiedImage ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Wallpaper Image Copied!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Copy HD Image</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
