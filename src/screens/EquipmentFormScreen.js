import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Image,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { insertEquipment, updateEquipment } from '../database/database';
import { COLORS, FONTS, RADIUS, TABULAR, getPalette } from '../theme/theme';
import Backdrop from '../ui/Backdrop';
import { TopBar } from '../ui/Shell';
import { FieldLabel, Heading, Kicker } from '../ui/Typography';
import { GlassButton, PrimaryButton } from '../ui/Buttons';
import { FadeUp } from '../ui/motion';

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
  const [fotoUri, setFotoUri] = useState(editingEquipment?.foto || null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        showMessage(
          'Permissão necessária',
          'É necessário conceder permissão de acesso à galeria de fotos para anexar a imagem do equipamento.'
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
        setFotoUri(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
      showMessage('Erro', 'Não foi possível selecionar a imagem do equipamento.');
    }
  };

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
      foto: fotoUri || null,
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

  const { width } = useWindowDimensions();
  const isNarrow = width < 520;

  return (
    <Backdrop glowColor={getPalette(categoria).accent} style={{ paddingTop: insets.top }}>
      <StatusBar style="light" />

      <TopBar
        title={isEditing ? 'Editar Equipamento' : 'Novo Equipamento'}
        subtitle={isEditing ? editingEquipment.nome : 'Preencha os dados abaixo'}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: isNarrow ? 16 : 24 }]}
          keyboardShouldPersistTaps="handled"
        >
          <FadeUp index={0} style={styles.hero}>
            <Kicker>{isEditing ? 'Edição' : 'Cadastro'}</Kicker>
            <Heading
              line1={isEditing ? 'Atualizar' : 'Registrar novo'}
              line2="equipamento."
              scale={0.82}
              style={{ marginTop: 14 }}
            />
          </FadeUp>

          <FadeUp index={1} style={styles.card}>
            <View style={styles.inputGroup}>
              <FieldLabel>Nome do equipamento *</FieldLabel>
              <GlassInput
                hasError={Boolean(errors.nome)}
                placeholder="Ex: Notebook Dell"
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
              <FieldLabel>Categoria *</FieldLabel>
              <View style={styles.chipsContainer}>
                {CATEGORIES.map((cat) => (
                  <Choice
                    key={cat}
                    label={cat}
                    selected={categoria === cat}
                    onPress={() => {
                      setCategoria(cat);
                      clearFieldError('categoria');
                    }}
                  />
                ))}
              </View>
              {errors.categoria ? (
                <Text style={styles.errorText}>{errors.categoria}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <FieldLabel>
                Responsável {isEditing && status === 'Em uso' ? '*' : '(opcional)'}
              </FieldLabel>
              <GlassInput
                hasError={Boolean(errors.responsavel)}
                placeholder="Nome do responsável ou setor"
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
              <FieldLabel>Data de cadastro *</FieldLabel>
              <GlassInput
                hasError={Boolean(errors.dataCadastro)}
                numeric
                placeholder="DD/MM/AAAA"
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
                  <FieldLabel>Status</FieldLabel>
                  <View style={styles.chipsContainer}>
                    {STATUS_OPTIONS.map((opt) => (
                      <Choice
                        key={opt}
                        label={opt}
                        selected={status === opt}
                        onPress={() => handleStatusSelect(opt)}
                      />
                    ))}
                  </View>
                </View>

                {status === 'Em uso' && (
                  <View style={[styles.dateRow, isNarrow && { flexDirection: 'column', gap: 0 }]}>
                    <View style={[styles.inputGroup, styles.dateCol]}>
                      <FieldLabel>Data de retirada</FieldLabel>
                      <GlassInput
                        hasError={Boolean(errors.dataEmprestimo)}
                        numeric
                        placeholder="DD/MM/AAAA"
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

                    <View style={[styles.inputGroup, styles.dateCol]}>
                      <FieldLabel>Data de devolução prevista</FieldLabel>
                      <GlassInput
                        hasError={Boolean(errors.dataDevolucao)}
                        numeric
                        placeholder="DD/MM/AAAA"
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
                  </View>
                )}
              </>
            )}

            <View style={styles.inputGroup}>
              <FieldLabel>Foto do Equipamento (Recurso Nativo)</FieldLabel>
              <Pressable
                onPress={handlePickImage}
                accessibilityRole="button"
                accessibilityLabel={fotoUri ? 'Alterar foto' : 'Tirar ou escolher foto da galeria'}
              >
                {({ hovered }) =>
                  fotoUri ? (
                    <View style={styles.imagePreviewContainer}>
                      <Image source={{ uri: fotoUri }} style={styles.imagePreview} />
                      <View style={styles.changeImageBadge}>
                        <Ionicons name="camera" size={14} color={COLORS.ink} />
                        <Text style={styles.changeImageText}>Alterar foto</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={[styles.pickImagePlaceholder, hovered && styles.pickImageHover]}>
                      <View style={styles.pickIcon}>
                        <Ionicons name="camera-outline" size={22} color={COLORS.white} />
                      </View>
                      <Text style={styles.pickImageText}>Tirar ou escolher foto da galeria</Text>
                      <Text style={styles.pickImageSubtext}>(Recurso nativo expo-image-picker)</Text>
                    </View>
                  )
                }
              </Pressable>
              {fotoUri ? (
                <GlassButton
                  label="Remover foto"
                  icon="trash-outline"
                  tone="danger"
                  onPress={() => setFotoUri(null)}
                  style={{ alignSelf: 'flex-start' }}
                />
              ) : null}
            </View>

            <PrimaryButton
              label={
                isSaving
                  ? 'Salvando...'
                  : isEditing
                  ? 'Salvar alterações'
                  : 'Cadastrar'
              }
              onPress={handleSaveEquipment}
              disabled={isSaving}
              style={{ marginTop: 4 }}
            />
          </FadeUp>
        </ScrollView>
      </KeyboardAvoidingView>
    </Backdrop>
  );
}

