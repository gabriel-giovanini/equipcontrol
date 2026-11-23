import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { NATIVE_DRIVER, getPalette } from '../theme/theme';
import { useReducedMotion } from './motion';

// ---------- Ilustrações 3D em SVG (uma por tipo de equipamento) ----------

function Metal({ id, light = '#F5F5F4', mid = '#A8A29E', dark = '#44403C', vertical = true }) {
  return (
    <LinearGradient id={id} x1="0" y1="0" x2={vertical ? '0' : '1'} y2={vertical ? '1' : '0'}>
      <Stop offset="0" stopColor={light} />
      <Stop offset="0.55" stopColor={mid} />
      <Stop offset="1" stopColor={dark} />
    </LinearGradient>
  );
}

function Screen({ id, accent }) {
  return (
    <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
      <Stop offset="0.35" stopColor={accent} />
      <Stop offset="1" stopColor="#0c0a09" />
    </LinearGradient>
  );
}

function Notebook({ accent, u }) {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      <Defs>
        <Metal id={u + 'nbLid'} light="#57534E" mid="#292524" dark="#0c0a09" />
        <Metal id={u + 'nbBase'} />
        <Metal id={u + 'nbLip'} light="#78716C" mid="#57534E" dark="#292524" />
        <Screen id={u + 'nbScreen'} accent={accent} />
      </Defs>
      <Path d="M44 28 H156 a8 8 0 0 1 8 8 V112 H36 V36 a8 8 0 0 1 8-8z" fill={`url(#${u}nbLid)`} />
      <Rect x="44" y="36" width="112" height="70" rx="4" fill={`url(#${u}nbScreen)`} />
      <Path d="M44 36 H120 L84 106 H44z" fill="#FFFFFF" opacity="0.12" />
      <Circle cx="100" cy="32" r="1.6" fill="#A8A29E" />
      <Path d="M30 112 H170 L188 136 H12z" fill={`url(#${u}nbBase)`} />
      <Path d="M44 116 H156 L164 127 H36z" fill="#292524" opacity="0.35" />
      <Path d="M84 129 H116 L118 134 H82z" fill="#57534E" opacity="0.55" />
      <Rect x="12" y="136" width="176" height="7" rx="3.5" fill={`url(#${u}nbLip)`} />
      <Rect x="86" y="136" width="28" height="3" rx="1.5" fill="#292524" opacity="0.6" />
    </Svg>
  );
}

function Projetor({ accent, u }) {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      <Defs>
        <Metal id={u + 'pjFront'} light="#FAFAF9" mid="#D6D3D1" dark="#A8A29E" />
        <Metal id={u + 'pjTop'} light="#FFFFFF" mid="#F5F5F4" dark="#E7E5E4" />
        <Metal id={u + 'pjSide'} light="#A8A29E" mid="#78716C" dark="#57534E" />
        <RadialGradient id={u + 'pjLens'} cx="0.4" cy="0.35" r="0.7">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="0.25" stopColor={accent} />
          <Stop offset="0.7" stopColor="#0c0a09" />
          <Stop offset="1" stopColor="#1c1917" />
        </RadialGradient>
      </Defs>
      <Path d="M30 82 L54 58 H178 L154 82z" fill={`url(#${u}pjTop)`} />
      <Path d="M154 82 L178 58 V122 L154 146z" fill={`url(#${u}pjSide)`} />
      <Rect x="30" y="82" width="124" height="64" rx="6" fill={`url(#${u}pjFront)`} />
      <Circle cx="70" cy="114" r="26" fill="#292524" />
      <Circle cx="70" cy="114" r="20" fill={`url(#${u}pjLens)`} />
      <Circle cx="63" cy="106" r="5" fill="#FFFFFF" opacity="0.7" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Rect key={i} x="108" y={98 + i * 8} width="34" height="3" rx="1.5" fill="#78716C" opacity="0.6" />
      ))}
      <Circle cx="140" cy="70" r="4" fill={accent} />
      <Rect x="40" y="146" width="10" height="6" rx="2" fill="#57534E" />
      <Rect x="134" y="146" width="10" height="6" rx="2" fill="#57534E" />
    </Svg>
  );
}

