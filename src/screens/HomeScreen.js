import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { WorkoutCard } from "../components/WorkoutCard";
import { WorkoutForm } from "../components/WorkoutForm";
import { useWorkouts } from "../hooks/useWorkouts";
import { getTotalVolume } from "../utils/calculations";
import { COLORS, SIZES, SPACING, RADIUS, FONTS } from "../constants/colors";

const VAULT_BOY_IMAGE = require ("../assets/images/fallout-vault-boy.png");

export const HomeScreen = ({ navigation, route }) => {
  const { workouts, loading, addWorkout, removeWorkout } = useWorkouts();
  const [showForm, setShowForm] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  // Handle prefilled exercises from TaskScreen
  useEffect(() => {
    if (route.params?.prefillExercises) {
      setShowForm(true);
      setActiveSession({
        name: route.params.routineName,
        exercises: route.params.prefillExercises,
        completed: []
      });
    }
  }, [route.params]);

  const recentWorkouts = workouts.slice(0, 5);
  const totalWorkouts = workouts.length;
  const totalVolume = getTotalVolume(workouts);

  const handleAddWorkout = (workout) => {
    addWorkout(workout);
    
    if (activeSession) {
      const remaining = activeSession.exercises.filter(e => e.toLowerCase() !== workout.exercise.toLowerCase());
      if (remaining.length === 0) {
        setActiveSession(null);
        setShowForm(false);
        alert("QUEST COMPLETE: EXERCISE GAINS ACHIEVED!");
      } else {
        setActiveSession({ ...activeSession, exercises: remaining });
      }
    } else {
      setShowForm(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>LOADING DATA FROM VAULT-TEC...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Scanline Effect Overlay */}
      <View style={styles.scanline} pointerEvents="none" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xl }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>[ PIP-BOY 3000 ]</Text>
            </View>
            <Text style={styles.terminalUser}>USER: SIDDEEQ</Text>
            <Text style={styles.subtitle}>STATUS: STRUGGLING</Text>
          </View>
          <Image 
            source={VAULT_BOY_IMAGE} 
            style={styles.vaultBoyHeader} 
          />
        </View>

        {/* S.P.E.C.I.A.L. Stats Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>[ CURRENT STATISTICS ]</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TRAINING SESSIONS</Text>
            <Text style={styles.statValue}>{totalWorkouts.toString().padStart(2, '0')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL LIFT VOLUME</Text>
            <Text style={styles.statValue}>
              {(totalVolume / 1000).toFixed(1)}K
            </Text>
            <Text style={styles.statUnit}>LBS</Text>
          </View>
        </View>

        {/* Terminal Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.terminalButton, showForm ]}
            onPress={() => setShowForm(!showForm)}
          >
            <Text style={styles.terminalButtonText}>
              {showForm ? "> ABORT LOGGING" : "> INITIATE LOGGING SEQUENCE"}
            </Text>
          </TouchableOpacity>
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

        {/* Mission History */}
        <View style={styles.workoutsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>[ RECENT MISSION LOGS ]</Text>
            {workouts.length > 5 && (
              <TouchableOpacity onPress={() => navigation.navigate("History")}>
                <Text style={styles.viewAllText}>VERIFY ALL ARCHIVES</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentWorkouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>NO ARCHIVES FOUND</Text>
              <Text style={styles.emptySubtitle}>
                COMMENCE TRAINING TO GENERATE LOGS
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
  scanline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    zIndex: 999,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginTop: SPACING.md,
    fontSize: SIZES.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  terminalUser: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.primary,
    marginTop: SPACING.xs,
    opacity: 0.8,
  },
  subtitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xs,
    color: COLORS.primary,
    marginTop: 2,
  },
  vaultBoyHeader: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
  },
  sectionHeader: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.md,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.primary,
    opacity: 0.7,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xxl,
    color: COLORS.primary,
  },
  statUnit: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.primary,
    marginTop: -4,
  },
  controlsContainer: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  terminalButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
  },
  terminalButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontSize: SIZES.sm,
  },
  formContainer: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  workoutsContainer: {
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
    padding: SPACING.xl,
    minHeight: 400,
  },
  viewAllText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xs,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: SPACING.xxxl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.md,
    color: COLORS.primary,
  },
  emptySubtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.primary,
    marginTop: SPACING.sm,
    textAlign: "center",
    opacity: 0.7,
  },
});
