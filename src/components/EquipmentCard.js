import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mapeia categorias para ícones
const CATEGORY_ICONS = {
  Notebook: 'laptop-outline',
  Projetor: 'videocam-outline',
  Tablet: 'tablet-portrait-outline',
  Monitor: 'desktop-outline',
  Câmera: 'camera-outline',
};

export default function EquipmentCard({ equipment, onPress }) {
  const isAvailable = equipment.status === 'Disponível';
  const iconName = CATEGORY_ICONS[equipment.categoria] || 'hardware-chip-outline';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Ícone da categoria */}
      <View style={[styles.iconContainer, isAvailable ? styles.iconAvailable : styles.iconBorrowed]}>
        <Ionicons name={iconName} size={24} color="#FFFFFF" />
      </View>

      {/* Informações do equipamento */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {equipment.nome}
        </Text>
        <View style={styles.responsavelRow}>
          <Ionicons name="person-outline" size={13} color="#7A8A9E" />
          <Text style={styles.responsavel} numberOfLines={1}>
            {equipment.responsavel}
          </Text>
        </View>
      </View>

      {/* Badge de status + seta */}
      <View style={styles.rightSection}>
        <View style={[styles.statusBadge, isAvailable ? styles.badgeAvailable : styles.badgeBorrowed]}>
          <View style={[styles.statusDot, isAvailable ? styles.dotAvailable : styles.dotBorrowed]} />
          <Text style={[styles.statusText, isAvailable ? styles.textAvailable : styles.textBorrowed]}>
            {equipment.status}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#C0C9D6" style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#1B2A4A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconAvailable: {
    backgroundColor: '#0EA86A',
  },
  iconBorrowed: {
    backgroundColor: '#1A3A6B',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B2A4A',
    letterSpacing: 0.1,
    marginBottom: 4,
  },
  responsavelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  responsavel: {
    fontSize: 13,
    color: '#7A8A9E',
    fontWeight: '400',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  badgeAvailable: {
    backgroundColor: '#E8F9F0',
  },
  badgeBorrowed: {
    backgroundColor: '#FFF3E6',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotAvailable: {
    backgroundColor: '#0EA86A',
  },
  dotBorrowed: {
    backgroundColor: '#E8871E',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  textAvailable: {
    color: '#0EA86A',
  },
  textBorrowed: {
    color: '#E8871E',
  },
  chevron: {
    marginTop: 8,
  },
});
