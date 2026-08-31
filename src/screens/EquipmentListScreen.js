import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import equipments from '../data/equipments';
import EquipmentCard from '../components/EquipmentCard';

export default function EquipmentListScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Contagem para o resumo
  const totalEquipments = equipments.length;
  const emprestados = equipments.filter((e) => e.status === 'Emprestado').length;
  const disponiveis = equipments.filter((e) => e.status === 'Disponível').length;

  const handleAddEquipment = () => {
    Alert.alert(
      'Em breve',
      'Funcionalidade disponível em breve.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleEquipmentPress = (equipment) => {
    navigation.navigate('EquipmentDetail', { equipment });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerGreeting}>Bem-vindo ao</Text>
            <Text style={styles.headerTitle}>EquipControl</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="settings-outline" size={22} color="rgba(255,255,255,0.7)" />
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalEquipments}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMiddle]}>
            <Text style={[styles.statNumber, { color: '#FFC857' }]}>{emprestados}</Text>
            <Text style={styles.statLabel}>Emprestados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#5EEAD4' }]}>{disponiveis}</Text>
            <Text style={styles.statLabel}>Disponíveis</Text>
          </View>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Equipamentos</Text>
          <Text style={styles.sectionCount}>{totalEquipments} itens</Text>
        </View>

        <FlatList
          data={equipments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EquipmentCard
              equipment={item}
              onPress={() => handleEquipmentPress(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* FAB - Botão Flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddEquipment}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D2137',
  },
  header: {
    backgroundColor: '#0D2137',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  statCardMiddle: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  body: {
    flex: 1,
    backgroundColor: '#F2F4F8',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B2A4A',
    letterSpacing: -0.2,
  },
  sectionCount: {
    fontSize: 13,
    color: '#7A8A9E',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#1A6BF5',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#1A6BF5',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
