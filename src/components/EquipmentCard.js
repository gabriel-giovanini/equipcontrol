import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
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
    >
      <View style={[styles.iconContainer, { backgroundColor: statusBg }]}>
        <Ionicons name={iconName} size={22} color={statusColor} />
      </View>

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
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
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
