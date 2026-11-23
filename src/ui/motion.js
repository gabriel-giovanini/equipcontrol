import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';
import { NATIVE_DRIVER } from '../theme/theme';

// prefers-reduced-motion (na web o react-native-web usa matchMedia)
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => mounted && setReduced(Boolean(value)))
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      (value) => setReduced(Boolean(value))
    );
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);

  return reduced;
}

// Equivalente ao power3.out do GSAP
export const POWER3_OUT = Easing.bezier(0.215, 0.61, 0.355, 1);

// Entrada em stagger: y 26 → 0, opacity 0 → 1, .7s
export function FadeUp({ index = 0, delay = 0, style, children }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 700,
      delay: delay + index * 70,
      easing: POWER3_OUT,
      useNativeDriver: NATIVE_DRIVER,
    }).start();
  }, [progress, index, delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [26, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

// Scale .95 com mola ao pressionar
export function usePressScale(pressedScale = 0.95) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue) =>
    Animated.spring(scale, {
      toValue,
      speed: 40,
      bounciness: toValue === 1 ? 12 : 0,
      useNativeDriver: NATIVE_DRIVER,
    }).start();

  return {
    scale,
    onPressIn: () => animateTo(pressedScale),
    onPressOut: () => animateTo(1),
  };
}

// Contagem animada para números (tabular-nums no Text que renderiza)
export function useCountUp(target, duration = 900) {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return undefined;
    const value = new Animated.Value(from);
    const id = value.addListener(({ value: v }) => setDisplay(Math.round(v)));
    Animated.timing(value, {
      toValue: target,
      duration,
      easing: POWER3_OUT,
      useNativeDriver: false,
    }).start(() => {
      fromRef.current = target;
      setDisplay(target);
    });
    return () => {
      value.removeListener(id);
      value.stopAnimation();
      fromRef.current = target;
    };
  }, [target, duration]);

  return display;
}
