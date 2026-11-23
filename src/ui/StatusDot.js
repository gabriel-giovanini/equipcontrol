import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, getStatusColor } from '../theme/theme';

// Status: bolinha de 8px na cor + texto normal (nunca pílula com fundo)
export default function StatusDot({ status, color, textStyle, style }) {
  return (
    <View style={[styles.row, style]}>
      <View
        style={[styles.dot, { backgroundColor: getStatusColor(status) }]}
      />
      <Text style={[styles.text, color ? { color } : null, textStyle]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontFamily: FONTS.body500,
    fontSize: 14,
    color: COLORS.text70,
  },
});