// Campo de texto em vidro; a borda acende no foco
function GlassInput({ hasError, numeric, style, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      {...props}
      placeholderTextColor={COLORS.text30}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        styles.input,
        numeric && TABULAR,
        focused && styles.inputFocused,
        hasError && styles.inputError,
        style,
      ]}
    />
  );
}

// Opção selecionável (categoria/status): a selecionada fica branca
function Choice({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {({ hovered }) => (
        <View
          style={[
            styles.chip,
            hovered && !selected && styles.chipHover,
            selected && styles.chipSelected,
          ]}
        >
          <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingBottom: 48,
  },
  hero: {
    paddingTop: 8,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: COLORS.panel,
    borderRadius: RADIUS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
  },
  inputGroup: {
    marginBottom: 22,
    gap: 10,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.control,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: FONTS.body400,
    fontSize: 15,
    color: COLORS.white,
    outlineStyle: 'none',
  },
  inputFocused: {
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    fontFamily: FONTS.body500,
    color: COLORS.danger,
    fontSize: 13,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  chipHover: {
    borderColor: COLORS.borderStrong,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  chipSelected: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },
  chipText: {
    fontFamily: FONTS.display700,
    fontSize: 13,
    color: COLORS.text70,
  },
  chipTextSelected: {
    color: COLORS.ink,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 14,
  },
  dateCol: {
    flex: 1,
  },
  pickImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderRadius: RADIUS.panel,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
  pickImageHover: {
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  pickIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 12,
  },
  pickImageText: {
    fontFamily: FONTS.display700,
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
  },
  pickImageSubtext: {
    fontFamily: FONTS.body400,
    fontSize: 12,
    color: COLORS.text50,
    marginTop: 4,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    width: '100%',
    height: 200,
    borderRadius: RADIUS.panel,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeImageBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  changeImageText: {
    fontFamily: FONTS.display700,
    fontSize: 12,
    color: COLORS.ink,
  },
});
