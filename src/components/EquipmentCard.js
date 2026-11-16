import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  bgCard: '#FFFFFF',
  primary: '#4F46E5',
  primaryBg: '#EEF2FF',
  success: '#16A34A',
  successBg: '#DCFCE7',
  warning: '#D97706',
  warningBg: '#FEF3C7',
  error: '#DC2626',
  errorBg: '#FEE2E2',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  border: '#E2E8F0',
};

const CATEGORY_ICONS = {
  Notebook: 'laptop-outline',
  Projetor: 'videocam-outline',
  Tablet: 'tablet-portrait-outline',
  Monitor: 'desktop-outline',
  Câmera: 'camera-outline',
};

export default function EquipmentCard({ equipment, onPress }) {
  const iconName = CATEGORY_ICONS[equipment.categoria] || 'hardware-chip-outline';

  let statusColor = COLORS.primary;
  let statusBg = COLORS.primaryBg;

  if (equipment.status === 'Disponível') {
    statusColor = COLORS.success;
    statusBg = COLORS.successBg;
  } else if (equipment.status === 'Em uso') {
    statusColor = COLORS.warning;
    statusBg = COLORS.warningBg;
  } else if (equipment.status === 'Quebrado') {
    statusColor = COLORS.error;
    statusBg = COLORS.errorBg;
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Equipamento ${equipment.nome}, Categoria ${equipment.categoria}, Status ${equipment.status}`}
    >
      {equipment.foto ? (
        <Image source={{ uri: equipment.foto }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.iconContainer, { backgroundColor: statusBg }]}>
          <Ionicons name={iconName} size={22} color={statusColor} />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {equipment.nome}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {equipment.categoria} • {equipment.responsavel || 'Sem responsável'}
        </Text>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {equipment.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 64,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 12,
    resizeMode: 'cover',
    backgroundColor: '#F1F5F9',
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
