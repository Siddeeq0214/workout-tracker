import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { TaskScreen } from '../screens/TaskScreen';
import { COLORS } from '../constants/colors';

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
          }else if (route.name === 'QUESTS') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'rgba(0, 255, 65, 0.3)',
        tabBarStyle: {
          backgroundColor: '#041207',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          borderTopWidth: 2,
          borderTopColor: COLORS.primary,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          letterSpacing: 1,
        },
      })}
    >
      <Tab.Screen name="STATUS" component={HomeScreen} />
      <Tab.Screen name="DATA" component={ProgressScreen} />
      <Tab.Screen name="ARCHIVE" component={HistoryScreen} />
      <Tab.Screen name="QUESTS" component={TaskScreen} />
    </Tab.Navigator>
  );
}