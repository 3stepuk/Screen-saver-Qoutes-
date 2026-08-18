import { Quote, ScreensaverConfig, AspectRatio } from '../types/quote';

export function getDimensionsForAspectRatio(aspect: AspectRatio): { width: number; height: number } {
  switch (aspect) {
    case '16:9':
      return { width: 3840, height: 2160 }; // 4K Desktop
    case '16:10':
      return { width: 2560, height: 1600 }; // Macbook / WQXGA
    case '9:16':
      return { width: 1080, height: 1920 }; // Mobile Phone
    case '1:1':
      return { width: 2048, height: 2048 }; // Square / Avatar
    case '21:9':
      return { width: 3440, height: 1440 }; // UltraWide
    default:
      return { width: 3840, height: 2160 };
  }
}

export function drawScreensaverToCanvas(
  canvas: HTMLCanvasElement,
  quote: Quote,
  config: ScreensaverConfig
): void {
  const { width, height } = getDimensionsForAspectRatio(config.aspectRatio);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Clear background
  ctx.clearRect(0, 0, width, height);

  // 2. Setup theme colors and fonts
  let bgColor1 = '#0F172A';
  let bgColor2 = '#020617';
  let primaryTextColor = '#F8FAFC';
  let secondaryTextColor = '#94A3B8';
  let accentColor = '#D4AF37';
  let fontFamilyName = 'Playfair Display';

  switch (config.fontFamily) {
    case 'cinzel':
      fontFamilyName = 'Cinzel';
      break;
    case 'cormorant':
      fontFamilyName = 'Cormorant Garamond';
      break;
    case 'playfair':
      fontFamilyName = 'Playfair Display';
      break;
    case 'outfit':
      fontFamilyName = 'Outfit';
      break;
    case 'jakarta':
      fontFamilyName = 'Plus Jakarta Sans';
      break;
    case 'mono':
      fontFamilyName = 'JetBrains Mono';
      break;
  }

  switch (config.theme) {
    case 'obsidian_gold':
      bgColor1 = '#0D0F12';
      bgColor2 = '#050608';
      primaryTextColor = '#F3E8C4';
      secondaryTextColor = '#A39B8B';
      accentColor = '#D4AF37';
      break;
    case 'parchment_ink':
      bgColor1 = '#FAF7F0';
      bgColor2 = '#ECE6D8';
      primaryTextColor = '#1C1917';
      secondaryTextColor = '#57534E';
      accentColor = '#7C2D12';
      break;
    case 'cybernetic_slate':
      bgColor1 = '#0B132B';
      bgColor2 = '#040817';
      primaryTextColor = '#F0F9FF';
      secondaryTextColor = '#7DD3FC';
      accentColor = '#38BDF8';
      break;
    case 'emerald_sanctuary':
      bgColor1 = '#03211E';
      bgColor2 = '#011210';
      primaryTextColor = '#FEF3C7';
      secondaryTextColor = '#A7F3D0';
      accentColor = '#10B981';
      break;
    case 'sunset_solitude':
      bgColor1 = '#1E1B4B';
      bgColor2 = '#0F0E26';
      primaryTextColor = '#FDE68A';
      secondaryTextColor = '#C7D2FE';
      accentColor = '#F59E0B';
      break;
    case 'japanese_zen':
      bgColor1 = '#F8FAFC';
      bgColor2 = '#E2E8F0';
      primaryTextColor = '#0F172A';
      secondaryTextColor = '#475569';
      accentColor = '#991B1B';
      break;
  }

  // Draw background gradient
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, Math.max(width, height) / 1.2);
  bgGrad.addColorStop(0, bgColor1);
  bgGrad.addColorStop(1, bgColor2);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Background subtle grid or radial ring
  if (config.theme === 'cybernetic_slate') {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.lineWidth = 2;
    const step = 80;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  } else {
    // Subtle circular aura
    const auraGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.min(width, height) * 0.45);
    auraGrad.addColorStop(0, `${accentColor}18`);
    auraGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Border Frame if enabled
  const margin = Math.min(width, height) * 0.05;
  if (config.showBorderFrame) {
    ctx.strokeStyle = `${accentColor}55`;
    ctx.lineWidth = Math.max(3, Math.round(width * 0.0015));
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    // Inner subtle corner notches
    const notch = Math.min(width, height) * 0.02;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = Math.max(4, Math.round(width * 0.002));
    // Top Left
    ctx.beginPath();
    ctx.moveTo(margin - notch, margin);
    ctx.lineTo(margin + notch, margin);
    ctx.moveTo(margin, margin - notch);
    ctx.lineTo(margin, margin + notch);
    ctx.stroke();
    // Top Right
    ctx.beginPath();
    ctx.moveTo(width - margin - notch, margin);
    ctx.lineTo(width - margin + notch, margin);
    ctx.moveTo(width - margin, margin - notch);
    ctx.lineTo(width - margin, margin + notch);
    ctx.stroke();
    // Bottom Left
    ctx.beginPath();
    ctx.moveTo(margin - notch, height - margin);
    ctx.lineTo(margin + notch, height - margin);
    ctx.moveTo(margin, height - margin - notch);
    ctx.lineTo(margin, height - margin + notch);
    ctx.stroke();
    // Bottom Right
    ctx.beginPath();
    ctx.moveTo(width - margin - notch, height - margin);
    ctx.lineTo(width - margin + notch, height - margin);
    ctx.moveTo(width - margin, height - margin - notch);
    ctx.lineTo(width - margin, height - margin + notch);
    ctx.stroke();
  }

  // 3. Draw Header Badge / Discipline Name
  let currentY = margin + Math.min(width, height) * 0.08;

  if (config.showDisciplineBadge) {
    ctx.font = `600 ${Math.round(width * 0.012)}px 'Outfit', sans-serif`;
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const discLabel = `—  ${quote.discipline.toUpperCase().replace('_', ' ')}  —`;
    ctx.fillText(discLabel, width / 2, currentY);
    currentY += Math.min(width, height) * 0.06;
  }

  // 4. Calculate Quote Font Size based on text length and config
  let fontMultiplier = 1;
  if (config.fontSize === 'small') fontMultiplier = 0.8;
  if (config.fontSize === 'large') fontMultiplier = 1.2;
  if (config.fontSize === 'extra-large') fontMultiplier = 1.4;

  const baseFontSize = Math.round(Math.min(width, height) * 0.045 * fontMultiplier);
  const quoteFontSize = Math.max(28, baseFontSize);
  
  ctx.font = `italic 600 ${quoteFontSize}px '${fontFamilyName}', serif`;
  ctx.fillStyle = primaryTextColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  // Word wrap logic
  const maxQuoteWidth = width - margin * 3.2;
  const words = quote.text.split(' ');
  const lines: string[] = [];
  let currentLine = `“${words[0]}`;

  for (let i = 1; i < words.length; i++) {
    const testLine = `${currentLine} ${words[i]}`;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxQuoteWidth) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(`${currentLine}”`);

  // Center vertical position for quote text block
  const lineHeight = quoteFontSize * 1.45;
  const totalTextBlockHeight = lines.length * lineHeight;
  
  // Center quote vertically within safe inner frame
  const centerY = height / 2 - totalTextBlockHeight / 2 - (config.showAuthorBio ? quoteFontSize * 0.8 : 0);

  // Render Quote lines
  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, centerY + index * lineHeight);
  });

  // 5. Render Author & Title
  const authorY = centerY + totalTextBlockHeight + Math.min(width, height) * 0.05;

  // Decorative Accent Bar
  ctx.fillStyle = accentColor;
  ctx.fillRect(width / 2 - Math.min(width, height) * 0.06, authorY, Math.min(width, height) * 0.12, Math.max(3, width * 0.001));

  // Author Name
  const authorFontSize = Math.round(quoteFontSize * 0.7);
  ctx.font = `700 ${authorFontSize}px 'Cinzel', serif`;
  ctx.fillStyle = primaryTextColor;
  ctx.fillText(quote.author, width / 2, authorY + Math.min(width, height) * 0.03);

  // Author Subtitle / Context
  if (config.showAuthorBio) {
    const bioFontSize = Math.round(quoteFontSize * 0.45);
    ctx.font = `400 ${bioFontSize}px 'Outfit', sans-serif`;
    ctx.fillStyle = secondaryTextColor;
    const bioText = quote.eraOrDates ? `${quote.authorTitle} • ${quote.eraOrDates}` : quote.authorTitle;
    ctx.fillText(bioText, width / 2, authorY + Math.min(width, height) * 0.03 + authorFontSize * 1.3);
  }

  // 6. Custom Subtitle if enabled
  if (config.showCustomSubtitle && config.customSubtitle.trim()) {
    const subY = height - margin - Math.min(width, height) * 0.08;
    ctx.font = `italic 400 ${Math.round(quoteFontSize * 0.4)}px 'Cormorant Garamond', serif`;
    ctx.fillStyle = secondaryTextColor;
    ctx.fillText(`“${config.customSubtitle.trim()}”`, width / 2, subY);
  }

  // 7. Watermark / Signature
  if (config.showWatermark) {
    ctx.font = `500 ${Math.round(width * 0.009)}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = `${secondaryTextColor}77`;
    ctx.textAlign = 'right';
    ctx.fillText('AXIOM STUDIO', width - margin - 20, height - margin - 15);
  }
}

export function downloadCanvasImage(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}
