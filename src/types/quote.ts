export type DisciplineId =
  | 'nlp'
  | 'general_semantics'
  | 'systems_theory'
  | 'werner_erhard'
  | 'jesus'
  | 'church_fathers';

export interface DisciplineInfo {
  id: DisciplineId;
  name: string;
  subtitle: string;
  description: string;
  color: string; // Tailwind color class
  accentHex: string;
  badgeBg: string;
  iconName: string;
  keyFigures: string[];
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  authorTitle: string;
  eraOrDates?: string;
  discipline: DisciplineId;
  tags: string[];
  contextNote: string;
  sourceWork?: string;
  suggestedThemes?: string[];
}

export type AspectRatio = '16:9' | '16:10' | '9:16' | '1:1' | '21:9';

export interface ResolutionOption {
  id: AspectRatio;
  label: string;
  width: number;
  height: number;
  icon: string;
}

export type ThemeStyle =
  | 'obsidian_gold'
  | 'parchment_ink'
  | 'cybernetic_slate'
  | 'emerald_sanctuary'
  | 'sunset_solitude'
  | 'japanese_zen';

export interface ScreensaverTheme {
  id: ThemeStyle;
  name: string;
  bgGradient: string[];
  textColor: string;
  accentColor: string;
  subtextColor: string;
  borderColor: string;
  fontFamily: 'cinzel' | 'playfair' | 'cormorant' | 'outfit' | 'jakarta' | 'mono';
  hasGlow?: boolean;
}

export interface ScreensaverConfig {
  aspectRatio: AspectRatio;
  theme: ThemeStyle;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  fontFamily: 'cinzel' | 'playfair' | 'cormorant' | 'outfit' | 'jakarta' | 'mono';
  showAuthorBio: boolean;
  showDisciplineBadge: boolean;
  showBorderFrame: boolean;
  showWatermark: boolean;
  showCustomSubtitle: boolean;
  customSubtitle: string;
}

export interface ReflectionResult {
  quoteId: string;
  synthesis: string;
  crossParadigmInsight: string;
  practicalAction: string;
}
