import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import EquipmentCard from '../components/EquipmentCard';
import defaultEquipments from '../data/equipments';

// ─── Design Tokens (UI/UX Pro Max: SaaS Enterprise) ────────────────
const COLORS = {
  // Surfaces
  bgDeep:       '#0A1628',
  bgHeader:     '#0F1D32',
  bgBody:       '#F0F4FA',
  bgCard:       '#FFFFFF',
  bgModal:      'rgba(10, 22, 40, 0.6)',

  // Primary palette
  primary:      '#3B82F6',
  primaryDark:  '#1D4ED8',
  primaryLight: '#60A5FA',

  // Semantic
  success:      '#10B981',
  successBg:    'rgba(16, 185, 129, 0.12)',
  warning:      '#F59E0B',
  warningBg:    'rgba(245, 158, 11, 0.12)',
  error:        '#EF4444',
  errorBg:      'rgba(239, 68, 68, 0.12)',

  // Text
  textWhite:    '#FFFFFF',
  textPrimary:  '#0F172A',
  textSecondary:'#64748B',
  textMuted:    '#94A3B8',
  textOnDark:   'rgba(255, 255, 255, 0.6)',

  // Glass & Border
  glassBg:      'rgba(255, 255, 255, 0.08)',
  glassBorder:  'rgba(255, 255, 255, 0.12)',
  border:       '#E2E8F0',
};

const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };
const RADIUS = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, pill: 100 };

const ASYNC_STORAGE_KEY = '@equipments_v1';

