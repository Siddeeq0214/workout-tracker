import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, SPACING, RADIUS } from '../constants/colors';

const TASKS_STORAGE_KEY = '@workout_tasks';

export const TaskScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    exercises: '',
    // date: new Date().toISOString().split('T')[0],
    // time: '06:00',
    difficulty: 'medium',
    notes: '',
  });

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const handleAddTask = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const exercisesList = formData.exercises
      .split(',')
      .map(e => e.trim())
      .filter(e => e);

    if (exercisesList.length === 0) {
      Alert.alert('Error', 'Please enter at least one exercise');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: formData.title.trim(),
      exercises: exercisesList,
      // date: formData.date,
      // time: formData.time,
      difficulty: formData.difficulty,
      notes: formData.notes.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...newTask, id: editingTask.id, completed: t.completed } : t));
    } else {
      setTasks([newTask, ...tasks]);
    }

    resetForm();
    setShowAddModal(false);
    setEditingTask(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      exercises: '',
      // date: new Date().toISOString().split('T')[0],
      // time: '06:00',
      difficulty: 'medium',
      notes: '',
    });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      exercises: task.exercises.join(', '),
      // date: task.date,
      // time: task.time,
      difficulty: task.difficulty,
      notes: task.notes || '',
    });
    setShowAddModal(true);
  };

  const handleDeleteTask = (id) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setTasks(tasks.filter(t => t.id !== id)),
        },
      ]
    );
  };

  const toggleTaskComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return { bg: '#D1FAE5', text: COLORS.success };
      case 'medium': return { bg: '#FEF3C7', text: COLORS.warning };
      case 'hard': return { bg: '#FEE2E2', text: COLORS.danger };
      default: return { bg: COLORS.border, text: COLORS.textLight };
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <Ionicons name="calendar" size={32} color={COLORS.primary} />
            <Text style={styles.title}>Workout Tasks</Text>
          </View>
          <Text style={styles.subtitle}>Plan and track your routines</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setEditingTask(null);
            setShowAddModal(true);
          }}
        >
          <Ionicons name="add" size={28} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <Text style={styles.statValue}>{tasks.length}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <Ionicons name="time-outline" size={20} color={COLORS.warning} />
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <Text style={styles.statValue}>{pendingCount}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.statLabel}>Done</Text>
            </View>
            <Text style={styles.statValue}>{completedCount}</Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'pending' && styles.filterButtonActivePending]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'completed' && styles.filterButtonActiveCompleted]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Task List */}
        <View style={styles.taskList}>
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="barbell-outline" size={64} color={COLORS.border} />
              <Text style={styles.emptyText}>No tasks found</Text>
              <Text style={styles.emptySubtext}>
                Create a workout task to get started
              </Text>
            </View>
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                getDifficultyColor={getDifficultyColor}
                navigation={navigation}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Task Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTask ? 'Edit Task' : 'Create Workout Task'}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowAddModal(false);
                setEditingTask(null);
                resetForm();
              }}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                {/* Title */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Task Title *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.title}
                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                    placeholder="e.g., Upper Body Workout"
                    placeholderTextColor={COLORS.textLighter}
                  />
                </View>

                {/* Exercises */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Exercises (comma separated) *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.exercises}
                    onChangeText={(text) => setFormData({ ...formData, exercises: text })}
                    placeholder="Bench Press, Squats, Deadlifts"
                    placeholderTextColor={COLORS.textLighter}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {/* Date and Time */}
                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.flex1]}>
                    <Text style={styles.inputLabel}>Date</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.date}
                      onChangeText={(text) => setFormData({ ...formData, date: text })}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={COLORS.textLighter}
                    />
                  </View>
                  {/* <View style={[styles.inputGroup, styles.flex1]}>
                    <Text style={styles.inputLabel}>Time</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.time}
                      onChangeText={(text) => setFormData({ ...formData, time: text })}
                      placeholder="HH:MM"
                      placeholderTextColor={COLORS.textLighter}
                    />
                  </View> */}
                </View>

                {/* Difficulty */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Difficulty</Text>
                  <View style={styles.difficultyButtons}>
                    {['easy', 'medium', 'hard'].map(level => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.difficultyButton,
                          formData.difficulty === level && styles.difficultyButtonActive,
                          { backgroundColor: getDifficultyColor(level).bg }
                        ]}
                        onPress={() => setFormData({ ...formData, difficulty: level })}
                      >
                        <Text style={[
                          styles.difficultyButtonText,
                          { color: getDifficultyColor(level).text }
                        ]}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Notes */}
                {/* <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Notes (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.notes}
                    onChangeText={(text) => setFormData({ ...formData, notes: text })}
                    placeholder="Add any additional notes..."
                    placeholderTextColor={COLORS.textLighter}
                    multiline
                    numberOfLines={3}
                  />
                </View> */}
              </View>
            </ScrollView>

            <TouchableOpacity onPress={handleAddTask}>
              <LinearGradient
                colors={[COLORS.gradient1, COLORS.gradient2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Task Card Component
const TaskCard = ({ task, onToggleComplete, onEdit, onDelete, getDifficultyColor, navigation }) => {
  const difficultyStyle = getDifficultyColor(task.difficulty);

  return (
    <View style={[styles.taskCard, task.completed && styles.taskCardCompleted]}>
      <View style={styles.taskContent}>
        {/* Checkbox */}
        <TouchableOpacity
          style={[styles.checkbox, task.completed && styles.checkboxChecked]}
          onPress={() => onToggleComplete(task.id)}
        >
          {task.completed && (
            <Ionicons name="checkmark" size={18} color={COLORS.white} />
          )}
        </TouchableOpacity>

        {/* Task Info */}
        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
            {task.title}
          </Text>

          {/* Date, Time, Difficulty */}
          <View style={styles.taskMeta}>
            <View style={styles.taskMetaItem}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.textLight} />
              <Text style={styles.taskMetaText}>
                {new Date(task.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
            </View>
            <View style={styles.taskMetaItem}>
              <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
              <Text style={styles.taskMetaText}>{task.time}</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyStyle.bg }]}>
              <Text style={[styles.difficultyBadgeText, { color: difficultyStyle.text }]}>
                {task.difficulty}
              </Text>
            </View>
          </View>

          {/* Exercises */}
          <View style={styles.exerciseList}>
            {task.exercises.map((exercise, idx) => (
              <View key={idx} style={styles.exerciseChip}>
                <Ionicons name="barbell" size={10} color={COLORS.primary} />
                <Text style={styles.exerciseChipText}>{exercise}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.taskActions}>
            {/* <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Ionicons name="play" size={14} color={COLORS.primary} />
              <Text style={styles.startButtonText}>Start Workout</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(task)}
            >
              <Ionicons name="pencil" size={16} color={COLORS.textLight} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(task.id)}
            >
              <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  statLabel: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  statValue: {
    fontSize: SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Filters
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  filterButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonActivePending: {
    backgroundColor: COLORS.warning,
  },
  filterButtonActiveCompleted: {
    backgroundColor: COLORS.success,
  },
  filterText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  filterTextActive: {
    color: COLORS.white,
  },

  // Task List
  taskList: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  taskCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  taskCardCompleted: {
    opacity: 0.7,
  },
  taskContent: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  taskMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  taskMetaText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  difficultyBadgeText: {
    fontSize: SIZES.xs,
    fontWeight: '600',
  },
  exerciseList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  exerciseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  exerciseChipText: {
    fontSize: SIZES.xs,
    fontWeight: '600',
    color: COLORS.primary,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  startButtonText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  actionButton: {
    padding: SPACING.xs,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl * 2,
    borderTopRightRadius: RADIUS.xl * 2,
    padding: SPACING.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalBody: {
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: SIZES.base,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  flex1: {
    flex: 1,
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  difficultyButtonActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  difficultyButtonText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '700',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
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