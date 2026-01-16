import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { useWorkouts } from '../hooks/useWorkouts';
import { calculateStats, getUniqueExercises, getChartData } from '../utils/calculations';
import { COLORS, SIZES, SPACING, RADIUS } from '../constants/colors';

const screenWidth = Dimensions.get("window").width;

// Progress Bar Component
const ProgressBar = ({current, goal, label}) => {
    const percentage = Math.min((current / goal) * 100, 100);
    const isComplete = current >= goal;

    return (
        <View style={styles.progressBarContainer}>
      <View style={styles.progressBarHeader}>
        <Text style={styles.progressBarLabel}>{label.toUpperCase()}</Text>
        <Text style={styles.progressBarValue}>
          {current} / {goal}
        </Text>
      </View>
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill, 
            { width: `${percentage}%` },
            isComplete && { backgroundColor: COLORS.primary }
          ]}
        />
      </View>
      <View style={styles.progressBarFooter}>
        <Text style={styles.progressBarPercentage}>{percentage.toFixed(0)}% LOADED</Text>
        {isComplete && (
          <View style={styles.achievedBadge}>
            <Ionicons name="checkmark-sharp" size={10} color={COLORS.primary} />
            <Text style={styles.achievedText}>TARGET ACHIEVED</Text>
          </View>
        )}
      </View>
    </View>
    );
};

