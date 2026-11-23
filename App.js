import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  Montserrat_500Medium,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
} from '@expo-google-fonts/montserrat';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';

import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/database/database';
import Shell from './src/ui/Shell';
import { Grain } from './src/ui/Backdrop';
import { COLORS } from './src/theme/theme';

const navigationRef = createNavigationContainerRef();

const NAV_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.bg,
    card: COLORS.bg,
    border: COLORS.border,
  },
};

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [fontsLoaded, fontError] = useFonts({
    Montserrat_500Medium,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  const fontsReady = fontsLoaded || Boolean(fontError);

  const setupDatabase = useCallback(async () => {
    setDbError(null);
    try {
      await initDatabase();
      setDbInitialized(true);
    } catch (error) {
      console.error('Erro ao inicializar o banco SQLite:', error);
      setDbError(
        error.message || 'Falha ao inicializar o banco de dados local.'
      );
    }
  }, []);

  useEffect(() => {
    setupDatabase();
  }, [setupDatabase]);

  if (dbError) {
    return (
      <View style={styles.centerContainer}>
        <Grain />
        <Text style={styles.errorTitle}>Erro no Banco de Dados</Text>
        <Text style={styles.errorText}>{dbError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={setupDatabase}
          activeOpacity={0.8}
        >
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!dbInitialized || !fontsReady) {
    return (
      <View style={styles.centerContainer}>
        <Grain />
        <ActivityIndicator size="large" color={COLORS.white} />
        <Text style={styles.loadingText}>Inicializando banco de dados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        theme={NAV_THEME}
        onReady={() => setCurrentRoute(navigationRef.getCurrentRoute())}
        onStateChange={() => setCurrentRoute(navigationRef.getCurrentRoute())}
      >
        <Shell navigationRef={navigationRef} currentRoute={currentRoute}>
          <AppNavigator />
        </Shell>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: COLORS.text50,
    fontWeight: '700',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: COLORS.text50,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
  },
  retryButtonText: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: '700',
  },
});
