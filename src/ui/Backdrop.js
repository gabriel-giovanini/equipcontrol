import React, { useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Rect,
  Filter,
  FeTurbulence,
  FeColorMatrix,
} from 'react-native-svg';
import { COLORS } from '../theme/theme';

let idCounter = 0;
function useSvgId(prefix) {
  const ref = useRef(null);
  if (ref.current === null) {
    idCounter += 1;
    ref.current = `${prefix}${idCounter}`;
  }
  return ref.current;
}

// Granulado SVG feTurbulence (opacity .08). Filtros SVG só rodam no navegador.
export function Grain({ opacity = 0.08 }) {
  const id = useSvgId('grain');
  if (Platform.OS !== 'web') return null;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity }]}>
      <Svg width="100%" height="100%">
        <Defs>
          <Filter id={id} x="0" y="0" width="100%" height="100%">
            <FeTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <FeColorMatrix type="saturate" values="0" />
          </Filter>
        </Defs>
        <Rect width="100%" height="100%" filter={`url(#${id})`} />
      </Svg>
    </View>
  );
}

// Degradê radial vibrante: radial-gradient(110% 85% at 50% 45%, c1, c2 40%, c3)
export function RadialFill({ c1, c2, c3 }) {
  const id = useSvgId('rad');
  return (
    <Svg
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <Defs>
        <RadialGradient
          id={id}
          cx="50"
          cy="45"
          r="110"
          fx="50"
          fy="45"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(50 45) scale(1 0.7727) translate(-50 -45)"
        >
          <Stop offset="0" stopColor={c1} />
          <Stop offset="0.4" stopColor={c2} />
          <Stop offset="1" stopColor={c3} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100" height="100" fill={`url(#${id})`} />
    </Svg>
  );
}

// Brilho radial suave no canto (opacity .16, borda difusa equivalente a blur 40px)
function CornerGlow({ color }) {
  const id = useSvgId('glow');
  return (
    <Svg
      pointerEvents="none"
      style={styles.glow}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <Defs>
        <RadialGradient id={id} cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
          {/* Luz neutra e suave, igual à referência aprovada */}
          <Stop offset="0" stopColor={color} stopOpacity="0.15" />
          <Stop offset="0.5" stopColor={color} stopOpacity="0.06" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100" height="100" fill={`url(#${id})`} />
    </Svg>
  );
}

// Brilho neutro (cinza claro) no canto, igual em todas as telas: o dono do
// projeto preferiu esse tom ao brilho colorido (laranja ficava marrom e forte).
const NEUTRAL_GLOW = '#E7E5E4';

// Fundo #0c0a09 + brilho neutro e suave no canto. `glowColor` continua aceito
// pelas telas, mas não muda mais a cor do brilho.
export default function Backdrop({ children, style }) {
  return (
    <View style={[styles.root, style]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <CornerGlow color={NEUTRAL_GLOW} />
        <Grain opacity={0.05} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -260,
    right: -260,
    width: 720,
    height: 720,
  },
});
