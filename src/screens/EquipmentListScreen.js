import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import EquipmentCard from '../components/EquipmentCard';
import {
  getAllEquipments,
  getEquipmentsByStatus,
  getEquipmentCounts,
} from '../database/database';
import { COLORS, FONTS, RADIUS, TABULAR, WIDE_BREAKPOINT, getPalette, getStatusColor } from '../theme/theme';
import Backdrop from '../ui/Backdrop';
import { TopBar } from '../ui/Shell';
import { Heading, Kicker } from '../ui/Typography';
import { GlassButton, PrimaryButton } from '../ui/Buttons';
import FeaturedCard from '../ui/FeaturedCard';
import FloatingIllustration from '../ui/Illustration';
import { FadeUp, useCountUp } from '../ui/motion';

function StatPanel({ label, value, dotColor, selected, onPress, compact }) {
  const display = useCountUp(value);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={{ flex: 1 }}
    >
      {({ hovered }) => (
        <View
          style={[
            styles.statCard,
            compact && styles.statCardCompact,
            hovered && styles.statCardHover,
            selected && styles.statCardSelected,
          ]}
        >
          <Text style={[styles.statNumber, compact && styles.statNumberCompact]}>
            {display}
          </Text>
          <View style={[styles.statLabelRow, compact && styles.statLabelRowCompact]}>
            {dotColor ? <View style={[styles.statDot, { backgroundColor: dotColor }]} /> : null}
            <Text style={[styles.statLabel, compact && styles.statLabelCompact]}>
              {label}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

export default function EquipmentListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [equipments, setEquipments] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [counts, setCounts] = useState({ total: 0, emUso: 0, disponiveis: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  // Estado só de apresentação: qual equipamento aparece no card de destaque
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const loadEquipments = useCallback(
    async (showLoading = false) => {
      if (showLoading) {
        setIsLoading(true);
      }
      setErrorMessage(null);

      try {
        const [rows, stats] = await Promise.all([
          selectedFilter === 'ALL'
            ? getAllEquipments()
            : getEquipmentsByStatus(selectedFilter),
          getEquipmentCounts(),
        ]);
        setEquipments(rows);
        setCounts(stats);
      } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        setErrorMessage(error.message || 'Erro ao carregar os equipamentos.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedFilter]
  );

  useFocusEffect(
    useCallback(() => {
      loadEquipments();
    }, [loadEquipments])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadEquipments(false);
  };

  const isWide = width >= WIDE_BREAKPOINT;
  const isNarrow = width < 520;
  const showFeatured = !isLoading && !errorMessage && equipments.length > 0;
  const safeFeaturedIndex = equipments.length ? featuredIndex % equipments.length : 0;
  const featured = showFeatured ? equipments[safeFeaturedIndex] : null;
  const glowColor = getPalette(featured?.categoria || 'Notebook').accent;

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.white} />
          <Text style={styles.emptySubtitle}>Carregando...</Text>
        </View>
      );
    }

    if (errorMessage) {
      return (
        <View style={[styles.emptyContainer, styles.emptyPanel]}>
          <View style={styles.errorIcon}>
            <Ionicons name="alert-circle-outline" size={26} color={COLORS.danger} />
          </View>
          <Text style={styles.emptyTitle}>Erro ao carregar lista</Text>
          <Text style={styles.emptySubtitle}>{errorMessage}</Text>
          <PrimaryButton
            label="Tentar novamente"
            icon="refresh"
            onPress={() => loadEquipments(true)}
          />
        </View>
      );
    }

    const isAll = selectedFilter === 'ALL';

    return (
      <View style={[styles.emptyContainer, styles.emptyPanel]}>
        <FloatingIllustration categoria={isAll ? 'Outros' : 'Notebook'} size={150} />
        <Text style={styles.emptyTitle}>
          {isAll
            ? 'Nenhum equipamento cadastrado'
            : `Nenhum equipamento "${selectedFilter}"`}
        </Text>
        <Text style={styles.emptySubtitle}>
          {isAll
            ? 'Toque em Novo para cadastrar um equipamento.'
            : 'Não há equipamentos com esse status no momento.'}
        </Text>

        {isAll ? (
          <PrimaryButton
            label="Cadastrar equipamento"
            onPress={() => navigation.navigate('EquipmentForm')}
          />
        ) : (
          <GlassButton
            label="Mostrar todos"
            onPress={() => setSelectedFilter('ALL')}
          />
        )}
      </View>
    );
  };

  const stats = (
    <View style={[styles.statsRow, isWide && showFeatured && styles.statsColumn]}>
      <StatPanel
        label="Todos"
        value={counts.total}
        selected={selectedFilter === 'ALL'}
        onPress={() => setSelectedFilter('ALL')}
        compact={isNarrow}
      />
      <StatPanel
        label="Em uso"
        value={counts.emUso}
        dotColor={getStatusColor('Em uso')}
        selected={selectedFilter === 'Em uso'}
        onPress={() => setSelectedFilter('Em uso')}
        compact={isNarrow}
      />
      <StatPanel
        label="Disponíveis"
        value={counts.disponiveis}
        dotColor={getStatusColor('Disponível')}
        selected={selectedFilter === 'Disponível'}
        onPress={() => setSelectedFilter('Disponível')}
        compact={isNarrow}
      />
    </View>
  );

  const header = (
    <View>
      <FadeUp index={0} style={styles.hero}>
        <Kicker>Painel interno</Kicker>
        <Heading line1="Central de" line2="equipamentos." style={{ marginTop: 14 }} />
      </FadeUp>

      <View style={[styles.overview, isWide && styles.overviewWide]}>
        {showFeatured ? (
          <FadeUp index={1} style={isWide ? { flex: 1.6 } : null}>
            <FeaturedCard
              items={equipments}
              index={safeFeaturedIndex}
              onIndexChange={setFeaturedIndex}
              onOpen={(item) => navigation.navigate('EquipmentDetail', { equipment: item })}
              compact={!isWide}
            />
          </FadeUp>
        ) : null}
        <FadeUp index={2} style={isWide ? { flex: 1 } : null}>
          {stats}
        </FadeUp>
      </View>

      <FadeUp index={3} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedFilter === 'ALL'
            ? 'Equipamentos cadastrados'
            : `Filtro: ${selectedFilter}`}
        </Text>
        <Text style={styles.sectionCount}>{equipments.length} item(ns)</Text>
      </FadeUp>
    </View>
  );

  return (
    <Backdrop glowColor={glowColor} style={{ paddingTop: insets.top }}>
      <StatusBar style="light" />

      <TopBar
        title="EquipControl"
        subtitle="Controle de Equipamentos"
        right={
          <PrimaryButton
            compact
            label={isNarrow ? 'Novo' : 'Novo equipamento'}
            onPress={() => navigation.navigate('EquipmentForm')}
            accessibilityLabel="Cadastrar novo equipamento"
          />
        }
      />

      <FlatList
        data={equipments}
        keyExtractor={(item) => String(item.id)}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={header}
        renderItem={({ item, index }) => (
          <FadeUp index={Math.min(index, 8)} delay={240}>
            <EquipmentCard
              equipment={item}
              onPress={() => navigation.navigate('EquipmentDetail', { equipment: item })}
            />
          </FadeUp>
        )}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: isNarrow ? 16 : 24 }]}
      />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    paddingBottom: 48,
  },
  hero: {
    paddingTop: 12,
    paddingBottom: 26,
  },
  overview: {
    gap: 14,
    marginBottom: 30,
  },
  overviewWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statsColumn: {
    flexDirection: 'column',
    flex: 1,
  },
  statCard: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 104,
    padding: 18,
    borderRadius: RADIUS.panel,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardCompact: {
    minHeight: 92,
    padding: 12,
    borderRadius: 20,
  },
  statCardHover: {
    backgroundColor: COLORS.panelHover,
  },
  statCardSelected: {
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  statNumber: {
    fontFamily: FONTS.display800,
    fontSize: 38,
    letterSpacing: -1,
    color: COLORS.white,
    ...TABULAR,
  },
  statNumberCompact: {
    fontSize: 28,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  statLabelRowCompact: {
    gap: 6,
  },
  statLabelCompact: {
    fontSize: 12,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statLabel: {
    fontFamily: FONTS.body500,
    fontSize: 13,
    color: COLORS.text70,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
    gap: 12,
  },
  sectionTitle: {
    flex: 1,
    fontFamily: FONTS.display800,
    fontSize: 18,
    letterSpacing: -0.3,
    color: COLORS.white,
  },
  sectionCount: {
    fontFamily: FONTS.body500,
    fontSize: 13,
    color: COLORS.text50,
    ...TABULAR,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyPanel: {
    borderRadius: RADIUS.panel,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  errorIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(248,113,113,0.12)',
    marginBottom: 6,
  },
  emptyTitle: {
    fontFamily: FONTS.display800,
    fontSize: 20,
    letterSpacing: -0.3,
    color: COLORS.white,
    marginTop: 14,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: FONTS.body400,
    fontSize: 14,
    color: COLORS.text50,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
  },
});
