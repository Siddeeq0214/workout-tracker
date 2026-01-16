import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING, RADIUS } from '../constants/colors';
import { formatDate } from '../utils/calculations';

export const WorkoutCard = ({ workout, onDelete }) => {
  const isMultiSet = Array.isArray(workout.sets);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.exercise}>[ {workout.exercise.toUpperCase()} ]</Text>
          
          <View style={styles.statsRow}>
            {isMultiSet ? (
              <>
                <Text style={styles.statText}>{workout.sets.length.toString().padStart(2, '0')} UNITS</Text>
                <Text style={styles.separator}>::</Text>
                <Text style={styles.statText}>MAX {workout.maxWeight} LBS</Text>
              </>
            ) : (
              <>
                <Text style={styles.statText}>{workout.sets} UNITS</Text>
                <Text style={styles.separator}>×</Text>
                <Text style={styles.statText}>{workout.reps} REPS</Text>
                <Text style={styles.separator}>@</Text>
                <Text style={styles.weight}>{workout.weight} LBS</Text>
              </>
            )}
          </View>

          {isMultiSet && (
            <View style={styles.setsList}>
              {workout.sets.map((set, idx) => (
                <View key={idx} style={styles.setChip}>
                  <Text style={styles.setChipText}>
                    {set.reps} × {set.weight}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.dateRow}>
            <Ionicons
              name="radio-outline"
              size={14}
              color={COLORS.primary}
            />
            <Text style={styles.date}>LOG_DATE: {formatDate(workout.date).toUpperCase()}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(workout.id)}
        >
          <Ionicons name="trash" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    borderRadius: RADIUS.sm,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
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
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statText: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: 'bold',
    opacity: 0.9,
  },
  separator: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    opacity: 0.5,
  },
  weight: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 255, 65, 0.2)',
    paddingTop: SPACING.sm,
  },
  date: {
    fontSize: 10,
    color: COLORS.primary,
    opacity: 0.6,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
  },
  setsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  setChip: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.3)',
  },
  setChipText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
