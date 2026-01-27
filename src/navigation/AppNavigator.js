import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { TaskScreen } from '../screens/TaskScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { COLORS, FONTS } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'STATUS') {
            iconName = focused ? 'terminal' : 'terminal-outline';
          } else if (route.name === 'DATA') {
            iconName = focused ? 'pulse' : 'pulse-outline';
          } else if (route.name === 'ARCHIVE') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'QUESTS') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'MEMBERSHIP') {
             iconName = focused ? 'card' : 'card-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'rgba(0, 255, 65, 0.3)',
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 5,
          backgroundColor: COLORS.background,
          paddingBottom: 16,
          paddingTop: 8,
          height: 60,
          borderTopWidth: 2,
          borderTopColor: COLORS.primary,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.bold,
          fontSize: 10,
          letterSpacing: 1,
        },
      })}
    >
      <Tab.Screen name="STATUS" component={HomeScreen} />
      {/* <Tab.Screen name="DATA" component={ProgressScreen} /> */}
      <Tab.Screen name="MEMBERSHIP" component={PaymentScreen} />
      <Tab.Screen name="ARCHIVE" component={HistoryScreen} />
      <Tab.Screen name="QUESTS" component={TaskScreen} />
    </Tab.Navigator>
  );
}