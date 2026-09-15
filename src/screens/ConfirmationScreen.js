import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Design Tokens (UI/UX Pro Max: SaaS Enterprise) ────────────────
const COLORS = {
  bgDeep:       '#0A1628',
  bgBody:       '#F0F4FA',
  bgCard:       '#FFFFFF',

  primary:      '#3B82F6',
  primaryBg:    'rgba(59, 130, 246, 0.1)',
  primaryLight: '#60A5FA',

  success:      '#10B981',
  successBg:    'rgba(16, 185, 129, 0.12)',
  successGlow:  'rgba(16, 185, 129, 0.25)',

  warning:      '#F59E0B',
  warningBg:    'rgba(245, 158, 11, 0.12)',

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

export default function ConfirmationScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const equipment = route.params?.equipment || {};

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <View style={styles.logoMark}>
            <Ionicons name="checkmark-done" size={18} color={COLORS.success} />
          </View>
          <Text style={styles.headerTitle}>Confirmação</Text>
        </View>
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Success Card */}
          <View style={styles.card}>
            {/* Success Icon with Glow */}
            <View style={styles.iconGlowOuter}>
              <View style={styles.iconGlowInner}>
                <Ionicons name="checkmark-sharp" size={44} color={COLORS.success} />
              </View>
            </View>

            {/* Mensagem Principal Solicitada */}
            <Text style={styles.title}>Cadastro efetuado com sucesso!</Text>

            <View style={styles.careMessageWrap}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} style={styles.careIcon} />
              <Text style={styles.careMessage}>
                Cuidado com nosso aparelho, bom uso!
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Resumo do Equipamento Cadastrado */}
            {equipment.nome ? (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryHeader}>DETALHES DO REGISTRO</Text>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Equipamento:</Text>
                  <Text style={styles.summaryValue} numberOfLines={1}>{equipment.nome}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Categoria:</Text>
                  <Text style={styles.summaryValue}>{equipment.categoria || 'Outros'}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Responsável:</Text>
                  <Text style={styles.summaryValue}>{equipment.responsavel || 'Não atribuído'}</Text>
                </View>

                {equipment.dataCadastro && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Data de Cadastro:</Text>
                    <Text style={styles.summaryValue}>{equipment.dataCadastro}</Text>
                  </View>
                )}

                <View style={styles.statusRow}>
                  <Text style={styles.summaryLabel}>Status Inicial:</Text>
                  <View style={styles.statusBadge}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Disponível</Text>
                  </View>
                </View>
              </View>
            ) : null}

            {/* Botões de Ação */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('EquipmentList')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Voltar para a Lista de Equipamentos"
            >
              <Ionicons name="list" size={20} color={COLORS.textWhite} />
              <Text style={styles.primaryButtonText}>Voltar para a Lista</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.replace('EquipmentForm')}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Cadastrar outro equipamento"
            >
              <Ionicons name="add-circle-outline" size={18} color={COLORS.primary} />
              <Text style={styles.secondaryButtonText}>Cadastrar Outro</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
  },

  // ── Header ──
  header: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textWhite,
    letterSpacing: -0.3,
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
    paddingVertical: SPACING.xxl,
  },

  // ── Card ──
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.textPrimary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  // ── Success Icon ──
  iconGlowOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.successGlow,
  },
  iconGlowInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Title & Message ──
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: SPACING.md,
  },
  careMessageWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.18)',
  },
  careIcon: {
    marginRight: 2,
  },
  careMessage: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.xl,
  },

  // ── Summary Box ──
  summaryBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
    textTransform: 'uppercase',
  },

  // ── Buttons ──
  primaryButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  primaryButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    gap: 6,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
