import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorkoutCard } from '../components/WorkoutCard';
import { useWorkouts } from '../hooks/useWorkouts';
import { COLORS, SIZES, SPACING } from '../constants/colors';

export const HistoryScreen = () => {
    const {workouts, removeWorkout} = useWorkouts();

    return (
<SafeAreaView style={styles.container} edges={['top']}>
<View style={styles.header}>
<Text style={styles.title}>History</Text>
<Text style={styles.subtitle}>All your workouts</Text>
</View>
  <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
    {workouts.length === 0 ? (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No workouts yet</Text>
        <Text style={styles.emptySubtext}>Your workout history will appear here</Text>
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
    header: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.lg,
    },
    title: {
        fontSize: SIZES.xxxl,
        fontWeight: '700',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: SIZES.md,
        color: COLORS.textLight,
        marginTop: SPACING.xs,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: SPACING.xxxl * 3,
    },
    emptyText: {
        fontSize: SIZES.xl,
        fontWeight: '600',
        color: COLORS.text,
    },
    emptySubtext: {
        fontSize: SIZES.md,
        color: COLORS.textLighter,
        marginTop: SPACING.md,
    },
});