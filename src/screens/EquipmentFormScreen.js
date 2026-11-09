import React, { useState, useEffect } from 'react';
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
import { insertEquipment, updateEquipment } from '../database/database';

const COLORS = {
  headerBg: '#1E293B',
  bodyBg: '#F1F5F9',
  cardBg: '#FFFFFF',
  primary: '#4F46E5',
  error: '#DC2626',
  textWhite: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#CBD5E1',
};

const CATEGORIES = [
  'Notebook',
  'Projetor',
  'Tablet',
  'Monitor',
  'Câmera',
  'Outros',
];

const STATUS_OPTIONS = ['Disponível', 'Em uso'];

function formatDateInput(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

function isValidDateBR(dateStr) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return false;
  }
  const [dd, mm, yyyy] = dateStr.split('/').map(Number);
  if (yyyy < 2000 || yyyy > 2100 || mm < 1 || mm > 12 || dd < 1) {
    return false;
  }
  const daysInMonth = new Date(yyyy, mm, 0).getDate();
  return dd <= daysInMonth;
}

function showMessage(title, message, onConfirm) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.alert(`${title}\n\n${message}`);
    if (onConfirm) onConfirm();
    return;
  }
  Alert.alert(
    title,
    message,
    onConfirm ? [{ text: 'OK', onPress: onConfirm }] : [{ text: 'OK' }]
  );
}

