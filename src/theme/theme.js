import { Platform } from 'react-native';

// Paleta do painel escuro premium (estilo Money Sync)
export const COLORS = {
  bg: '#0c0a09',
  panel: 'rgba(255,255,255,0.035)',
  panelHover: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.16)',
  white: '#FFFFFF',
  text: '#FAFAF9',
  text70: 'rgba(255,255,255,0.7)',
  text50: 'rgba(255,255,255,0.5)',
  text45: 'rgba(255,255,255,0.45)',
  text30: 'rgba(255,255,255,0.3)',
  ink: '#0c0a09',
  danger: '#F87171',
};

export const RADIUS = {
  panel: 24,
  control: 16,
  pill: 999,
};

export const FONTS = {
  display500: 'Montserrat_500Medium',
  display700: 'Montserrat_700Bold',
  display800: 'Montserrat_800ExtraBold',
  display900: 'Montserrat_900Black',
  body400: 'DMSans_400Regular',
  body500: 'DMSans_500Medium',
  body700: 'DMSans_700Bold',
};

export const TABULAR = { fontVariant: ['tabular-nums'] };

// Paletas por categoria: c1 (centro), c2 (40%), c3 (borda) do degradê radial
export const CATEGORY_PALETTES = {
  Notebook: { c1: '#FFD89B', c2: '#F97316', c3: '#3B1206', accent: '#FB923C' },
  Projetor: { c1: '#B8F5DC', c2: '#14B8A6', c3: '#032B2A', accent: '#2DD4BF' },
  Tablet: { c1: '#FFD0D7', c2: '#F43F5E', c3: '#3F0715', accent: '#FB7185' },
  Monitor: { c1: '#EEFCC4', c2: '#84CC16', c3: '#162604', accent: '#A3E635' },
  Câmera: { c1: '#C4ECFF', c2: '#0EA5E9', c3: '#062A44', accent: '#38BDF8' },
  Outros: { c1: '#FFF0BF', c2: '#EAB308', c3: '#3A1D04', accent: '#FACC15' },
};

export function getPalette(categoria) {
  return CATEGORY_PALETTES[categoria] || CATEGORY_PALETTES.Outros;
}

// Cor da bolinha de status (8px + texto normal)
export function getStatusColor(status) {
  switch (status) {
    case 'Disponível':
      return '#4ADE80';
    case 'Em uso':
    case 'Emprestado':
      return '#FBBF24';
    case 'Quebrado':
    case 'Em manutenção':
      return '#F87171';
    default:
      return '#A8A29E';
  }
}

// useNativeDriver não existe na web; evita aviso no console
export const NATIVE_DRIVER = Platform.OS !== 'web';

export const WIDE_BREAKPOINT = 900;

// clamp(2.1rem, 3.7vw, 4.4rem)
export function headingSize(width) {
  return Math.min(70.4, Math.max(33.6, width * 0.037));
}
