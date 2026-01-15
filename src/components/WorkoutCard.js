import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING, RADIUS } from '../constants/colors';
import { formatDate } from '../utils/calculations';

export const WorkoutCard = ({ workout, onDelete }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.exercise}>{workout.exercise}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>{workout.sets} sets</Text>
            <Text style={styles.separator}>×</Text>
            <Text style={styles.statText}>{workout.reps} reps</Text>
            <Text style={styles.separator}>@</Text>
            <Text style={styles.weight}>{workout.weight} lbs</Text>
          </View>
          <View style={styles.dateRow}>
            <Ionicons
              name="time-outline"
              size={16}
              color={COLORS.textLighter}
            />
            <Text style={styles.date}>{formatDate(workout.date)}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(workout.id)}
        >
          <Ionicons name="trash-outline" size={24} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mainInfo: {
    flex: 1,
  },
  exercise: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  statText: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  separator: {
    fontSize: SIZES.md,
    color: COLORS.textLighter,
  },
  weight: {
    fontSize: SIZES.md,
    color: COLORS.primary,
    fontWeight: '700',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  date: {
    fontSize: SIZES.sm,
    color: COLORS.textLighter,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
});