// Goal Card Component
const GoalCard = ({ exercise, stats, goals, onEditGoals, workouts }) => {
  const chartData = getChartData(workouts, exercise);
  
  const allGoalsComplete =
    stats.maxWeight >= goals.targetWeight &&
    stats.totalVolume >= goals.targetVolume &&
    stats.count >= goals.targetSessions;

  return (
    <View style={[styles.goalCard, allGoalsComplete && styles.goalCardComplete]}>
      {/* Header */}
      <View style={styles.goalCardHeader}>
        <View style={styles.goalCardTitleRow}>
          <View style={styles.goalIconContainer}>
            <Ionicons name="scan-outline" size={24} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.goalCardTitle}>[ {exercise.toUpperCase()} ]</Text>
            <Text style={styles.goalCardSubtitle}>V.A.T.S. TARGET ANALYSIS</Text>
          </View>
        </View>
        <View style={styles.goalCardHeaderRight}>
          {allGoalsComplete && (
            <View style={styles.completeBadge}>
              <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
              <Text style={styles.completeText}>OPTIMIZED</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEditGoals(exercise)}
          >
            <Ionicons name="settings-outline" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chart */}
      {chartData && chartData.labels.length > 1 && (
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth - SPACING.xl * 4 - 32}
            height={180}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: COLORS.cardBg,
              backgroundGradientTo: COLORS.cardBg,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 255, 65, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 255, 65, ${opacity})`,
              style: {
                borderRadius: 0
              },
              propsForDots: {
                r: "3",
                strokeWidth: "1",
                stroke: COLORS.primary
              },
              propsForBackgroundLines: {
                stroke: 'rgba(0, 255, 65, 0.1)',
                strokeDasharray: '0',
              }
            }}
            bezier
            style={styles.chart}
          />
          <Text style={styles.chartTitle}>PROGRESS_GRAPH: MAX_WT_THROUGHPUT</Text>
        </View>
      )}

      {/* Current Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>MAX_WT</Text>
          <Text style={styles.statValue}>{stats.maxWeight}</Text>
          <Text style={styles.statUnit}>LBS</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>VOLUME</Text>
          <Text style={styles.statValue}>{(stats.totalVolume / 1000).toFixed(1)}K</Text>
          <Text style={styles.statUnit}>LBS</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>LOGS</Text>
          <Text style={styles.statValue}>{stats.count.toString().padStart(2, '0')}</Text>
          <Text style={styles.statUnit}>TOTAL</Text>
        </View>
      </View>

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
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>[ MODIFY_GOALS: {exercise?.toUpperCase()} ]</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>TARGET_WEIGHT (LBS)</Text>
              <TextInput
                style={styles.modalInput}
                value={goals.targetWeight.toString()}
                onChangeText={(text) => setGoals({ ...goals, targetWeight: text })}
                keyboardType="numeric"
                placeholder="000"
                placeholderTextColor="rgba(0, 255, 65, 0.3)"
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>TARGET_VOLUME (LBS)</Text>
              <TextInput
                style={styles.modalInput}
                value={goals.targetVolume.toString()}
                onChangeText={(text) => setGoals({ ...goals, targetVolume: text })}
                keyboardType="numeric"
                placeholder="00000"
                placeholderTextColor="rgba(0, 255, 65, 0.3)"
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>TARGET_SESSIONS</Text>
              <TextInput
                style={styles.modalInput}
                value={goals.targetSessions.toString()}
                onChangeText={(text) => setGoals({ ...goals, targetSessions: text })}
                keyboardType="numeric"
                placeholder="00"
                placeholderTextColor="rgba(0, 255, 65, 0.3)"
              />
            </View>
          </View>

          <TouchableOpacity onPress={handleSave} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>EXECUTE MODIFICATION</Text>
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
      <View style={styles.scanline} pointerEvents="none" />
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>[ V.A.T.S. DATA ]</Text>
          </View>
          <Text style={styles.subtitle}>LONG-RANGE PROGRESS ANALYSIS</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Overall Progress */}
        <View style={styles.overallProgressCard}>
          <View style={styles.overallProgressHeader}>
            <Text style={styles.overallProgressTitle}>SYSTEM_READINESS</Text>
            <View style={styles.overallProgressBadge}>
              <Text style={styles.overallProgressText}>
                {completedGoals}/{totalGoals} TASKS
              </Text>
            </View>
          </View>
          <View style={styles.overallProgressBar}>
            <View
              style={[styles.overallProgressFill, { width: `${overallProgress}%`, backgroundColor: COLORS.primary }]}
            />
          </View>
          <View style={styles.overallProgressFooter}>
            <Text style={styles.overallProgressPercentage}>
              {overallProgress.toFixed(0)}% OPTIMIZED
            </Text>
            <Text style={styles.overallProgressGoals}>
              TOTAL_GAINS: ACTIVE
            </Text>
          </View>
        </View>

        {/* Exercise Goal Cards */}
        {exercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>NO DATA IN BUFFER</Text>
            <Text style={styles.emptySubtext}>
              INITIATE TRAINING TO POPULATE DATABASE
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
                workouts={workouts}
              />
            ) : null;
          })
        )}
      </ScrollView>

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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    fontSize: SIZES.xl,
    fontWeight: "bold",
    color: COLORS.primary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    marginTop: SPACING.xs,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  
  overallProgressCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  overallProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  overallProgressTitle: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  overallProgressBadge: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  overallProgressText: {
    fontSize: SIZES.xs,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  overallProgressBar: {
    height: 12,
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.3)',
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
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  overallProgressGoals: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    opacity: 0.7,
  },

  goalCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.02)',
    borderRadius: RADIUS.sm,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.3)',
  },
  goalCardComplete: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
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
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    padding: SPACING.xs,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  goalCardTitle: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  goalCardSubtitle: {
    fontSize: 10,
    color: COLORS.primary,
    opacity: 0.6,
    fontWeight: 'bold',
  },
  goalCardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  completeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  editButton: {
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.3)',
    borderRadius: RADIUS.sm,
  },

  statsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.2)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.primary,
    opacity: 0.7,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statValue: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statUnit: {
    fontSize: 8,
    color: COLORS.primary,
    opacity: 0.5,
    fontWeight: 'bold',
  },

  progressSection: {
    gap: SPACING.md,
  },
  progressBarContainer: {
    marginBottom: SPACING.xs,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBarLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressBarValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.2)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'rgba(0, 255, 65, 0.6)',
  },
  progressBarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  progressBarPercentage: {
    fontSize: 8,
    color: COLORS.primary,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  achievedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  achievedText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 18, 7, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
  },
  modalBody: {
    marginBottom: SPACING.xl,
  },
  modalInputGroup: {
    marginBottom: SPACING.lg,
  },
  modalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  modalInput: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    fontSize: SIZES.base,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  modalButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: SPACING.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
  },
  modalButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.md,
    fontWeight: 'bold',
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
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emptySubtext: {
    fontSize: 10,
    color: COLORS.primary,
    marginTop: SPACING.sm,
    textAlign: 'center',
    opacity: 0.7,
  },

  chartContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 65, 0.02)',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.1)',
  },
  chart: {
    marginVertical: 8,
  },
  chartTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
    opacity: 0.6,
  },
});
