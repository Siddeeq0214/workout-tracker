import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorkoutCard } from '../components/WorkoutCard';
import { useWorkouts } from '../hooks/useWorkouts';
import { COLORS, SIZES, SPACING, RADIUS, FONTS } from '../constants/colors';

export const HistoryScreen = () => {
    const {workouts, removeWorkout} = useWorkouts();

    return (
<SafeAreaView style={styles.container} edges={['top']}>
  <View style={styles.scanline} pointerEvents="none" />
  <View style={styles.header}>
    <Text style={styles.title}>[ ARCHIVE_DATA ]</Text>
    <Text style={styles.subtitle}>LONG-TERM MISSION LOG STORAGE</Text>
  </View>
  <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={{ paddingBottom: 100}}>
    {workouts.length === 0 ? (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>NO ARCHIVES FOUND</Text>
        <Text style={styles.emptySubtext}>INITIATE MISSIONS TO GENERATE DATA</Text>
      </View>
    ) : (
      workouts.map(workout => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          onDelete={removeWorkout}
        />
      ))
    )}
  </ScrollView>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scanline: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 255, 65, 0.03)',
      zIndex: 999,
    },
    header: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.lg,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
        backgroundColor: 'rgba(0, 255, 65, 0.05)',
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: SIZES.xl,
        color: COLORS.primary,
        letterSpacing: 2,
    },
    subtitle: {
        fontFamily: FONTS.bold,
        fontSize: 10,
        color: COLORS.primary,
        marginTop: 4,
        opacity: 0.8,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.lg,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: SPACING.xxxl,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: COLORS.primary,
        borderRadius: RADIUS.sm,
    },
    emptyText: {
        fontFamily: FONTS.bold,
        fontSize: SIZES.md,
        color: COLORS.primary,
    },
    emptySubtext: {
        fontFamily: FONTS.regular,
        fontSize: 9,
        color: COLORS.primary,
        marginTop: 4,
        opacity: 0.7,
    },
});