function Tablet({ accent, u }) {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      <Defs>
        <Metal id={u + 'tbEdge'} light="#D6D3D1" mid="#78716C" dark="#292524" vertical={false} />
        <Metal id={u + 'tbBody'} light="#44403C" mid="#1c1917" dark="#0c0a09" />
        <Screen id={u + 'tbScreen'} accent={accent} />
      </Defs>
      <G transform="rotate(-10 100 100)">
        <Rect x="58" y="22" width="92" height="156" rx="14" fill={`url(#${u}tbEdge)`} />
        <Rect x="54" y="20" width="92" height="156" rx="14" fill={`url(#${u}tbBody)`} />
        <Rect x="61" y="30" width="78" height="136" rx="7" fill={`url(#${u}tbScreen)`} />
        <Path d="M61 30 H112 L72 166 H61z" fill="#FFFFFF" opacity="0.12" />
        <Circle cx="100" cy="25" r="1.6" fill="#78716C" />
      </G>
    </Svg>
  );
}

function Monitor({ accent, u }) {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      <Defs>
        <Metal id={u + 'mnBezel'} light="#57534E" mid="#1c1917" dark="#0c0a09" />
        <Metal id={u + 'mnStand'} light="#E7E5E4" mid="#A8A29E" dark="#57534E" vertical={false} />
        <Screen id={u + 'mnScreen'} accent={accent} />
      </Defs>
      <Rect x="20" y="28" width="160" height="100" rx="10" fill={`url(#${u}mnBezel)`} />
      <Rect x="27" y="35" width="146" height="84" rx="4" fill={`url(#${u}mnScreen)`} />
      <Path d="M27 35 H110 L70 119 H27z" fill="#FFFFFF" opacity="0.12" />
      <Path d="M90 128 H110 L114 160 H86z" fill={`url(#${u}mnStand)`} />
      <Ellipse cx="100" cy="162" rx="44" ry="8" fill={`url(#${u}mnStand)`} />
      <Ellipse cx="100" cy="160" rx="38" ry="5" fill="#FFFFFF" opacity="0.25" />
    </Svg>
  );
}

function Camera({ accent, u }) {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      <Defs>
        <Metal id={u + 'cmBody'} light="#57534E" mid="#292524" dark="#0c0a09" />
        <Metal id={u + 'cmTop'} light="#A8A29E" mid="#57534E" dark="#292524" />
        <Metal id={u + 'cmRing'} light="#E7E5E4" mid="#78716C" dark="#1c1917" />
        <RadialGradient id={u + 'cmGlass'} cx="0.38" cy="0.35" r="0.75">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="0.22" stopColor={accent} />
          <Stop offset="0.65" stopColor="#0c0a09" />
          <Stop offset="1" stopColor="#292524" />
        </RadialGradient>
      </Defs>
      <Path d="M70 62 L78 46 H122 L130 62z" fill={`url(#${u}cmTop)`} />
      <Rect x="26" y="60" width="148" height="92" rx="18" fill={`url(#${u}cmBody)`} />
      <Rect x="26" y="60" width="148" height="20" rx="10" fill="#FFFFFF" opacity="0.06" />
      <Rect x="40" y="52" width="20" height="10" rx="3" fill="#57534E" />
      <Rect x="144" y="70" width="18" height="10" rx="3" fill={accent} opacity="0.9" />
      <Circle cx="100" cy="108" r="38" fill={`url(#${u}cmRing)`} />
      <Circle cx="100" cy="108" r="30" fill="#0c0a09" />
      <Circle cx="100" cy="108" r="24" fill={`url(#${u}cmGlass)`} />
      <Circle cx="91" cy="99" r="6" fill="#FFFFFF" opacity="0.75" />
      <Circle cx="110" cy="118" r="2.5" fill="#FFFFFF" opacity="0.35" />
    </Svg>
  );
}

function Outros({ accent, u }) {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      <Defs>
        <Metal id={u + 'otTop'} light="#FFFFFF" mid="#F5F5F4" dark="#D6D3D1" />
        <Metal id={u + 'otLeft'} light="#D6D3D1" mid="#A8A29E" dark="#78716C" />
        <Metal id={u + 'otRight'} light="#78716C" mid="#57534E" dark="#292524" />
      </Defs>
      <Path d="M100 32 L166 66 L100 100 L34 66z" fill={`url(#${u}otTop)`} />
      <Path d="M34 66 L100 100 V170 L34 136z" fill={`url(#${u}otLeft)`} />
      <Path d="M166 66 L100 100 V170 L166 136z" fill={`url(#${u}otRight)`} />
      <Path d="M100 50 L132 66 L100 82 L68 66z" fill={accent} />
      <Path d="M100 56 L120 66 L100 76 L80 66z" fill="#0c0a09" opacity="0.35" />
      <Path d="M48 96 L86 116 V140 L48 120z" fill="#FFFFFF" opacity="0.35" />
      {[0, 1, 2, 3].map((i) => (
        <Path
          key={i}
          d={`M114 ${118 + i * 10} L152 ${98 + i * 10}`}
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />
      ))}
    </Svg>
  );
}

