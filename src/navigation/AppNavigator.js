import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EquipmentListScreen from '../screens/EquipmentListScreen';
import EquipmentDetailScreen from '../screens/EquipmentDetailScreen';
import EquipmentFormScreen from '../screens/EquipmentFormScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="EquipmentList"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#0A1628' },
      }}
    >
      <Stack.Screen
        name="EquipmentList"
        component={EquipmentListScreen}
      />
      <Stack.Screen
        name="EquipmentDetail"
        component={EquipmentDetailScreen}
      />
      <Stack.Screen
        name="EquipmentForm"
        component={EquipmentFormScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{
          animation: 'fade',
        }}
      />
    </Stack.Navigator>
  );
}
