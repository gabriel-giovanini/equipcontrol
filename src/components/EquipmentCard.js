import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Design Tokens (UI/UX Pro Max: SaaS Enterprise) ────────────────
const COLORS = {
  bgCard:       '#FFFFFF',
  
  primary:      '#3B82F6',
  primaryLight: '#60A5FA',
  primaryBg:    'rgba(59, 130, 246, 0.1)',

  success:      '#10B981',
  successBg:    'rgba(16, 185, 129, 0.12)',
  
  warning:      '#F59E0B',
  warningBg:    'rgba(245, 158, 11, 0.12)',

  error:        '#EF4444',
  errorBg:      'rgba(239, 68, 68, 0.12)',

  textPrimary:  '#0F172A',
  textSecondary:'#64748B',
  textMuted:    '#94A3B8',

  border:       '#E2E8F0',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 100,
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

  // Define colors based on status
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
      accessibilityLabel={`Equipamento ${equipment.nome}`}
    >
      {/* ── Icon ── */}
      <View style={[styles.iconContainer, { backgroundColor: statusBg }]}>
        <Ionicons 
          name={iconName} 
          size={24} 
          color={statusColor} 
        />
      </View>

      {/* ── Info ── */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {equipment.nome}
        </Text>
        <View style={styles.responsavelRow}>
          <Ionicons name="person-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.responsavel} numberOfLines={1}>
            {equipment.responsavel || 'Sem responsável'}
          </Text>
        </View>
      </View>

      {/* ── Status & Action ── */}
      <View style={styles.rightSection}>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {equipment.status}
          </Text>
        </View>
        <View style={styles.chevronWrap}>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  // ── Icon ──
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },

  // ── Info ──
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
    marginBottom: SPACING.xs,
  },
  responsavelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  responsavel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  // ── Right Section ──
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 44,
    marginLeft: SPACING.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  chevronWrap: {
    marginTop: 'auto',
  },
});
