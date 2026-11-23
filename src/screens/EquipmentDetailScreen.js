import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  Image,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  getEquipmentById,
  updateEquipmentStatus,
  deleteEquipment,
} from '../database/database';
import { COLORS, FONTS, RADIUS, TABULAR, WIDE_BREAKPOINT, getPalette } from '../theme/theme';
import Backdrop, { Grain, RadialFill } from '../ui/Backdrop';
import { TopBar } from '../ui/Shell';
import { FieldLabel, Heading, Kicker } from '../ui/Typography';
import { GlassButton, PrimaryButton } from '../ui/Buttons';
import FloatingIllustration, { useTilt } from '../ui/Illustration';
import StatusDot from '../ui/StatusDot';
import { FadeUp } from '../ui/motion';

// Consulta SQL direta para detalhe (SELECT ... WHERE id = ?)
const SQL_DETAIL_QUERY = 'SELECT * FROM equipments WHERE id = ?';

function getTodayFormatted() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
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

export default function EquipmentDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { equipment: initialEquipment } = route.params;
  const [equipment, setEquipment] = useState(initialEquipment);
  const [isUpdating, setIsUpdating] = useState(false);
  const tilt = useTilt(8);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      async function refreshEquipment() {
        try {
          if (initialEquipment?.id) {
            const freshData = await getEquipmentById(initialEquipment.id);
            if (!isMounted) return;
            if (freshData) {
              setEquipment(freshData);
            } else {
              navigation.goBack();
            }
          }
        } catch (error) {
          console.error('Erro ao buscar equipamento:', error);
        }
      }
      refreshEquipment();
      return () => {
        isMounted = false;
      };
    }, [initialEquipment?.id, navigation])
  );

  const isAvailable = equipment.status === 'Disponível';

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    const newStatus = isAvailable ? 'Em uso' : 'Disponível';
    const isNowInUse = newStatus === 'Em uso';
    const today = getTodayFormatted();

    const newDataEmprestimo = isNowInUse ? (equipment.dataEmprestimo || today) : null;
    const newDataDevolucao = isNowInUse ? null : today;

    try {
      const updated = await updateEquipmentStatus(
        equipment.id,
        newStatus,
        newDataEmprestimo,
        newDataDevolucao
      );
      if (updated) {
        setEquipment(updated);
      }

      showMessage(
        'Status atualizado',
        `O equipamento agora está "${newStatus}".`,
        () => navigation.goBack()
      );
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      showMessage('Erro', error.message || 'Não foi possível atualizar o status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditEquipment = () => {
    navigation.navigate('EquipmentForm', { equipment });
  };

  const confirmAndDelete = async () => {
    setIsUpdating(true);
    try {
      await deleteEquipment(equipment.id);
      showMessage(
        'Excluído',
        'Equipamento excluído com sucesso.',
        () => navigation.goBack()
      );
    } catch (error) {
      console.error('Erro ao excluir equipamento:', error);
      showMessage('Erro', error.message || 'Não foi possível excluir o equipamento.');
      setIsUpdating(false);
    }
  };

  const handleDeleteEquipment = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const confirmed = window.confirm(
        `Deseja realmente excluir "${equipment.nome}"?`
      );
      if (confirmed) {
        confirmAndDelete();
      }
      return;
    }

    Alert.alert(
      'Excluir equipamento',
      `Deseja realmente excluir "${equipment.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: confirmAndDelete,
        },
      ]
    );
  };

  const isWide = width >= WIDE_BREAKPOINT;
  const isNarrow = width < 520;
  const palette = getPalette(equipment.categoria);

  const infoRows = [
    { label: 'Categoria', value: equipment.categoria || 'Geral' },
    { label: 'Responsável', value: equipment.responsavel || 'Não atribuído' },
    { label: 'Data de cadastro', value: equipment.dataCadastro || '-', numeric: true },
    { label: 'Data de retirada', value: equipment.dataEmprestimo || '-', numeric: true },
    { label: 'Data de devolução', value: equipment.dataDevolucao || '-', numeric: true },
  ];

  return (
    <Backdrop glowColor={palette.accent} style={{ paddingTop: insets.top }}>
      <StatusBar style="light" />

      <TopBar
        title="Detalhes do Equipamento"
        subtitle={equipment.categoria || 'Geral'}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: isNarrow ? 16 : 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <FadeUp index={0} style={styles.hero}>
          <Kicker>Ficha do equipamento</Kicker>
          <Heading
            line1={equipment.nome}
            line2={equipment.categoria || 'Geral'}
            scale={0.82}
            style={{ marginTop: 14 }}
          />
          <StatusDot status={equipment.status} style={{ marginTop: 16 }} />
        </FadeUp>

        <View style={[styles.columns, isWide && styles.columnsWide]}>
          <FadeUp index={1} style={isWide ? { flex: 1.1 } : null}>
            <View
              style={[
                styles.visual,
                equipment.foto ? { height: isNarrow ? 260 : 340 } : { minHeight: 340 },
              ]}
              {...tilt.handlers}
            >
              {equipment.foto ? (
                <>
                  <Image
                    source={{ uri: equipment.foto }}
                    style={styles.equipmentImage}
                    resizeMode="cover"
                  />
                  <Grain opacity={0.06} />
                </>
              ) : (
                <>
                  <RadialFill c1={palette.c1} c2={palette.c2} c3={palette.c3} />
                  <Grain opacity={0.08} />
                  <FloatingIllustration
                    categoria={equipment.categoria}
                    size={isNarrow ? 180 : 230}
                    tiltTransform={tilt.transform}
                  />
                </>
              )}
            </View>
          </FadeUp>

          <View style={[styles.side, isWide && { flex: 1 }]}>
            <FadeUp index={2} style={styles.card}>
              {infoRows.map((row, i) => (
                <View
                  key={row.label}
                  style={[styles.infoRow, i === infoRows.length - 1 && { borderBottomWidth: 0 }]}
                >
                  <FieldLabel>{row.label}</FieldLabel>
                  <Text
                    style={[styles.infoValue, row.numeric && TABULAR]}
                    numberOfLines={2}
                  >
                    {row.value}
                  </Text>
                </View>
              ))}
            </FadeUp>

            <FadeUp index={3} style={styles.actionsContainer}>
              <PrimaryButton
                label={isAvailable ? 'Marcar como Em uso' : 'Registrar devolução'}
                onPress={handleToggleStatus}
                disabled={isUpdating}
              />
              <View style={styles.rowButtons}>
                <GlassButton
                  label="Editar"
                  icon="create-outline"
                  onPress={handleEditEquipment}
                  disabled={isUpdating}
                  style={{ flex: 1 }}
                />
                <GlassButton
                  label="Excluir"
                  icon="trash-outline"
                  tone="danger"
                  onPress={handleDeleteEquipment}
                  disabled={isUpdating}
                  style={{ flex: 1 }}
                />
              </View>
            </FadeUp>
          </View>
        </View>
      </ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    paddingBottom: 48,
  },
  hero: {
    paddingTop: 8,
    paddingBottom: 28,
  },
  columns: {
    gap: 14,
  },
  columnsWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  visual: {
    width: '100%',
    borderRadius: RADIUS.panel,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c1917',
  },
  equipmentImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  side: {
    gap: 14,
  },
  card: {
    backgroundColor: COLORS.panel,
    borderRadius: RADIUS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontFamily: FONTS.body500,
    fontSize: 15,
    color: COLORS.white,
  },
  actionsContainer: {
    gap: 10,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 10,
  },
});
