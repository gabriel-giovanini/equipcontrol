import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  getEquipmentById,
  updateEquipmentStatus,
  deleteEquipment,
} from '../database/database';

const COLORS = {
  headerBg: '#1E293B',
  bodyBg: '#F1F5F9',
  cardBg: '#FFFFFF',
  primary: '#4F46E5',
  primaryBg: '#EEF2FF',
  success: '#16A34A',
  successBg: '#DCFCE7',
  warning: '#D97706',
  warningBg: '#FEF3C7',
  error: '#DC2626',
  errorBg: '#FEE2E2',
  textWhite: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
};

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
  const { equipment: initialEquipment } = route.params;
  const [equipment, setEquipment] = useState(initialEquipment);
  const [isUpdating, setIsUpdating] = useState(false);

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
        <Text style={styles.headerTitle}>Detalhes do Equipamento</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.equipmentName}>{equipment.nome}</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isAvailable
                    ? COLORS.successBg
                    : COLORS.warningBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isAvailable ? COLORS.success : COLORS.warning },
                ]}
              >
                {equipment.status}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Categoria</Text>
            <Text style={styles.infoValue}>{equipment.categoria || 'Geral'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Responsável</Text>
            <Text style={styles.infoValue}>
              {equipment.responsavel || 'Não atribuído'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data de cadastro</Text>
            <Text style={styles.infoValue}>{equipment.dataCadastro || '-'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data de retirada</Text>
            <Text style={styles.infoValue}>{equipment.dataEmprestimo || '-'}</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Data de devolução</Text>
            <Text style={styles.infoValue}>{equipment.dataDevolucao || '-'}</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: isAvailable ? COLORS.warning : COLORS.success },
              isUpdating && styles.disabledButton,
            ]}
            onPress={handleToggleStatus}
            disabled={isUpdating}
          >
            <Ionicons
              name={isAvailable ? 'swap-horizontal-outline' : 'checkmark-circle-outline'}
              size={20}
              color={COLORS.textWhite}
            />
            <Text style={styles.statusButtonText}>
              {isAvailable ? 'Marcar como Em uso' : 'Registrar devolução'}
            </Text>
          </TouchableOpacity>

          <View style={styles.rowButtons}>
            <TouchableOpacity
              style={[styles.editButton, isUpdating && styles.disabledButton]}
              onPress={handleEditEquipment}
              disabled={isUpdating}
            >
              <Ionicons name="create-outline" size={18} color={COLORS.primary} />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteButton, isUpdating && styles.disabledButton]}
              onPress={handleDeleteEquipment}
              disabled={isUpdating}
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.error} />
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  equipmentName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  actionsContainer: {
    gap: 10,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  statusButtonText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: 'bold',
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: 6,
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.error,
    gap: 6,
  },
  deleteButtonText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
