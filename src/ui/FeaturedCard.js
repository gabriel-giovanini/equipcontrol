import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, NATIVE_DRIVER, RADIUS, TABULAR, getPalette } from '../theme/theme';
import { Grain, RadialFill } from './Backdrop';
import FloatingIllustration, { useTilt } from './Illustration';
import { IconButton, PrimaryButton } from './Buttons';
import StatusDot from './StatusDot';
import { useCountUp } from './motion';

function pad(n) {
  return String(n).padStart(2, '0');
}

// Card de destaque: troca o equipamento exibido com < > (estado local de UI)
export default function FeaturedCard({ items, index, onIndexChange, onOpen, compact }) {
  const item = items[index] || items[0];
  const palette = getPalette(item?.categoria);
  const tilt = useTilt(9);

  // Transição de cor do degradê (crossfade entre camadas)
  const [layers, setLayers] = useState({ prev: palette, current: palette });
  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (layers.current === palette) return;
    setLayers((l) => ({ prev: l.current, current: palette }));
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: NATIVE_DRIVER,
    }).start();
  }, [palette]); // eslint-disable-line react-hooks/exhaustive-deps

  // Saída girando + entrada com mola elástica
  const x = useRef(new Animated.Value(0)).current;
  const rot = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(1)).current;
  const busy = useRef(false);

  const go = (dir) => {
    if (busy.current || items.length < 2) return;
    busy.current = true;
    const exit = { duration: 280, easing: Easing.in(Easing.cubic), useNativeDriver: NATIVE_DRIVER };
    Animated.parallel([
      Animated.timing(x, { toValue: -dir * 110, ...exit }),
      Animated.timing(rot, { toValue: -dir * 40, ...exit }),
      Animated.timing(op, { toValue: 0, ...exit }),
    ]).start(() => {
      onIndexChange((index + dir + items.length) % items.length);
      x.setValue(dir * 110);
      rot.setValue(dir * 30);
      const spring = { speed: 7, bounciness: 15, useNativeDriver: NATIVE_DRIVER };
      Animated.spring(x, { toValue: 0, ...spring }).start();
      Animated.spring(rot, { toValue: 0, ...spring }).start();
      // Libera novo arraste/clique assim que o item aparece (a mola continua assentando)
      Animated.timing(op, { toValue: 1, duration: 220, useNativeDriver: NATIVE_DRIVER }).start(() => {
        busy.current = false;
      });
    });
  };

  // Arrastar para os lados: o item acompanha o dedo/mouse e, ao soltar
  // depois de um certo ponto, troca para o próximo (ou anterior).
  const goRef = useRef(go);
  goRef.current = go;
  const canSwipe = useRef(false);
  canSwipe.current = items.length > 1;

  const springBack = () => {
    const spring = { speed: 14, bounciness: 10, useNativeDriver: NATIVE_DRIVER };
    Animated.parallel([
      Animated.spring(x, { toValue: 0, ...spring }),
      Animated.spring(rot, { toValue: 0, ...spring }),
      Animated.timing(op, { toValue: 1, duration: 180, useNativeDriver: NATIVE_DRIVER }),
    ]).start();
  };

  const pan = useRef(
    PanResponder.create({
      // Só assume o gesto se for claramente horizontal (a rolagem vertical continua funcionando)
      onMoveShouldSetPanResponder: (_e, g) =>
        canSwipe.current && !busy.current && Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2,
      onMoveShouldSetPanResponderCapture: (_e, g) =>
        canSwipe.current && !busy.current && Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_e, g) => {
        x.setValue(g.dx);
        rot.setValue(g.dx * 0.3);
        op.setValue(Math.max(0.35, 1 - Math.abs(g.dx) / 320));
      },
      onPanResponderRelease: (_e, g) => {
        // Passa se arrastou o suficiente, ou se foi um "flick" rápido de pelo menos 30px
        const passed = Math.abs(g.dx) > 70 || (Math.abs(g.vx) > 0.5 && Math.abs(g.dx) > 30);
        if (passed && canSwipe.current && !busy.current) {
          goRef.current(g.dx < 0 ? 1 : -1);
        } else {
          springBack();
        }
      },
      onPanResponderTerminate: springBack,
    })
  ).current;

  const position = useCountUp(index + 1, 600);
  const total = useCountUp(items.length, 600);

  if (!item) return null;

  const artSize = compact ? 170 : 210;

  return (
    <View
      style={[styles.card, compact && styles.cardCompact, items.length > 1 && styles.draggable]}
      {...tilt.handlers}
      {...pan.panHandlers}
    >
      <RadialFill {...layers.prev} />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade }]}>
        <RadialFill {...layers.current} />
      </Animated.View>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(12,10,9,0)', 'rgba(12,10,9,0.45)']}
        style={styles.bottomFade}
      />
      <Grain opacity={0.08} />

      <View style={styles.topRow}>
        <Text style={styles.kicker}>Em destaque</Text>
        <Text style={styles.counter}>
          {pad(position)}
          <Text style={styles.counterTotal}> / {pad(total)}</Text>
        </Text>
      </View>

      <View style={styles.artArea}>
        <Animated.View
          style={{
            opacity: op,
            transform: [
              { translateX: x },
              { rotate: rot.interpolate({ inputRange: [-90, 90], outputRange: ['-90deg', '90deg'] }) },
            ],
          }}
        >
          <FloatingIllustration
            categoria={item.categoria}
            size={artSize}
            tiltTransform={tilt.transform}
          />
        </Animated.View>
      </View>

      <View style={styles.bottom}>
        <Animated.View style={[styles.info, { opacity: op }]}>
          <Text style={styles.name} numberOfLines={1}>
            {item.nome}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta} numberOfLines={1}>
              {item.categoria}
            </Text>
            <StatusDot status={item.status} color="rgba(255,255,255,0.85)" />
          </View>
        </Animated.View>

        <View style={styles.controls}>
          {items.length > 1 ? (
            <>
              <IconButton icon="chevron-back" light size={42} onPress={() => go(-1)} accessibilityLabel="Equipamento anterior" />
              <IconButton icon="chevron-forward" light size={42} onPress={() => go(1)} accessibilityLabel="Próximo equipamento" />
            </>
          ) : null}
          <PrimaryButton compact label="Detalhes" onPress={() => onOpen(item)} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 380,
    borderRadius: RADIUS.panel,
    overflow: 'hidden',
    padding: 22,
    justifyContent: 'space-between',
    backgroundColor: '#1c1917',
  },
  draggable: Platform.OS === 'web' ? { cursor: 'grab', userSelect: 'none' } : {},
  cardCompact: {
    minHeight: 340,
    padding: 18,
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kicker: {
    fontFamily: FONTS.display700,
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: 'rgba(12,10,9,0.72)',
  },
  counter: {
    fontFamily: FONTS.display800,
    fontSize: 16,
    color: COLORS.ink,
    ...TABULAR,
  },
  counterTotal: {
    color: 'rgba(12,10,9,0.5)',
  },
  artArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 14,
  },
  info: {
    flex: 1,
    minWidth: 160,
  },
  name: {
    fontFamily: FONTS.display800,
    fontSize: 22,
    letterSpacing: -0.4,
    color: COLORS.white,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  meta: {
    fontFamily: FONTS.body500,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
