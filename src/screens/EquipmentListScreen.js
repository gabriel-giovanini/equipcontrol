import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
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

const COLORS = {
  headerBg: '#1E293B',
  bodyBg: '#F1F5F9',
  cardBg: '#FFFFFF',
  primary: '#4F46E5',
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  textWhite: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
};

export default function EquipmentListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [equipments, setEquipments] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [counts, setCounts] = useState({ total: 0, emUso: 0, disponiveis: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.emptySubtitle}>Carregando...</Text>
        </View>
      );
    }

    if (errorMessage) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={40} color={COLORS.error} />
          <Text style={styles.emptyTitle}>Erro ao carregar lista</Text>
          <Text style={styles.emptySubtitle}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => loadEquipments(true)}
          >
            <Text style={styles.emptyButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const isAll = selectedFilter === 'ALL';

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="folder-open-outline" size={44} color={COLORS.textSecondary} />
        <Text style={styles.emptyTitle}>
          {isAll
            ? 'Nenhum equipamento cadastrado'
            : `Nenhum equipamento "${selectedFilter}"`}
        </Text>
        <Text style={styles.emptySubtitle}>
          {isAll
            ? 'Toque no botão + para cadastrar um equipamento.'
            : 'Não há equipamentos com esse status no momento.'}
        </Text>

        {!isAll && (
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => setSelectedFilter('ALL')}
          >
            <Text style={styles.emptyButtonText}>Mostrar todos</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>EquipControl</Text>
        <Text style={styles.headerSubtitle}>Controle de Equipamentos</Text>

        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[
              styles.statCard,
              selectedFilter === 'ALL' && styles.statCardSelected,
            ]}
            onPress={() => setSelectedFilter('ALL')}
            activeOpacity={0.7}
          >
            <Text style={styles.statNumber}>{counts.total}</Text>
            <Text style={styles.statLabel}>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statCard,
              selectedFilter === 'Em uso' && styles.statCardSelected,
            ]}
            onPress={() => setSelectedFilter('Em uso')}
            activeOpacity={0.7}
          >
            <Text style={[styles.statNumber, { color: '#FBBF24' }]}>
              {counts.emUso}
            </Text>
            <Text style={styles.statLabel}>Em uso</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statCard,
              selectedFilter === 'Disponível' && styles.statCardSelected,
            ]}
            onPress={() => setSelectedFilter('Disponível')}
            activeOpacity={0.7}
          >
            <Text style={[styles.statNumber, { color: '#4ADE80' }]}>
              {counts.disponiveis}
            </Text>
            <Text style={styles.statLabel}>Disponíveis</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedFilter === 'ALL'
              ? 'Equipamentos cadastrados'
              : `Filtro: ${selectedFilter}`}
          </Text>
          <Text style={styles.sectionCount}>{equipments.length} item(ns)</Text>
        </View>

        <FlatList
          data={equipments}
          keyExtractor={(item) => String(item.id)}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => (
            <EquipmentCard
              equipment={item}
              onPress={() => navigation.navigate('EquipmentDetail', { equipment: item })}
            />
          )}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('EquipmentForm')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={COLORS.textWhite} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.headerBg,
  },
  header: {
    backgroundColor: COLORS.headerBg,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statCardSelected: {
    borderColor: '#818CF8',
    backgroundColor: '#3B4254',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
  statLabel: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 4,
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.bodyBg,
    paddingTop: 18,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  sectionCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  listContent: {
    paddingBottom: 90,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
});
