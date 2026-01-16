import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES, SPACING, RADIUS } from "../constants/colors";

export const WorkoutForm = ({ onSubmit, onCancel }) => {
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState([{ id: Date.now(), reps: "", weight: "" }]);
  const [date] = useState(new Date().toISOString().split("T")[0]);

  const addSet = () => {
    setSets([...sets, { id: Date.now(), reps: "", weight: "" }]);
  };

  const removeSet = (id) => {
    if (sets.length > 1) {
      setSets(sets.filter((s) => s.id !== id));
    }
  };

  const updateSet = (id, field, value) => {
    setSets(
      sets.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = () => {
    if (!exercise || sets.some(s => !s.reps || !s.weight)) {
      alert("Please fill in exercise name and all set details");
      return;
    }

    const formattedSets = sets.map(s => ({
      reps: parseInt(s.reps),
      weight: parseFloat(s.weight)
    }));

    // Calculate totals for backward compatibility or quick display
    const totalSets = formattedSets.length;
    const avgReps = formattedSets.reduce((sum, s) => sum + s.reps, 0) / totalSets;
    const maxWeight = Math.max(...formattedSets.map(s => s.weight));

    onSubmit({
      id: Date.now(),
      exercise,
      sets: formattedSets,
      totalSets,
      avgReps,
      maxWeight,
      date,
    });

    setExercise("");
    setSets([{ id: Date.now(), reps: "", weight: "" }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.scanline} pointerEvents="none" />
      <View style={styles.header}>
        <Text style={styles.title}>[ MISSION_ENTRY ]</Text>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>OBJECTIVE_ID</Text>
          <TextInput
            style={styles.input}
            value={exercise}
            onChangeText={setExercise}
            placeholder="ENTER EXERCISE NAME..."
            placeholderTextColor="rgba(0, 255, 65, 0.3)"
          />
        </View>

        <View style={styles.setsHeader}>
          <Text style={styles.label}>ITERATIONS</Text>
          <TouchableOpacity onPress={addSet} style={styles.addSetTextButton}>
            <Text style={styles.addSetText}>{">> ADD_SET"}</Text>
          </TouchableOpacity>
        </View>

        {sets.map((set, index) => (
          <View key={set.id} style={styles.setRow}>
            <View style={styles.setNumberContainer}>
              <Text style={styles.setNumber}>{(index + 1).toString().padStart(2, '0')}</Text>
            </View>
            
            <View style={styles.setInputWrap}>
              <Text style={styles.fieldLabel}>REPS</Text>
              <TextInput
                style={styles.setField}
                value={set.reps}
                onChangeText={(text) => updateSet(set.id, "reps", text)}
                placeholder="00"
                keyboardType="numeric"
                placeholderTextColor="rgba(0, 255, 65, 0.3)"
              />
            </View>

            <View style={styles.setInputWrap}>
              <Text style={styles.fieldLabel}>LBS</Text>
              <TextInput
                style={styles.setField}
                value={set.weight}
                onChangeText={(text) => updateSet(set.id, "weight", text)}
                placeholder="0.0"
                keyboardType="decimal-pad"
                placeholderTextColor="rgba(0, 255, 65, 0.3)"
              />
            </View>

            <TouchableOpacity 
              onPress={() => removeSet(set.id)}
              disabled={sets.length === 1}
              style={[styles.removeButton, sets.length === 1 && styles.disabledAction]}
            >
              <Ionicons name="trash" size={18} color={sets.length === 1 ? 'rgba(0, 255, 65, 0.1)' : COLORS.primary} />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>INITIALIZE_LOG</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.sm,
    padding: SPACING.xl,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
    opacity: 0.8,
  },
  input: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    fontSize: SIZES.base,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  setsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  addSetTextButton: {
    padding: 4,
  },
  addSetText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 10,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.2)',
  },
  setNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  setNumber: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "bold",
  },
  setInputWrap: {
    flex: 1,
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.primary,
    opacity: 0.5,
    marginBottom: 2,
  },
  setField: {
    fontSize: SIZES.md,
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: "center",
    width: '100%',
    padding: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 65, 0.2)',
  },
  removeButton: {
    padding: 4,
  },
  disabledAction: {
    opacity: 0.2,
  },
  submitButton: {
    marginTop: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: SPACING.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
  },
  submitButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.md,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
