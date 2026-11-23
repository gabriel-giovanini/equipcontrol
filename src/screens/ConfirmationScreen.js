import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, FONTS, RADIUS, TABULAR, getPalette } from '../theme/theme';
import Backdrop, { Grain, RadialFill } from '../ui/Backdrop';
import { TopBar } from '../ui/Shell';
import { FieldLabel, Heading, Kicker } from '../ui/Typography';
import { GlassButton, PrimaryButton } from '../ui/Buttons';
import FloatingIllustration, { useTilt } from '../ui/Illustration';
import StatusDot from '../ui/StatusDot';
import { FadeUp } from '../ui/motion';

export default function ConfirmationScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const equipment = route.params?.equipment || {};
  const palette = getPalette(equipment.categoria);
  const tilt = useTilt(8);
  const isNarrow = width < 520;

  const rows = [
    { label: 'Equipamento', value: equipment.nome },
    { label: 'Categoria', value: equipment.categoria || 'Outros' },
    { label: 'Responsável', value: equipment.responsavel || 'Não atribuído' },
    equipment.dataCadastro
      ? { label: 'Data de cadastro', value: equipment.dataCadastro, numeric: true }
      : null,
  ].filter(Boolean);

  return (
    <Backdrop glowColor={palette.accent} style={{ paddingTop: insets.top }}>
      <StatusBar style="light" />

      <TopBar title="Confirmação" subtitle="Cadastro concluído" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: isNarrow ? 16 : 24 }]}
      >
        <FadeUp index={0} style={styles.hero}>
          <View style={styles.kickerRow}>
            <Ionicons name="checkmark-circle" size={18} color="#4ADE80" />
            <Kicker>Tudo certo</Kicker>
          </View>
          <Heading
            line1="Cadastro realizado"
            line2="com sucesso!"
            scale={0.82}
            style={{ marginTop: 14 }}
          />
          <Text style={styles.subtitle}>Cuidado com nosso aparelho, bom uso!</Text>
        </FadeUp>

        <FadeUp index={1}>
          <View style={styles.visual} {...tilt.handlers}>
            <RadialFill c1={palette.c1} c2={palette.c2} c3={palette.c3} />
            <Grain opacity={0.08} />
            <FloatingIllustration
              categoria={equipment.categoria}
              size={isNarrow ? 160 : 200}
              tiltTransform={tilt.transform}
            />
          </View>
        </FadeUp>

        {equipment.nome ? (
          <FadeUp index={2} style={styles.summaryBox}>
            {rows.map((row) => (
              <View key={row.label} style={styles.summaryRow}>
                <FieldLabel>{row.label}</FieldLabel>
                <Text
                  style={[styles.summaryValue, row.numeric && TABULAR]}
                  numberOfLines={2}
                >
                  {row.value}
                </Text>
              </View>
            ))}
            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
              <FieldLabel>Status</FieldLabel>
              <StatusDot status={equipment.status || 'Disponível'} color={COLORS.white} />
            </View>
          </FadeUp>
        ) : null}

        <FadeUp index={3} style={styles.actions}>
          <PrimaryButton
            label="Voltar para a lista"
            onPress={() => navigation.navigate('EquipmentList')}
          />
          <GlassButton
            label="Cadastrar outro"
            icon="add"
            onPress={() => navigation.replace('EquipmentForm')}
          />
        </FadeUp>
      </ScrollView>
    </Backdrop>
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
    paddingBottom: 26,
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    fontFamily: FONTS.body400,
    fontSize: 15,
    color: COLORS.text50,
    marginTop: 14,
  },
  visual: {
    minHeight: 280,
    borderRadius: RADIUS.panel,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c1917',
    marginBottom: 14,
  },
  summaryBox: {
    backgroundColor: COLORS.panel,
    borderRadius: RADIUS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginBottom: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontFamily: FONTS.body500,
    fontSize: 15,
    color: COLORS.white,
  },
  actions: {
    gap: 10,
  },
});
