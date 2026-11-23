import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackActions } from '@react-navigation/native';
import { COLORS, FONTS, NATIVE_DRIVER, RADIUS, WIDE_BREAKPOINT } from '../theme/theme';
import { IconButton } from './Buttons';
import { Grain } from './Backdrop';

const ShellContext = createContext({ isWide: false, openDrawer: () => {} });
export const useShell = () => useContext(ShellContext);

const NAV_ITEMS = [
  { key: 'EquipmentList', label: 'Equipamentos', icon: 'grid-outline' },
  { key: 'EquipmentForm', label: 'Novo equipamento', icon: 'add-circle-outline' },
];

// Qual item do menu representa a rota atual (só visual)
function activeKeyFor(route) {
  if (!route) return 'EquipmentList';
  if (route.name === 'EquipmentForm' && !route.params?.equipment) {
    return 'EquipmentForm';
  }
  return 'EquipmentList';
}

function Logo() {
  return (
    <View style={styles.logoRow}>
      <View style={styles.logoMark}>
        <View style={styles.logoMarkInner} />
      </View>
      <Text style={styles.logoText}>EquipControl</Text>
    </View>
  );
}

function SidebarContent({ activeKey, onNavigate }) {
  const [positions, setPositions] = useState({});
  const pillY = useRef(new Animated.Value(0)).current;
  const pillOpacity = useRef(new Animated.Value(0)).current;
  const placed = useRef(false);

  useEffect(() => {
    const pos = positions[activeKey];
    if (pos == null) return;
    if (!placed.current) {
      pillY.setValue(pos);
      pillOpacity.setValue(1);
      placed.current = true;
      return;
    }
    // Pílula branca desliza com mola (elástica) até o item ativo
    Animated.spring(pillY, {
      toValue: pos,
      speed: 9,
      bounciness: 14,
      useNativeDriver: NATIVE_DRIVER,
    }).start();
  }, [activeKey, positions, pillY, pillOpacity]);

  return (
    <View style={styles.sidebarInner}>
      <Logo />

      <Text style={styles.navKicker}>Menu</Text>
      <View style={styles.nav}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pill,
            { opacity: pillOpacity, transform: [{ translateY: pillY }] },
          ]}
        />
        {NAV_ITEMS.map((item) => {
          const active = item.key === activeKey;
          return (
            <Pressable
              key={item.key}
              onLayout={(e) => {
                const { y } = e.nativeEvent.layout;
                setPositions((p) => (p[item.key] === y ? p : { ...p, [item.key]: y }));
              }}
              onPress={() => onNavigate(item.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={styles.navItem}
            >
              {({ hovered }) => (
                <>
                  <Ionicons
                    name={item.icon}
                    size={19}
                    color={active ? COLORS.ink : hovered ? COLORS.white : COLORS.text50}
                  />
                  <Text
                    style={[
                      styles.navText,
                      { color: active ? COLORS.ink : hovered ? COLORS.white : COLORS.text70 },
                    ]}
                  >
                    {item.label}
                  </Text>
                </>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={{ flex: 1 }} />

      <View style={styles.footerCard}>
        <View style={styles.footerAvatar}>
          <Ionicons name="server-outline" size={18} color={COLORS.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.footerTitle}>Banco local</Text>
          <View style={styles.footerStatus}>
            <View style={styles.footerDot} />
            <Text style={styles.footerSub}>SQLite conectado</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Gaveta do celular: entra com mola, fecha com Esc ou clique fora
function Drawer({ open, onClose, children }) {
  const progress = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) setMounted(true);
    Animated.spring(progress, {
      toValue: open ? 1 : 0,
      speed: open ? 14 : 22,
      bounciness: open ? 8 : 0,
      useNativeDriver: NATIVE_DRIVER,
    }).start(({ finished }) => {
      if (finished && !open) setMounted(false);
    });
  }, [open, progress]);

  useEffect(() => {
    if (!open || Platform.OS !== 'web' || typeof window === 'undefined') return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={open ? 'auto' : 'none'}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, { opacity: progress }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Fechar menu"
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-300, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Grain opacity={0.06} />
        {children}
      </Animated.View>
    </View>
  );
}

export default function Shell({ navigationRef, currentRoute, children }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isWide = width >= WIDE_BREAKPOINT;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeKey = activeKeyFor(currentRoute);

  useEffect(() => {
    if (isWide) setDrawerOpen(false);
  }, [isWide]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Só leva às rotas que já existem
  const handleNavigate = useCallback(
    (key) => {
      setDrawerOpen(false);
      if (!navigationRef.isReady()) return;
      const route = navigationRef.getCurrentRoute();
      if (key === 'EquipmentList') {
        navigationRef.navigate('EquipmentList');
      } else if (key === 'EquipmentForm') {
        if (route?.name === 'EquipmentForm' && !route.params?.equipment) return;
        navigationRef.dispatch(StackActions.push('EquipmentForm'));
      }
    },
    [navigationRef]
  );

  return (
    <ShellContext.Provider value={{ isWide, openDrawer }}>
      <View style={styles.root}>
        {isWide ? (
          <View style={[styles.sidebar, { paddingTop: insets.top }]}>
            <Grain opacity={0.05} />
            <SidebarContent activeKey={activeKey} onNavigate={handleNavigate} />
          </View>
        ) : null}
        <View style={styles.content}>{children}</View>
        {!isWide ? (
          <Drawer open={drawerOpen} onClose={closeDrawer}>
            <View style={{ flex: 1, paddingTop: insets.top }}>
              <SidebarContent activeKey={activeKey} onNavigate={handleNavigate} />
            </View>
          </Drawer>
        ) : null}
      </View>
    </ShellContext.Provider>
  );
}

// Topo: título + subtítulo à esquerda, ações à direita
export function TopBar({ title, subtitle, onBack, right }) {
  const { isWide, openDrawer } = useShell();
  return (
    <View style={styles.topBar}>
      {onBack ? (
        <IconButton icon="arrow-back" onPress={onBack} accessibilityLabel="Voltar" />
      ) : !isWide ? (
        <IconButton icon="menu" onPress={openDrawer} accessibilityLabel="Abrir menu" />
      ) : null}
      <View style={styles.topBarText}>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.topBarSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  sidebar: {
    width: 260,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    backgroundColor: 'rgba(255,255,255,0.015)',
  },
  sidebarInner: {
    flex: 1,
    padding: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 6,
    paddingVertical: 8,
    marginBottom: 28,
  },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  logoMarkInner: {
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: COLORS.ink,
  },
  logoText: {
    fontFamily: FONTS.display900,
    fontSize: 19,
    color: COLORS.white,
    letterSpacing: -0.4,
  },
  navKicker: {
    fontFamily: FONTS.display700,
    fontSize: 11,
    letterSpacing: 2.75,
    textTransform: 'uppercase',
    color: COLORS.text30,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  nav: {
    gap: 4,
  },
  pill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 46,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.white,
  },
  navItem: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.pill,
  },
  navText: {
    fontFamily: FONTS.display700,
    fontSize: 14,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: RADIUS.panel,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerTitle: {
    fontFamily: FONTS.display700,
    fontSize: 14,
    color: COLORS.white,
  },
  footerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  footerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  footerSub: {
    fontFamily: FONTS.body400,
    fontSize: 12,
    color: COLORS.text50,
  },
  scrim: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 280,
    backgroundColor: '#12100e',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    borderTopRightRadius: RADIUS.panel,
    borderBottomRightRadius: RADIUS.panel,
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  topBarText: {
    flex: 1,
    minWidth: 0,
  },
  topBarTitle: {
    fontFamily: FONTS.display800,
    fontSize: 18,
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  topBarSubtitle: {
    fontFamily: FONTS.body400,
    fontSize: 13,
    color: COLORS.text50,
    marginTop: 1,
  },
});
