import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  headerBg: '#1E293B',
  bodyBg: '#F1F5F9',
  cardBg: '#FFFFFF',
  primary: '#4F46E5',
  success: '#16A34A',
  successBg: '#DCFCE7',
  textWhite: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
};

export default function ConfirmationScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const equipment = route.params?.equipment || {};

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Confirmação</Text>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={40} color={COLORS.success} />
          </View>

          <Text style={styles.title}>Cadastro realizado com sucesso!</Text>
          <Text style={styles.subtitle}>
            Cuidado com nosso aparelho, bom uso!
          </Text>

          {equipment.nome ? (
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Equipamento:</Text>
                <Text style={styles.summaryValue}>{equipment.nome}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Categoria:</Text>
                <Text style={styles.summaryValue}>
                  {equipment.categoria || 'Outros'}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Responsável:</Text>
                <Text style={styles.summaryValue}>
                  {equipment.responsavel || 'Não atribuído'}
                </Text>
              </View>

              {equipment.dataCadastro ? (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Data de cadastro:</Text>
                  <Text style={styles.summaryValue}>
                    {equipment.dataCadastro}
                  </Text>
                </View>
              ) : null}

              <View style={[styles.summaryRow, { marginBottom: 0 }]}>
                <Text style={styles.summaryLabel}>Status:</Text>
                <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                  {equipment.status || 'Disponível'}
                </Text>
              </View>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('EquipmentList')}
          >
            <Text style={styles.primaryButtonText}>Voltar para a lista</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.replace('EquipmentForm')}
          >
            <Text style={styles.secondaryButtonText}>Cadastrar outro</Text>
          </TouchableOpacity>
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
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: COLORS.headerBg,
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
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
