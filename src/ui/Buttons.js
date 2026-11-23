import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, NATIVE_DRIVER, RADIUS } from '../theme/theme';
import { usePressScale } from './motion';

function useHoverShift() {
  const shift = useRef(new Animated.Value(0)).current;
  const to = (toValue) =>
    Animated.spring(shift, {
      toValue,
      speed: 30,
      bounciness: 10,
      useNativeDriver: NATIVE_DRIVER,
    }).start();
  return { shift, onHoverIn: () => to(5), onHoverOut: () => to(0) };
}

// Primário: branco, texto escuro, seta. Gap aumenta no hover, scale .95 no clique.
export function PrimaryButton({
  label,
  onPress,
  disabled,
  icon = 'arrow-forward',
  compact,
  style,
  accessibilityLabel,
}) {
  const press = usePressScale();
  const hover = useHoverShift();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onHoverIn={hover.onHoverIn}
      onHoverOut={hover.onHoverOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={style}
    >
      <Animated.View
        style={[
          styles.primary,
          compact && styles.compact,
          disabled && styles.disabled,
          { transform: [{ scale: press.scale }] },
        ]}
      >
        {label ? (
          <Text style={[styles.primaryText, compact && styles.compactText]}>
            {label}
          </Text>
        ) : null}
        {icon ? (
          <Animated.View style={{ transform: [{ translateX: hover.shift }] }}>
            <Ionicons name={icon} size={compact ? 16 : 18} color={COLORS.ink} />
          </Animated.View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

// Secundário: vidro sutil
export function GlassButton({
  label,
  onPress,
  disabled,
  icon,
  tone = 'default',
  style,
  accessibilityLabel,
}) {
  const press = usePressScale();
  const color = tone === 'danger' ? COLORS.danger : COLORS.white;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={style}
    >
      {({ hovered }) => (
        <Animated.View
          style={[
            styles.glass,
            hovered && styles.glassHover,
            disabled && styles.disabled,
            { transform: [{ scale: press.scale }] },
          ]}
        >
          {icon ? <Ionicons name={icon} size={18} color={color} /> : null}
          {label ? (
            <Text style={[styles.glassText, { color }]}>{label}</Text>
          ) : null}
        </Animated.View>
      )}
    </Pressable>
  );
}

// Botão redondo só com ícone (voltar, menu, setas)
export function IconButton({ icon, onPress, accessibilityLabel, size = 44, light }) {
  const press = usePressScale(0.9);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {({ hovered }) => (
        <Animated.View
          style={[
            styles.icon,
            { width: size, height: size, borderRadius: size / 2 },
            light && styles.iconLight,
            hovered && (light ? styles.iconLightHover : styles.glassHover),
            { transform: [{ scale: press.scale }] },
          ]}
        >
          <Ionicons name={icon} size={20} color={COLORS.white} />
        </Animated.View>
      )}
    </Pressable>
  );
}

export function Spacer({ h = 0, w = 0 }) {
  return <View style={{ height: h, width: w }} />;
}

const styles = StyleSheet.create({
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 22,
    minHeight: 50,
  },
  compact: {
    paddingHorizontal: 16,
    minHeight: 42,
    gap: 8,
  },
  primaryText: {
    fontFamily: FONTS.display700,
    fontSize: 15,
    color: COLORS.ink,
  },
  compactText: {
    fontSize: 14,
  },
  glass: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 50,
    paddingHorizontal: 20,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  glassHover: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderColor: COLORS.borderStrong,
  },
  glassText: {
    fontFamily: FONTS.display700,
    fontSize: 15,
  },
  disabled: {
    opacity: 0.45,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconLight: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderColor: 'rgba(255,255,255,0.22)',
  },
  iconLightHover: {
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
});
