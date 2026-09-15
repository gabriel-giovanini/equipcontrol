import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Design Tokens (UI/UX Pro Max: SaaS Enterprise) ────────────────
const COLORS = {
  // Surfaces
  bgDeep:       '#0A1628',
  bgBody:       '#F0F4FA',
  bgCard:       '#FFFFFF',

  // Primary palette
  primary:      '#3B82F6',
  primaryBg:    'rgba(59, 130, 246, 0.1)',

  // Semantic
  success:      '#10B981',
  successBg:    'rgba(16, 185, 129, 0.12)',
  warning:      '#F59E0B',
  warningBg:    'rgba(245, 158, 11, 0.12)',

  // Text
  textWhite:    '#FFFFFF',
  textPrimary:  '#0F172A',
  textSecondary:'#64748B',
  textMuted:    '#94A3B8',

  border:       '#E2E8F0',
  glassBg:      'rgba(255, 255, 255, 0.1)',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 100,
};

export default function EquipmentDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { equipment } = route.params;

  const isAvailable = equipment.status === 'Disponível';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Equipamento</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* ── Body ── */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card */}
        <View style={styles.mainCard}>
          {/* Header Section */}
          <View style={styles.cardHeader}>
            <View style={[styles.iconHero, isAvailable ? styles.iconAvailable : styles.iconBorrowed]}>
              <Ionicons
                name={getCategoryIcon(equipment.categoria)}
                size={40}
                color={isAvailable ? COLORS.success : COLORS.warning}
              />
            </View>
            <Text style={styles.equipmentName}>{equipment.nome}</Text>
            
            <View style={[styles.statusPill, isAvailable ? styles.pillAvailable : styles.pillBorrowed]}>
              <View style={[styles.statusDot, isAvailable ? styles.dotAvailable : styles.dotBorrowed]} />
              <Text style={[styles.statusText, isAvailable ? styles.textAvailable : styles.textBorrowed]}>
                {equipment.status}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Details Section */}
          <View style={styles.detailsList}>
            <DetailItem
              icon="person"
              label="Responsável Atual"
              value={equipment.responsavel}
            />
            <DetailItem
              icon="grid"
              label="Categoria"
              value={equipment.categoria}
            />
            <DetailItem
              icon="calendar"
              label="Data de Retirada"
              value={equipment.dataEmprestimo || '—'}
            />
            <DetailItem
              icon="time"
              label="Devolução Prevista"
              value={equipment.dataDevolucao || '—'}
              isLast
            />
          </View>
        </View>

        {/* Action Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconWrap}>
            <Ionicons name="bulb-outline" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Dica</Text>
            <Text style={styles.infoText}>
              Funções de edição, histórico e devolução estarão disponíveis na próxima versão do sistema.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Sub-components ────────────────────────────────────────────────
function DetailItem({ icon, label, value, isLast }) {
  return (
    <View style={[styles.detailItem, !isLast && styles.detailItemBorder]}>
      <View style={styles.detailIconWrap}>
        <Ionicons name={icon} size={18} color={COLORS.primary} />
      </View>
      <View style={styles.detailTextWrap}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

function getCategoryIcon(category) {
  const icons = {
    Notebook: 'laptop-outline',
    Projetor: 'videocam-outline',
    Tablet: 'tablet-portrait-outline',
    Monitor: 'desktop-outline',
    Câmera: 'camera-outline',
  };
  return icons[category] || 'hardware-chip-outline';
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
  },
  
  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.glassBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textWhite,
    letterSpacing: 0.2,
  },
  headerSpacer: {
    width: 44,
  },

  // ── Body ──
  body: {
    flex: 1,
    backgroundColor: COLORS.bgBody,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },

  // ── Main Card ──
  mainCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.textPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  iconHero: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  iconAvailable: {
    backgroundColor: COLORS.successBg,
  },
  iconBorrowed: {
    backgroundColor: COLORS.warningBg,
  },
  equipmentName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: SPACING.md,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    gap: 6,
  },
  pillAvailable: {
    backgroundColor: COLORS.successBg,
  },
  pillBorrowed: {
    backgroundColor: COLORS.warningBg,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotAvailable: {
    backgroundColor: COLORS.success,
  },
  dotBorrowed: {
    backgroundColor: COLORS.warning,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  textAvailable: {
    color: COLORS.success,
  },
  textBorrowed: {
    color: COLORS.warning,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  // ── Details List ──
  detailsList: {
    padding: SPACING.xxl,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  detailItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailIconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  detailTextWrap: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },

  // ── Info Card ──
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  infoIconWrap: {
    marginRight: SPACING.md,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: '500',
  },
});
