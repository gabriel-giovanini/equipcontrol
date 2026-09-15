import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
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
  
  // Modal & Form State
  const [isModalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [responsavel, setResponsavel] = useState('');

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

  // Reload when screen gets focus (in case detail screen updates status)
  useFocusEffect(
    React.useCallback(() => {
      loadEquipments();
    }, [])
  );

  const totalEquipments = equipments.length;
  const emUso = equipments.filter((e) => e.status === 'Em uso').length;
  const disponiveis = equipments.filter((e) => e.status === 'Disponível').length;

  const handleSaveEquipment = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome do equipamento é obrigatório.');
      return;
    }

    const newEquipment = {
      id: Date.now().toString(),
      nome: nome.trim(),
      categoria: categoria.trim() || 'Outros',
      responsavel: responsavel.trim() || 'Não atribuído',
      status: 'Disponível', // Status padrão
      dataEmprestimo: null,
      dataDevolucao: null,
    };

    try {
      const updatedList = [...equipments, newEquipment];
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(updatedList));
      setEquipments(updatedList);
      
      // Limpa e fecha modal
      setNome('');
      setCategoria('');
      setResponsavel('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o equipamento.');
    }
  };

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

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardAccent]}>
            <View style={styles.statIconWrap}>
              <Ionicons name="layers-outline" size={18} color={COLORS.primaryLight} />
            </View>
            <Text style={styles.statNumber}>{totalEquipments}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: COLORS.warningBg }]}>
              <Ionicons name="arrow-redo-outline" size={16} color={COLORS.warning} />
            </View>
            <Text style={[styles.statNumber, { color: COLORS.warning }]}>{emUso}</Text>
            <Text style={styles.statLabel}>Em Uso</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: COLORS.successBg }]}>
              <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.success} />
            </View>
            <Text style={[styles.statNumber, { color: COLORS.success }]}>{disponiveis}</Text>
            <Text style={styles.statLabel}>Disponíveis</Text>
          </View>
        </View>
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIndicator} />
            <Text style={styles.sectionTitle}>Equipamentos</Text>
          </View>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionCount}>{totalEquipments}</Text>
          </View>
        </View>

        <FlatList
          data={equipments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EquipmentCard
              equipment={item}
              onPress={() => navigation.navigate('EquipmentDetail', { equipment: item })}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.fabInner}>
          <Ionicons name="add" size={26} color={COLORS.textWhite} />
        </View>
      </TouchableOpacity>

      {/* ── Modal Form ── */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Equipamento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={28} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome (Obrigatório) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Notebook Dell"
                  placeholderTextColor={COLORS.textMuted}
                  value={nome}
                  onChangeText={setNome}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Categoria</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Notebook, Projetor, etc."
                  placeholderTextColor={COLORS.textMuted}
                  value={categoria}
                  onChangeText={setCategoria}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Responsável Inicial</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: João Silva"
                  placeholderTextColor={COLORS.textMuted}
                  value={responsavel}
                  onChangeText={setResponsavel}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEquipment}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Salvar Equipamento</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  statCard: { flex: 1, backgroundColor: COLORS.glassBg, borderRadius: RADIUS.lg, paddingVertical: SPACING.lg, paddingHorizontal: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.glassBorder },
  statCardAccent: { backgroundColor: 'rgba(59, 130, 246, 0.12)', borderColor: 'rgba(59, 130, 246, 0.2)' },
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
    position: 'absolute', bottom: 32, right: SPACING.xxl,
    ...Platform.select({ ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16 }, android: { elevation: 12 } }),
  },
  fabInner: { width: 56, height: 56, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(96, 165, 250, 0.3)' },

  // ── Modal Form ──
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.bgModal,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    padding: SPACING.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  formContainer: {
    paddingBottom: SPACING.xxxl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  saveButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
});
