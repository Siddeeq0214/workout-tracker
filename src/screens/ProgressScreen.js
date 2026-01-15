import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useWorkouts } from '../hooks/useWorkouts';
import { calculateStats, getUniqueExercises } from '../utils/calculations';
import { COLORS, SIZES, SPACING, RADIUS } from '../constants/colors';

// Progress Bar Component
const ProgressBar = ({current, goal, label}) => {
    const percentage = Math.min((current / goal) * 100, 100);
    const isComplete = current >= goal;

    return (
        <View style={styles.progressBarContainer}>
      <View style={styles.progressBarHeader}>
        <Text style={styles.progressBarLabel}>{label}</Text>
        <Text style={styles.progressBarValue}>
          {current} / {goal}
        </Text>
      </View>
      <View style={styles.progressBarTrack}>
        <LinearGradient
          colors={isComplete ? ['#10B981', '#059669'] : [COLORS.gradient1, COLORS.gradient2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressBarFill, { width: `${percentage}%` }]}
        >
          {isComplete && (
            <Ionicons name="checkmark-circle" size={12} color={COLORS.white} />
          )}
        </LinearGradient>
      </View>
      <View style={styles.progressBarFooter}>
        <Text style={styles.progressBarPercentage}>{percentage.toFixed(0)}% Complete</Text>
        {isComplete && (
          <View style={styles.achievedBadge}>
            <Ionicons name="trophy" size={10} color={COLORS.success} />
            <Text style={styles.achievedText}>Goal Achieved!</Text>
          </View>
        )}
      </View>
    </View>
    );
};

