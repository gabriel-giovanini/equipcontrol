import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONTS, RADIUS, getPalette } from '../theme/theme';
import StatusDot from '../ui/StatusDot';
import { usePressScale } from '../ui/motion';

const CATEGORY_ICONS = {
  Notebook: 'laptop-outline',
  Projetor: 'videocam-outline',
  Tablet: 'tablet-portrait-outline',
  Monitor: 'desktop-outline',
  Câmera: 'camera-outline',
};

export default function EquipmentCard({ equipment, onPress }) {
  const iconName = CATEGORY_ICONS[equipment.categoria] || 'hardware-chip-outline';
  const palette = getPalette(equipment.categoria);
  const press = usePressScale(0.97);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityLabel={`Equipamento ${equipment.nome}, Categoria ${equipment.categoria}, Status ${equipment.status}`}
    >
      {({ hovered }) => (
        <Animated.View
          style={[
            styles.card,
            hovered && styles.cardHover,
            { transform: [{ scale: press.scale }] },
          ]}
        >
          {equipment.foto ? (
            <Image source={{ uri: equipment.foto }} style={styles.thumbnail} />
          ) : (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={22} color={palette.accent} />
            </View>
          )}

          <View style={styles.infoContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {equipment.nome}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {equipment.categoria} · {equipment.responsavel || 'Sem responsável'}
            </Text>
          </View>

          <StatusDot status={equipment.status} style={styles.status} />

          <Ionicons
            name="chevron-forward"
            size={18}
            color={hovered ? COLORS.white : COLORS.text30}
          />
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.panel,
    borderRadius: RADIUS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 16,
    marginBottom: 10,
    minHeight: 72,
    gap: 14,
  },
  cardHover: {
    backgroundColor: COLORS.panelHover,
    borderColor: COLORS.borderStrong,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbnail: {
    width: 46,
    height: 46,
    borderRadius: 16,
    resizeMode: 'cover',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  infoContainer: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: FONTS.display700,
    fontSize: 15,
    color: COLORS.white,
    marginBottom: 3,
  },
  subtitle: {
    fontFamily: FONTS.body400,
    fontSize: 13,
    color: COLORS.text50,
  },
  status: {
    flexShrink: 0,
  },
});
