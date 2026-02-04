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
import { COLORS, SIZES, SPACING, RADIUS, FONTS } from '../constants/colors';

const TASKS_STORAGE_KEY = '@workout_tasks';

// Redesigned TaskScreen
export const TaskScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    exercises: '',
    date: new Date().toISOString().split('T')[0],
    difficulty: 'medium',
    notes: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

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
      Alert.alert('VAULT_ALERT', 'ENTER MISSION TITLE');
      return;
    }

    const exercisesList = formData.exercises
      .split(',')
      .map(e => e.trim())
      .filter(e => e);

    if (exercisesList.length === 0) {
      Alert.alert('VAULT_ALERT', 'ENTER AT LEAST ONE OBJECTIVE');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: formData.title.trim(),
      exercises: exercisesList,
      date: formData.date,
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
      date: new Date().toISOString().split('T')[0],
      difficulty: 'medium',
      notes: '',
    });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      exercises: task.exercises.join(', '),
      date: task.date,
      difficulty: task.difficulty,
      notes: task.notes || '',
    });
    setShowAddModal(true);
  };

  const handleDeleteTask = (id) => {
    Alert.alert(
      'MISSION_ABORT',
      'PURGE THIS DATA FROM THE ARCHIVE?',
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'PURGE',
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
      case 'easy': return { bg: 'rgba(0, 255, 65, 0.1)', text: COLORS.primary };
      case 'medium': return { bg: 'rgba(255, 182, 66, 0.1)', text: COLORS.warning };
      case 'hard': return { bg: 'rgba(255, 0, 0, 0.1)', text: COLORS.danger };
      default: return { bg: 'rgba(0, 255, 65, 0.05)', text: COLORS.primary };
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
      <View style={styles.scanline} pointerEvents="none" />
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>[ QUEST_LOG ]</Text>
          </View>
          <Text style={styles.subtitle}>ACTIVE MISSION PARAMETERS</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setEditingTask(null);
            setShowAddModal(true);
          }}
        >
          <Ionicons name="add" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xl }}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL</Text>
            <Text style={styles.statValue}>{tasks.length.toString().padStart(2, '0')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ACTIVE</Text>
            <Text style={styles.statValue}>{pendingCount.toString().padStart(2, '0')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>DONE</Text>
            <Text style={styles.statValue}>{completedCount.toString().padStart(2, '0')}</Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              {">> ALL"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'pending' && styles.filterButtonActive]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
              {">> PENDING"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
              {">> DONE"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Task List */}
        <View style={styles.taskList}>
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>NO ACTIVE QUESTS</Text>
              <Text style={styles.emptySubtext}>
                CONSULT OVERSEER FOR NEW DIRECTIVES
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
        animationType="none"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                [ {editingTask ? 'MODIFY_QUEST' : 'NEW_DIRECTIVE'} ]
              </Text>
              <TouchableOpacity onPress={() => {
                setShowAddModal(false);
                setEditingTask(null);
                resetForm();
              }}>
                <Ionicons name="close" size={28} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>QUEST_TITLE</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.title}
                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                    placeholder="ENTER MISSION NAME..."
                    placeholderTextColor="rgba(0, 255, 65, 0.3)"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>OBJECTIVES_LIST (COMMA_SEP)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.exercises}
                    onChangeText={(text) => setFormData({ ...formData, exercises: text })}
                    placeholder="SQUATS, BENCH, DEAD..."
                    placeholderTextColor="rgba(0, 255, 65, 0.3)"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.flex1]}>
                    <Text style={styles.inputLabel}>DEPLOY_DATE</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.date}
                      onChangeText={(text) => setFormData({ ...formData, date: text })}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="rgba(0, 255, 65, 0.3)"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>THREAT_LEVEL</Text>
                  <View style={styles.difficultyButtons}>
                    {['easy', 'medium', 'hard'].map(level => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.difficultyButton,
                          formData.difficulty === level && styles.difficultyButtonActive,
                          { borderColor: getDifficultyColor(level).text }
                        ]}
                        onPress={() => setFormData({ ...formData, difficulty: level })}
                      >
                        <Text style={[
                          styles.difficultyButtonText,
                          { color: getDifficultyColor(level).text }
                        ]}>
                          {level.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity onPress={handleAddTask} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>
                {editingTask ? 'UPDATE DIRECTIVE' : 'INITIATE MISSION'}
              </Text>
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
        <TouchableOpacity
          style={[styles.checkbox, task.completed && styles.checkboxChecked]}
          onPress={() => onToggleComplete(task.id)}
        >
          {task.completed && (
            <Ionicons name="checkmark" size={18} color={COLORS.primary} />
          )}
        </TouchableOpacity>

        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
            [ {task.title.toUpperCase()} ]
          </Text>

          <View style={styles.taskMeta}>
            <View style={styles.taskMetaItem}>
              <Ionicons name="radio-outline" size={14} color={COLORS.primary} />
              <Text style={styles.taskMetaText}>
                STATED: {task.date}
              </Text>
            </View>
            <View style={[styles.difficultyBadge, { borderColor: difficultyStyle.text, borderWidth: 1 }]}>
              <Text style={[styles.difficultyBadgeText, { color: difficultyStyle.text }]}>
                LVL: {task.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.exerciseList}>
            {task.exercises.map((exercise, idx) => (
              <View key={idx} style={styles.exerciseChip}>
                <Text style={styles.exerciseChipText}> {">> " + exercise.toUpperCase()}</Text>
              </View>
            ))}
          </View>

          <View style={styles.taskActions}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('STATUS', { 
                prefillExercises: task.exercises,
                routineName: task.title 
              })}
            >
              <Text style={styles.startButtonText}>{"> DEPLOY"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(task)}
            >
              <Ionicons name="settings-outline" size={16} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(task.id)}
            >
              <Ionicons name="trash" size={16} color={COLORS.primary} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontFamily: FONTS.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.primary,
    opacity: 0.8,
  },
  addButton: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.3)',
  },
  statLabel: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: COLORS.primary,
    opacity: 0.7,
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  filterButton: {
    flex: 1,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.3)',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    borderColor: COLORS.primary,
  },
  filterText: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: COLORS.primary,
    opacity: 0.7,
  },
  filterTextActive: {
    opacity: 1,
  },
  taskList: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  taskCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.02)',
    borderRadius: RADIUS.sm,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.2)',
  },
  taskCardCompleted: {
    opacity: 0.5,
  },
  taskContent: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  checkboxChecked: {
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.md,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
  },
  taskMeta: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  taskMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskMetaText: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: COLORS.primary,
    opacity: 0.6,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 2,
  },
  difficultyBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 8,
  },
  exerciseList: {
    gap: 2,
    marginBottom: SPACING.md,
  },
  exerciseChip: {
    paddingVertical: 2,
  },
  exerciseChipText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.primary,
    opacity: 0.8,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 255, 65, 0.1)',
    paddingTop: SPACING.sm,
  },
  startButton: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  startButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.primary,
  },
  actionButton: {
    padding: 2,
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
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.primary,
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
    fontFamily: FONTS.bold,
    fontSize: SIZES.md,
    color: COLORS.primary,
  },
  modalBody: {
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: COLORS.primary,
    marginBottom: 4,
  },
  input: {
    fontFamily: FONTS.bold,
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    fontSize: SIZES.base,
    color: COLORS.primary,
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
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    borderWidth: 1,
  },
  difficultyButtonActive: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
  },
  difficultyButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 9,
  },
  submitButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: SPACING.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
  },
  submitButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontSize: SIZES.md,
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