export default function EquipmentFormScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const editingEquipment = route?.params?.equipment || null;
  const isEditing = Boolean(editingEquipment);

  const getTodayFormatted = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const [nome, setNome] = useState(editingEquipment?.nome || '');
  const [categoria, setCategoria] = useState(editingEquipment?.categoria || 'Notebook');
  const [responsavel, setResponsavel] = useState(
    editingEquipment?.responsavel === 'Não atribuído'
      ? ''
      : editingEquipment?.responsavel || ''
  );
  const [dataCadastro, setDataCadastro] = useState(
    editingEquipment?.dataCadastro || getTodayFormatted()
  );
  const [status, setStatus] = useState(editingEquipment?.status || 'Disponível');
  const [dataEmprestimo, setDataEmprestimo] = useState(
    editingEquipment?.dataEmprestimo || ''
  );
  const [dataDevolucao, setDataDevolucao] = useState(
    editingEquipment?.dataDevolucao || ''
  );
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingEquipment) {
      setNome(editingEquipment.nome || '');
      setCategoria(editingEquipment.categoria || 'Notebook');
      setResponsavel(
        editingEquipment.responsavel === 'Não atribuído'
          ? ''
          : editingEquipment.responsavel || ''
      );
      setDataCadastro(editingEquipment.dataCadastro || getTodayFormatted());
      setStatus(editingEquipment.status || 'Disponível');
      setDataEmprestimo(editingEquipment.dataEmprestimo || '');
      setDataDevolucao(editingEquipment.dataDevolucao || '');
      setErrors({});
    }
  }, [editingEquipment]);

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedNome = nome.trim();
    const trimmedResponsavel = responsavel.trim();
    const trimmedDataCadastro = dataCadastro.trim();
    const trimmedDataEmprestimo = dataEmprestimo.trim();
    const trimmedDataDevolucao = dataDevolucao.trim();

    if (!trimmedNome) {
      newErrors.nome = 'Informe o nome do equipamento.';
    } else if (trimmedNome.length < 3) {
      newErrors.nome = 'O nome deve ter pelo menos 3 caracteres.';
    }

    if (!categoria) {
      newErrors.categoria = 'Selecione uma categoria.';
    }

    if (isEditing && status === 'Em uso' && !trimmedResponsavel) {
      newErrors.responsavel = 'Informe o responsável pelo equipamento em uso.';
    } else if (trimmedResponsavel && trimmedResponsavel.length < 2) {
      newErrors.responsavel = 'Informe um nome válido para o responsável.';
    }

    if (!trimmedDataCadastro) {
      newErrors.dataCadastro = 'Informe a data de cadastro.';
    } else if (!isValidDateBR(trimmedDataCadastro)) {
      newErrors.dataCadastro = 'Data inválida (use DD/MM/AAAA).';
    }

    if (isEditing && status === 'Em uso') {
      if (trimmedDataEmprestimo && !isValidDateBR(trimmedDataEmprestimo)) {
        newErrors.dataEmprestimo = 'Data inválida (use DD/MM/AAAA).';
      }
      if (trimmedDataDevolucao && !isValidDateBR(trimmedDataDevolucao)) {
        newErrors.dataDevolucao = 'Data inválida (use DD/MM/AAAA).';
      }
    }

    setErrors(newErrors);

    const errorMessages = Object.values(newErrors).filter(Boolean);
    if (errorMessages.length > 0) {
      showMessage('Atenção', errorMessages[0]);
      return false;
    }

    return true;
  };

  const handleStatusSelect = (selectedStatus) => {
    setStatus(selectedStatus);
    clearFieldError('responsavel');
    if (selectedStatus === 'Em uso' && !dataEmprestimo) {
      setDataEmprestimo(getTodayFormatted());
    }
  };

  const handleSaveEquipment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    const isEmUso = isEditing && status === 'Em uso';
    const today = getTodayFormatted();

    const payload = {
      nome: nome.trim(),
      categoria: categoria.trim() || 'Outros',
      responsavel: responsavel.trim() || 'Não atribuído',
      dataCadastro: dataCadastro.trim() || today,
      status: isEditing ? status : 'Disponível',
      dataEmprestimo: isEditing
        ? isEmUso
          ? dataEmprestimo.trim() || today
          : null
        : null,
      dataDevolucao: isEditing
        ? isEmUso
          ? dataDevolucao.trim() || null
          : editingEquipment?.status === 'Em uso'
          ? today
          : editingEquipment?.dataDevolucao || null
        : null,
    };

    try {
      if (isEditing) {
        await updateEquipment(editingEquipment.id, payload);
        showMessage('Sucesso', 'Equipamento atualizado com sucesso!', () =>
          navigation.goBack()
        );
      } else {
        const createdEquipment = await insertEquipment(payload);
        navigation.replace('Confirmation', { equipment: createdEquipment });
      }
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error);
      showMessage(
        'Erro',
        error.message || 'Não foi possível salvar o equipamento.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Equipamento' : 'Novo Equipamento'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do equipamento *</Text>
              <TextInput
                style={[styles.input, errors.nome && styles.inputError]}
                placeholder="Ex: Notebook Dell"
                placeholderTextColor={COLORS.textMuted}
                value={nome}
                onChangeText={(text) => {
                  setNome(text);
                  clearFieldError('nome');
                }}
              />
              {errors.nome ? (
                <Text style={styles.errorText}>{errors.nome}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoria *</Text>
              <View style={styles.chipsContainer}>
                {CATEGORIES.map((cat) => {
                  const isSelected = categoria === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => {
                        setCategoria(cat);
                        clearFieldError('categoria');
                      }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.categoria ? (
                <Text style={styles.errorText}>{errors.categoria}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Responsável {isEditing && status === 'Em uso' ? '*' : '(opcional)'}
              </Text>
              <TextInput
                style={[styles.input, errors.responsavel && styles.inputError]}
                placeholder="Nome do responsável ou setor"
                placeholderTextColor={COLORS.textMuted}
                value={responsavel}
                onChangeText={(text) => {
                  setResponsavel(text);
                  clearFieldError('responsavel');
                }}
              />
              {errors.responsavel ? (
                <Text style={styles.errorText}>{errors.responsavel}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de cadastro *</Text>
              <TextInput
                style={[styles.input, errors.dataCadastro && styles.inputError]}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={COLORS.textMuted}
                value={dataCadastro}
                onChangeText={(text) => {
                  setDataCadastro(formatDateInput(text));
                  clearFieldError('dataCadastro');
                }}
                keyboardType="numeric"
                maxLength={10}
              />
              {errors.dataCadastro ? (
                <Text style={styles.errorText}>{errors.dataCadastro}</Text>
              ) : null}
            </View>

            {isEditing && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Status</Text>
                  <View style={styles.chipsContainer}>
                    {STATUS_OPTIONS.map((opt) => {
                      const isSelected = status === opt;
                      return (
                        <TouchableOpacity
                          key={opt}
                          style={[styles.chip, isSelected && styles.chipSelected]}
                          onPress={() => handleStatusSelect(opt)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextSelected,
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {status === 'Em uso' && (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Data de retirada</Text>
                      <TextInput
                        style={[
                          styles.input,
                          errors.dataEmprestimo && styles.inputError,
                        ]}
                        placeholder="DD/MM/AAAA"
                        placeholderTextColor={COLORS.textMuted}
                        value={dataEmprestimo}
                        onChangeText={(text) => {
                          setDataEmprestimo(formatDateInput(text));
                          clearFieldError('dataEmprestimo');
                        }}
                        keyboardType="numeric"
                        maxLength={10}
                      />
                      {errors.dataEmprestimo ? (
                        <Text style={styles.errorText}>
                          {errors.dataEmprestimo}
                        </Text>
                      ) : null}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Data de devolução prevista</Text>
                      <TextInput
                        style={[
                          styles.input,
                          errors.dataDevolucao && styles.inputError,
                        ]}
                        placeholder="DD/MM/AAAA"
                        placeholderTextColor={COLORS.textMuted}
                        value={dataDevolucao}
                        onChangeText={(text) => {
                          setDataDevolucao(formatDateInput(text));
                          clearFieldError('dataDevolucao');
                        }}
                        keyboardType="numeric"
                        maxLength={10}
                      />
                      {errors.dataDevolucao ? (
                        <Text style={styles.errorText}>
                          {errors.dataDevolucao}
                        </Text>
                      ) : null}
                    </View>
                  </>
                )}
              </>
            )}

            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.buttonDisabled]}
              onPress={handleSaveEquipment}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving
                  ? 'Salvando...'
                  : isEditing
                  ? 'Salvar alterações'
                  : 'Cadastrar'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.headerBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.headerBg,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.bodyBg,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.error,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
