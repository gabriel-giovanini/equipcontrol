import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { COLORS, FONTS, headingSize } from '../theme/theme';

// Kicker: Montserrat 700, 12px, maiúsculas, letter-spacing .25em
export function Kicker({ children, color = COLORS.text50, style }) {
  return <Text style={[styles.kicker, { color }, style]}>{children}</Text>;
}

// Título em 2 linhas curtas; a segunda em branco 45%
export function Heading({ line1, line2, scale = 1, style, numberOfLines }) {
  const { width } = useWindowDimensions();
  const size = headingSize(width) * scale;
  const textStyle = {
    fontSize: size,
    lineHeight: size * 1.02,
    letterSpacing: -0.02 * size,
  };
  return (
    <View style={style} accessibilityRole="header">
      <Text style={[styles.heading, textStyle]} numberOfLines={numberOfLines}>
        {line1}
      </Text>
      {line2 ? (
        <Text
          style={[styles.heading, textStyle, { color: COLORS.text45 }]}
          numberOfLines={numberOfLines}
        >
          {line2}
        </Text>
      ) : null}
    </View>
  );
}

// Rótulo de formulário: Montserrat 700, 11px, maiúsculas, .14em, branco 50%
export function FieldLabel({ children, style }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  kicker: {
    fontFamily: FONTS.display700,
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  heading: {
    fontFamily: FONTS.display800,
    color: COLORS.white,
  },
  label: {
    fontFamily: FONTS.display700,
    fontSize: 11,
    letterSpacing: 1.54,
    textTransform: 'uppercase',
    color: COLORS.text50,
  },
});
