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

export default function EquipmentDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { equipment } = route.params;

  const isAvailable = equipment.status === 'Disponível';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card principal */}
        <View style={styles.mainCard}>
          {/* Ícone + Nome */}
          <View style={styles.topSection}>
            <View style={[styles.iconCircle, isAvailable ? styles.iconAvailable : styles.iconBorrowed]}>
              <Ionicons
                name={getCategoryIcon(equipment.categoria)}
                size={32}
                color="#FFFFFF"
              />
            </View>
            <Text style={styles.equipmentName}>{equipment.nome}</Text>
            <View style={[styles.statusBadge, isAvailable ? styles.badgeAvailable : styles.badgeBorrowed]}>
              <View style={[styles.statusDot, isAvailable ? styles.dotAvailable : styles.dotBorrowed]} />
              <Text style={[styles.statusText, isAvailable ? styles.textAvailable : styles.textBorrowed]}>
                {equipment.status}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Informações detalhadas */}
          <View style={styles.detailsSection}>
            <DetailRow
              icon="person-outline"
              label="Responsável"
              value={equipment.responsavel}
            />
            <DetailRow
              icon="pricetag-outline"
              label="Categoria"
              value={equipment.categoria}
            />
            <DetailRow
              icon="calendar-outline"
              label="Data de empréstimo"
              value={equipment.dataEmprestimo || '—'}
            />
            <DetailRow
              icon="time-outline"
              label="Data prevista de devolução"
              value={equipment.dataDevolucao || '—'}
              isLast
            />
          </View>
        </View>

        {/* Card de ação rápida */}
        <View style={styles.actionCard}>
          <Ionicons name="information-circle-outline" size={20} color="#1A6BF5" />
          <Text style={styles.actionText}>
            Funções de edição e devolução estarão disponíveis na próxima versão.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Sub-componente para cada linha de detalhe
function DetailRow({ icon, label, value, isLast }) {
  return (
    <View style={[styles.detailRow, isLast && styles.detailRowLast]}>
      <View style={styles.detailIconWrap}>
        <Ionicons name={icon} size={18} color="#1A6BF5" />
      </View>
      <View style={styles.detailTextWrap}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

// Mapeia categorias para ícones
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D2137',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSpacer: {
    width: 42,
  },
  body: {
    flex: 1,
    backgroundColor: '#F2F4F8',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#1B2A4A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconAvailable: {
    backgroundColor: '#0EA86A',
  },
  iconBorrowed: {
    backgroundColor: '#1A3A6B',
  },
  equipmentName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1B2A4A',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  badgeAvailable: {
    backgroundColor: '#E8F9F0',
  },
  badgeBorrowed: {
    backgroundColor: '#FFF3E6',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotAvailable: {
    backgroundColor: '#0EA86A',
  },
  dotBorrowed: {
    backgroundColor: '#E8871E',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  textAvailable: {
    color: '#0EA86A',
  },
  textBorrowed: {
    color: '#E8871E',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F2F5',
    marginHorizontal: 24,
  },
  detailsSection: {
    padding: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  detailRowLast: {
    marginBottom: 0,
  },
  detailIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#EFF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  detailTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#7A8A9E',
    fontWeight: '500',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 16,
    color: '#1B2A4A',
    fontWeight: '600',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF4FF',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 13,
    color: '#4A6FA5',
    fontWeight: '500',
    lineHeight: 18,
  },
});