// Goal Card Component
const GoalCard = ({ exercise, stats, goals, onEditGoals }) => {
  const allGoalsComplete =
    stats.maxWeight >= goals.targetWeight &&
    stats.totalVolume >= goals.targetVolume &&
    stats.count >= goals.targetSessions;

  const milestones = [
    {
      completed: stats.maxWeight >= goals.targetWeight,
      label: `Lift ${goals.targetWeight} lbs`,
    },
    {
      completed: stats.totalVolume >= goals.targetVolume,
      label: `Achieve ${goals.targetVolume.toLocaleString()} lbs total volume`,
    },
    {
      completed: stats.count >= goals.targetSessions,
      label: `Complete ${goals.targetSessions} training sessions`,
    },
  ];

  return (
    <View style={[styles.goalCard, allGoalsComplete && styles.goalCardComplete]}>
      {/* Header */}
      <View style={styles.goalCardHeader}>
        <View style={styles.goalCardTitleRow}>
          <View style={styles.goalIconContainer}>
            <Ionicons name="fitness" size={24} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.goalCardTitle}>{exercise}</Text>
            <Text style={styles.goalCardSubtitle}>Track your goals</Text>
          </View>
        </View>
        <View style={styles.goalCardHeaderRight}>
          {allGoalsComplete && (
            <View style={styles.completeBadge}>
              <Ionicons name="trophy" size={16} color={COLORS.success} />
              <Text style={styles.completeText}>Complete!</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEditGoals(exercise)}
          >
            <Ionicons name="pencil" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Current Stats */}
      <LinearGradient
        colors={['#EEF2FF', '#F3E8FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsGrid}
      >
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Max Weight</Text>
          <Text style={styles.statValue}>{stats.maxWeight}</Text>
          <Text style={styles.statUnit}>lbs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Volume</Text>
          <Text style={styles.statValue}>{(stats.totalVolume / 1000).toFixed(1)}k</Text>
          <Text style={styles.statUnit}>lbs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Sessions</Text>
          <Text style={styles.statValue}>{stats.count}</Text>
          <Text style={styles.statUnit}>total</Text>
        </View>
      </LinearGradient>

      {/* Progress Bars */}
      <View style={styles.progressSection}>
        <ProgressBar
          current={stats.maxWeight}
          goal={goals.targetWeight}
          label="Weight Goal"
        />
        <ProgressBar
          current={stats.totalVolume}
          goal={goals.targetVolume}
          label="Volume Goal"
        />
        <ProgressBar
          current={stats.count}
          goal={goals.targetSessions}
          label="Session Goal"
        />
      </View>
    </View>
  );
};

// Edit Goals Modal Component
const EditGoalsModal = ({ visible, exercise, currentGoals, onClose, onSave }) => {
  const [goals, setGoals] = useState(currentGoals || {
    targetWeight: '',
    targetVolume: '',
    targetSessions: '',
  });

  const handleSave = () => {
    onSave(exercise, {
      targetWeight: parseFloat(goals.targetWeight) || 0,
      targetVolume: parseFloat(goals.targetVolume) || 0,
      targetSessions: parseInt(goals.targetSessions) || 0,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Set Goals for {exercise}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Target Weight (lbs)</Text>
              <TextInput
                style={styles.modalInput}
                value={goals.targetWeight.toString()}
                onChangeText={(text) => setGoals({ ...goals, targetWeight: text })}
                keyboardType="numeric"
                placeholder="e.g., 185"
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Target Volume (lbs)</Text>
              <TextInput
                style={styles.modalInput}
                value={goals.targetVolume.toString()}
                onChangeText={(text) => setGoals({ ...goals, targetVolume: text })}
                keyboardType="numeric"
                placeholder="e.g., 15000"
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Target Sessions</Text>
              <TextInput
                style={styles.modalInput}
                value={goals.targetSessions.toString()}
                onChangeText={(text) => setGoals({ ...goals, targetSessions: text })}
                keyboardType="numeric"
                placeholder="e.g., 10"
              />
            </View>
          </View>

          <TouchableOpacity onPress={handleSave}>
            <LinearGradient
              colors={[COLORS.gradient1, COLORS.gradient2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Save Goals</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Main Progress Screen
export const ProgressScreen = () => {
  const { workouts } = useWorkouts();
  const exercises = getUniqueExercises(workouts);

  // Default goals - in production, store these with AsyncStorage
  const [exerciseGoals, setExerciseGoals] = useState({
    'Bench Press': { targetWeight: 185, targetVolume: 15000, targetSessions: 10 },
    'Squats': { targetWeight: 225, targetVolume: 20000, targetSessions: 10 },
    'Deadlift': { targetWeight: 275, targetVolume: 12000, targetSessions: 8 },
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);

  const handleEditGoals = (exercise) => {
    setEditingExercise(exercise);
    setEditModalVisible(true);
  };

  const handleSaveGoals = (exercise, goals) => {
    setExerciseGoals({
      ...exerciseGoals,
      [exercise]: goals,
    });
  };

  // Calculate overall progress
  const totalGoals = exercises.length * 3;
  const completedGoals = exercises.reduce((count, exercise) => {
    const stats = calculateStats(workouts, exercise);
    const goals = exerciseGoals[exercise];
    if (!stats || !goals) return count;

    let completed = 0;
    if (stats.maxWeight >= goals.targetWeight) completed++;
    if (stats.totalVolume >= goals.targetVolume) completed++;
    if (stats.count >= goals.targetSessions) completed++;
    return count + completed;
  }, 0);

  const overallProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <Ionicons name="trending-up" size={32} color={COLORS.primary} />
            <Text style={styles.title}>Progress Tracker</Text>
          </View>
          <Text style={styles.subtitle}>Monitor your fitness goals</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Overall Progress */}
        <View style={styles.overallProgressCard}>
          <View style={styles.overallProgressHeader}>
            <Text style={styles.overallProgressTitle}>Overall Progress</Text>
            <View style={styles.overallProgressBadge}>
              <Ionicons name="trophy" size={20} color={COLORS.primary} />
              <Text style={styles.overallProgressText}>
                {completedGoals}/{totalGoals}
              </Text>
            </View>
          </View>
          <View style={styles.overallProgressBar}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary, '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.overallProgressFill, { width: `${overallProgress}%` }]}
            />
          </View>
          <View style={styles.overallProgressFooter}>
            <Text style={styles.overallProgressPercentage}>
              {overallProgress.toFixed(0)}% Complete
            </Text>
            <Text style={styles.overallProgressGoals}>
              {completedGoals} goals achieved
            </Text>
          </View>
        </View>

        {/* Exercise Goal Cards */}
        {exercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="barbell-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>No exercise data yet</Text>
            <Text style={styles.emptySubtext}>
              Start logging workouts to track progress
            </Text>
          </View>
        ) : (
          exercises.map((exercise) => {
            const stats = calculateStats(workouts, exercise);
            const goals = exerciseGoals[exercise] || {
              targetWeight: 100,
              targetVolume: 10000,
              targetSessions: 5,
            };
            return stats ? (
              <GoalCard
                key={exercise}
                exercise={exercise}
                stats={stats}
                goals={goals}
                onEditGoals={handleEditGoals}
              />
            ) : null;
          })
        )}
      </ScrollView>

      {/* Edit Goals Modal */}
      <EditGoalsModal
        visible={editModalVisible}
        exercise={editingExercise}
        currentGoals={editingExercise ? exerciseGoals[editingExercise] : null}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveGoals}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
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
  
  // Overall Progress Card
  overallProgressCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overallProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  overallProgressTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  overallProgressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  overallProgressText: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  overallProgressBar: {
    height: 16,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  overallProgressFill: {
    height: '100%',
  },
  overallProgressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  overallProgressPercentage: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  overallProgressGoals: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Goal Card
  goalCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalCardComplete: {
    borderColor: COLORS.success,
  },
  goalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  goalCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  goalIconContainer: {
    backgroundColor: '#EEF2FF',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  goalCardTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  goalCardSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  goalCardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  completeText: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    color: COLORS.success,
  },
  editButton: {
    padding: SPACING.xs,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statUnit: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },

  // Progress Section
  progressSection: {
    marginBottom: SPACING.lg,
  },
  progressBarContainer: {
    marginBottom: SPACING.lg,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progressBarLabel: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressBarValue: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  progressBarPercentage: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
  },
  achievedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  achievedText: {
    fontSize: SIZES.xs,
    fontWeight: '600',
    color: COLORS.success,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  modalBody: {
    marginBottom: SPACING.xl,
  },
  modalInputGroup: {
    marginBottom: SPACING.lg,
  },
  modalLabel: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: SIZES.base,
    color: COLORS.text,
  },
  modalButton: {
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '700',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 3,
  },
  emptyText: {
    fontSize: SIZES.xl,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: SPACING.lg,
  },
  emptySubtext: {
    fontSize: SIZES.md,
    color: COLORS.textLighter,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});