const ILLUSTRATIONS = {
  Notebook,
  Projetor,
  Tablet,
  Monitor,
  Câmera: Camera,
  Outros,
};

let artCounter = 0;

// Cada instância ganha ids de gradiente únicos: telas anteriores da pilha
// continuam montadas (ocultas) e ids repetidos fariam o navegador ler a cópia oculta.
export function EquipmentArt({ categoria }) {
  const uid = useRef(null);
  if (uid.current === null) {
    artCounter += 1;
    uid.current = `art${artCounter}-`;
  }
  const Art = ILLUSTRATIONS[categoria] || Outros;
  return <Art accent={getPalette(categoria).accent} u={uid.current} />;
}

// Sombra no chão: elipse difusa (degradê radial até transparente)
function FloorShadow() {
  const uid = useRef(null);
  if (uid.current === null) {
    artCounter += 1;
    uid.current = `shadow${artCounter}`;
  }
  return (
    <Svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
      <Defs>
        <RadialGradient id={uid.current} cx="50" cy="10" r="50" gradientUnits="userSpaceOnUse"
          gradientTransform="translate(50 10) scale(1 0.2) translate(-50 -10)">
          <Stop offset="0" stopColor="#000000" stopOpacity="0.9" />
          <Stop offset="0.5" stopColor="#000000" stopOpacity="0.45" />
          <Stop offset="1" stopColor="#000000" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100" height="20" fill={`url(#${uid.current})`} />
    </Svg>
  );
}

// ---------- Inclinação com o mouse (perspective 1300px) ----------

export function useTilt(max = 10) {
  const reduced = useReducedMotion();
  const rx = useRef(new Animated.Value(0)).current;
  const ry = useRef(new Animated.Value(0)).current;

  const go = (value, toValue) =>
    Animated.spring(value, {
      toValue,
      speed: 18,
      bounciness: 4,
      useNativeDriver: NATIVE_DRIVER,
    }).start();

  const handlers =
    Platform.OS === 'web' && !reduced
      ? {
          onMouseMove: (e) => {
            const rect = e.currentTarget?.getBoundingClientRect?.();
            if (!rect) return;
            const px = (e.nativeEvent.clientX - rect.left) / rect.width - 0.5;
            const py = (e.nativeEvent.clientY - rect.top) / rect.height - 0.5;
            go(ry, px * max * 2);
            go(rx, -py * max * 2);
          },
          onMouseLeave: () => {
            go(rx, 0);
            go(ry, 0);
          },
        }
      : {};

  const transform = [
    { perspective: 1300 },
    {
      rotateX: rx.interpolate({ inputRange: [-90, 90], outputRange: ['-90deg', '90deg'] }),
    },
    {
      rotateY: ry.interpolate({ inputRange: [-90, 90], outputRange: ['-90deg', '90deg'] }),
    },
  ];

  return { handlers, transform };
}

// ---------- Ilustração flutuante com sombra no chão ----------

export default function FloatingIllustration({ categoria, size = 220, tiltTransform }) {
  const reduced = useReducedMotion();
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) {
      float.stopAnimation();
      float.setValue(0);
      return undefined;
    }
    const half = {
      duration: 2100,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: NATIVE_DRIVER,
    };
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, ...half }),
        Animated.timing(float, { toValue: 0, ...half }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [float, reduced]);

  const lift = float.interpolate({ inputRange: [0, 1], outputRange: [0, -22] });
  const shadowScale = float.interpolate({ inputRange: [0, 1], outputRange: [1, 0.72] });
  const shadowOpacity = float.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.22] });

  return (
    <View style={{ width: size, height: size * 1.12, alignItems: 'center' }}>
      <Animated.View
        style={{
          width: size,
          height: size,
          transform: [...(tiltTransform || []), { translateY: lift }],
        }}
      >
        <EquipmentArt categoria={categoria} />
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shadow,
          {
            width: size * 0.8,
            height: size * 0.14,
            opacity: shadowOpacity,
            transform: [{ scaleX: shadowScale }, { scaleY: shadowScale }],
          },
        ]}
      >
        <FloorShadow />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    marginTop: -14,
  },
});
