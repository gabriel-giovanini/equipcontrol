import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Design Tokens (UI/UX Pro Max: Indigo Premium) ─────────────────
const COLORS = {
  // Surfaces
  bgDeep:       '#0B1120',
  bgBody:       '#F8FAFC',
  bgCard:       '#FFFFFF',

  // Primary palette — Indigo
  primary:      '#6366F1',
  primaryBg:    'rgba(99, 102, 241, 0.10)',
  primaryLight: '#818CF8',

  // Semantic
  success:      '#10B981',
  successBg:    'rgba(16, 185, 129, 0.10)',
  warning:      '#F59E0B',
  warningBg:    'rgba(245, 158, 11, 0.10)',
  error:        '#EF4444',
  errorBg:      'rgba(239, 68, 68, 0.10)',

  // Text
  textWhite:    '#FFFFFF',
  textPrimary:  '#0F172A',
  textSecondary:'#64748B',
  textMuted:    '#94A3B8',
  textOnDark:   'rgba(255, 255, 255, 0.55)',

  border:       '#E8ECF4',
  glassBg:      'rgba(255, 255, 255, 0.08)',
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

const ASYNC_STORAGE_KEY = '@equipments_v1';

const CATEGORIES = [
  { label: 'Notebook', icon: 'laptop-outline' },
  { label: 'Projetor', icon: 'videocam-outline' },
  { label: 'Tablet', icon: 'tablet-portrait-outline' },
  { label: 'Monitor', icon: 'desktop-outline' },
  { label: 'Câmera', icon: 'camera-outline' },
  { label: 'Outros', icon: 'hardware-chip-outline' },
];

export default function EquipmentFormScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const getTodayFormatted = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Notebook');
  const [responsavel, setResponsavel] = useState('');
  const [dataCadastro, setDataCadastro] = useState(getTodayFormatted());
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveEquipment = async () => {
    // Validação do campo obrigatório principal
    if (!nome.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, informe o nome do equipamento.');
      return;
    }

    setIsSaving(true);

    const newEquipment = {
      id: Date.now().toString(),
      nome: nome.trim(),
      categoria: categoria.trim() || 'Outros',
      responsavel: responsavel.trim() || 'Não atribuído',
      dataCadastro: dataCadastro.trim() || getTodayFormatted(),
      status: 'Disponível', // Status padrão inicial
      dataEmprestimo: null,
      dataDevolucao: null,
    };

    try {
      const storedData = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
      const list = storedData ? JSON.parse(storedData) : [];
      const updatedList = [newEquipment, ...list];
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(updatedList));

      // Navega para a tela de confirmação personalizada
      navigation.replace('Confirmation', { equipment: newEquipment });
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error);
      Alert.alert('Erro', 'Não foi possível salvar o equipamento.');
    } finally {
      setIsSaving(false);
    }
  };

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
        <Text style={styles.headerTitle}>Novo Equipamento</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* ── Body ── */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Card Form */}
          <View style={styles.mainCard}>
            <View style={styles.cardHero}>
              <View style={styles.heroIconWrap}>
                <Ionicons name="add-circle" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.cardHeroTitle}>Cadastrar Registro</Text>
              <Text style={styles.cardHeroSubtitle}>
                Preencha os dados do equipamento para adicioná-lo ao inventário.
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.formContent}>
              {/* Campo Nome */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Nome do Equipamento <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <View style={styles.inputWrap}>
                  <Ionicons
                    name="hardware-chip-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Notebook Dell Latitude 3420"
                    placeholderTextColor={COLORS.textMuted}
                    value={nome}
                    onChangeText={setNome}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Seletor Rápido de Categoria */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Categoria</Text>
                <View style={styles.chipsContainer}>
                  {CATEGORIES.map((cat) => {
                    const isSelected = categoria === cat.label;
                    return (
                      <TouchableOpacity
                        key={cat.label}
                        style={[
                          styles.chip,
                          isSelected && styles.chipSelected,
                        ]}
                        onPress={() => setCategoria(cat.label)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={cat.icon}
                          size={16}
                          color={isSelected ? COLORS.textWhite : COLORS.textSecondary}
                        />
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextSelected,
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Campo Responsável */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Responsável Inicial (Opcional)</Text>
                <View style={styles.inputWrap}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Gabriel Giovanini ou Sala 04"
                    placeholderTextColor={COLORS.textMuted}
                    value={responsavel}
                    onChangeText={setResponsavel}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Campo Data de Cadastro */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Data de Cadastro</Text>
                <View style={styles.inputWrap}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor={COLORS.textMuted}
                    value={dataCadastro}
                    onChangeText={setDataCadastro}
                    keyboardType="numeric"
                    maxLength={10}
                    returnKeyType="done"
                  />
                </View>
              </View>

              {/* Status Inicial Aviso */}
              <View style={styles.statusNotice}>
                <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
                <Text style={styles.statusNoticeText}>
                  Novos equipamentos são registrados com status inicial <Text style={styles.boldText}>Disponível</Text>. Você poderá alterar para "Em uso" na tela de detalhes.
                </Text>
              </View>

              {/* Botão Salvar */}
              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.buttonDisabled]}
                onPress={handleSaveEquipment}
                activeOpacity={0.8}
                disabled={isSaving}
              >
                <Ionicons name="checkmark-circle-outline" size={22} color={COLORS.textWhite} />
                <Text style={styles.saveButtonText}>
                  {isSaving ? 'Salvando...' : 'Salvar Equipamento'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
  },
  keyboardAvoid: {
    flex: 1,
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
    borderColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textWhite,
    letterSpacing: 0.1,
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
    paddingBottom: SPACING.xxxl * 2,
  },

  // ── Card ──
  mainCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHero: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  heroIconWrap: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  cardHeroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardHeroSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  // ── Form Content ──
  formContent: {
    padding: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    letterSpacing: 0.2,
  },
  requiredAsterisk: {
    color: COLORS.error,
    fontWeight: '800',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  // ── Category Chips ──
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.textWhite,
  },

  // ── Notice Box ──
  statusNotice: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    alignItems: 'flex-start',
    marginBottom: SPACING.xxl,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.18)',
  },
  statusNoticeText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
    color: COLORS.primary,
  },

  // ── Save Button ──
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
