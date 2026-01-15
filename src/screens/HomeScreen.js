import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { WorkoutCard } from "../components/WorkoutCard";
import { WorkoutForm } from "../components/WorkoutForm";
import { useWorkouts } from "../hooks/useWorkouts";
import { getTotalVolume } from "../utils/calculations";
import { COLORS, SIZES, SPACING, RADIUS } from "../constants/colors";

export const HomeScreen = ({ navigation }) => {
  const { workouts, loading, addWorkout, removeWorkout } = useWorkouts();
  const [showForm, setShowForm] = useState(false);

  const recentWorkouts = workouts.slice(0, 5);
  const totalWorkouts = workouts.length;
  const totalVolume = getTotalVolume(workouts);

  const handleAddWorkout = (workout) => {
    addWorkout(workout);
    setShowForm(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.titleRow}>
              <Ionicons name="barbell" size={32} color={COLORS.primary} />
              <Text style={styles.title}>FitTrack</Text>
            </View>
            <Text style={styles.subtitle}>
              Your fitness journey starts here
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(!showForm)}
          >
            <Ionicons
              name={showForm ? "close" : "add"}
              size={28}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <Ionicons name="bar-chart" size={20} color={COLORS.primary} />
              <Text style={styles.statLabel}>Total Workouts</Text>
            </View>
            <Text style={styles.statValue}>{totalWorkouts}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <Ionicons name="trending-up" size={20} color={COLORS.secondary} />
              <Text style={styles.statLabel}>Total Volume</Text>
            </View>
            <Text style={styles.statValue}>
              {(totalVolume / 1000).toFixed(1)}k
            </Text>
            <Text style={styles.statUnit}>lbs</Text>
          </View>
        </View>

        {/* Add Form */}
        {showForm && (
          <View style={styles.formContainer}>
            <WorkoutForm
              onSubmit={handleAddWorkout}
              onCancel={() => setShowForm(false)}
            />
          </View>
        )}

        {/* Recent Workouts */}
        <View style={styles.workoutsContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="calendar" size={24} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Recent Workouts</Text>
            </View>
            {workouts.length > 5 && (
              <TouchableOpacity onPress={() => navigation.navigate("History")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentWorkouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="barbell-outline"
                size={64}
                color={COLORS.border}
              />
              <Text style={styles.emptyTitle}>No workouts yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the + button to log your first workout
              </Text>
            </View>
          ) : (
            recentWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onDelete={removeWorkout}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: "700",
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
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  statLabel: {
    fontSize: SIZES.sm,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  statValue: {
    fontSize: SIZES.xxxl,
    fontWeight: "700",
    color: COLORS.text,
  },
  statUnit: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  formContainer: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  workoutsContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    minHeight: 400,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: SIZES.xl,
    fontWeight: "700",
    color: COLORS.text,
  },
  viewAllText: {
    fontSize: SIZES.sm,
    fontWeight: "600",
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyTitle: {
    fontSize: SIZES.xl,
    fontWeight: "600",
    color: COLORS.textLight,
    marginTop: SPACING.lg,
  },
  emptySubtitle: {
    fontSize: SIZES.md,
    color: COLORS.textLighter,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
});