export default function EquipmentListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [equipments, setEquipments] = useState([]);

  // Load Data
  const loadEquipments = async () => {
    try {
      const storedData = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
      if (storedData) {
        setEquipments(JSON.parse(storedData));
      } else {
        // Inicializa com dados estáticos se vazio
        const initialData = defaultEquipments.map(e => ({
          ...e,
          // Adapta o status antigo para as novas opções
          status: e.status === 'Emprestado' ? 'Em uso' : e.status
        }));
        await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(initialData));
        setEquipments(initialData);
      }
    } catch (error) {
      console.error('Failed to load equipments', error);
    }
  };

  // Reload when screen gets focus (in case detail screen updates status or new equipment is added)
  useFocusEffect(
    React.useCallback(() => {
      loadEquipments();
    }, [])
  );

  const [selectedFilter, setSelectedFilter] = useState('ALL'); // 'ALL' | 'Em uso' | 'Disponível'

  const totalEquipments = equipments.length;
  const emUso = equipments.filter((e) => e.status === 'Em uso').length;
  const disponiveis = equipments.filter((e) => e.status === 'Disponível').length;

  // Filtragem dinâmica com base no card de estatística clicado
  const filteredEquipments = equipments.filter((item) => {
    if (selectedFilter === 'ALL') return true;
    return item.status === selectedFilter;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleGroup}>
            <View style={styles.logoMark}>
              <Ionicons name="cube" size={18} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.headerGreeting}>Controle de</Text>
              <Text style={styles.headerTitle}>Equipamentos</Text>
            </View>
          </View>
        </View>

        {/* Stats Row com Filtros Clicáveis */}
        <View style={styles.statsRow}>
          {/* Card Total */}
          <TouchableOpacity
            style={[
              styles.statCard,
              styles.statCardAccent,
              selectedFilter === 'ALL' && styles.statCardActiveTotal,
            ]}
            onPress={() => setSelectedFilter('ALL')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Filtrar todos os equipamentos"
          >
            <View style={[styles.statIconWrap, selectedFilter === 'ALL' && styles.statIconWrapActiveTotal]}>
              <Ionicons
                name="layers-outline"
                size={18}
                color={selectedFilter === 'ALL' ? COLORS.primary : COLORS.primaryLight}
              />
            </View>
            <Text style={styles.statNumber}>{totalEquipments}</Text>
            <Text style={[styles.statLabel, selectedFilter === 'ALL' && styles.statLabelActiveTotal]}>
              Total
            </Text>
            {selectedFilter === 'ALL' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          {/* Card Em Uso */}
          <TouchableOpacity
            style={[
              styles.statCard,
              selectedFilter === 'Em uso' && styles.statCardActiveWarning,
            ]}
            onPress={() => setSelectedFilter('Em uso')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Filtrar equipamentos em uso"
          >
            <View style={[styles.statIconWrap, { backgroundColor: COLORS.warningBg }]}>
              <Ionicons name="arrow-redo-outline" size={16} color={COLORS.warning} />
            </View>
            <Text style={[styles.statNumber, { color: COLORS.warning }]}>{emUso}</Text>
            <Text style={[styles.statLabel, selectedFilter === 'Em uso' && styles.statLabelActiveWarning]}>
              Em Uso
            </Text>
            {selectedFilter === 'Em uso' && <View style={[styles.activeDot, { backgroundColor: COLORS.warning }]} />}
          </TouchableOpacity>

          {/* Card Disponíveis */}
          <TouchableOpacity
            style={[
              styles.statCard,
              selectedFilter === 'Disponível' && styles.statCardActiveSuccess,
            ]}
            onPress={() => setSelectedFilter('Disponível')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Filtrar equipamentos disponíveis"
          >
            <View style={[styles.statIconWrap, { backgroundColor: COLORS.successBg }]}>
              <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.success} />
            </View>
            <Text style={[styles.statNumber, { color: COLORS.success }]}>{disponiveis}</Text>
            <Text style={[styles.statLabel, selectedFilter === 'Disponível' && styles.statLabelActiveSuccess]}>
              Disponíveis
            </Text>
            {selectedFilter === 'Disponível' && <View style={[styles.activeDot, { backgroundColor: COLORS.success }]} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View
              style={[
                styles.sectionIndicator,
                selectedFilter === 'Em uso' && { backgroundColor: COLORS.warning },
                selectedFilter === 'Disponível' && { backgroundColor: COLORS.success },
              ]}
            />
            <Text style={styles.sectionTitle}>
              {selectedFilter === 'ALL'
                ? 'Todos os Equipamentos'
                : selectedFilter === 'Em uso'
                ? 'Equipamentos Em Uso'
                : 'Equipamentos Disponíveis'}
            </Text>
          </View>
          <View style={styles.sectionBadge}>
            <Text
              style={[
                styles.sectionCount,
                selectedFilter === 'Em uso' && { color: COLORS.warning },
                selectedFilter === 'Disponível' && { color: COLORS.success },
              ]}
            >
              {filteredEquipments.length}
            </Text>
          </View>
        </View>

        <FlatList
          data={filteredEquipments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EquipmentCard
              equipment={item}
              onPress={() => navigation.navigate('EquipmentDetail', { equipment: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>
                {selectedFilter === 'ALL'
                  ? 'Nenhum equipamento cadastrado'
                  : `Nenhum equipamento "${selectedFilter}"`}
              </Text>
              <Text style={styles.emptySubtitle}>
                {selectedFilter === 'ALL'
                  ? 'Toque no botão "+" abaixo para adicionar o primeiro equipamento.'
                  : 'Toque em "Total" acima para visualizar todos os registros.'}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* ── FAB (Navegação para formulário de cadastro) ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('EquipmentForm')}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Adicionar Equipamento"
      >
        <View style={styles.fabInner}>
          <Ionicons name="add" size={26} color={COLORS.textWhite} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDeep },
  
  // ── Header ──
  header: {
    backgroundColor: COLORS.bgDeep,
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xxl },
  headerTitleGroup: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  logoMark: { width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: 'rgba(59, 130, 246, 0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)' },
  headerGreeting: { fontSize: 12, color: COLORS.textOnDark, fontWeight: '500', letterSpacing: 0.8, textTransform: 'uppercase' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textWhite, letterSpacing: -0.5, marginTop: 1 },

  // ── Stats ──
  statsRow: { flexDirection: 'row', gap: SPACING.sm },
  statCard: { flex: 1, backgroundColor: COLORS.glassBg, borderRadius: RADIUS.lg, paddingVertical: SPACING.lg, paddingHorizontal: SPACING.md, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.glassBorder },
  statCardAccent: { backgroundColor: 'rgba(59, 130, 246, 0.12)', borderColor: 'rgba(59, 130, 246, 0.2)' },
  statCardActiveTotal: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.28)',
  },
  statIconWrapActiveTotal: {
    backgroundColor: '#FFFFFF',
  },
  statCardActiveWarning: {
    borderColor: COLORS.warning,
    backgroundColor: 'rgba(245, 158, 11, 0.24)',
  },
  statCardActiveSuccess: {
    borderColor: COLORS.success,
    backgroundColor: 'rgba(16, 185, 129, 0.24)',
  },
  statLabelActiveTotal: {
    color: COLORS.textWhite,
    fontWeight: '800',
  },
  statLabelActiveWarning: {
    color: COLORS.warning,
    fontWeight: '800',
  },
  statLabelActiveSuccess: {
    color: COLORS.success,
    fontWeight: '800',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  statIconWrap: { width: 32, height: 32, borderRadius: RADIUS.sm, backgroundColor: 'rgba(59, 130, 246, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  statNumber: { fontSize: 24, fontWeight: '800', color: COLORS.textWhite, letterSpacing: -0.5 },
  statLabel: { fontSize: 10, color: COLORS.textOnDark, fontWeight: '600', marginTop: SPACING.xs, letterSpacing: 0.5, textTransform: 'uppercase' },

  // ── Body ──
  body: { flex: 1, backgroundColor: COLORS.bgBody, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, paddingTop: SPACING.xxl, paddingHorizontal: SPACING.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  sectionIndicator: { width: 3, height: 18, borderRadius: 2, backgroundColor: COLORS.primary },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.2 },
  sectionBadge: { backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.pill },
  sectionCount: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },
  listContent: { paddingBottom: 100 },

  // ── FAB ──
  fab: {
    position: 'absolute',
    bottom: 32,
    right: SPACING.xxl,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  fabInner: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },

  // ── Empty State ──
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl * 2,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
