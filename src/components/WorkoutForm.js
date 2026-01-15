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
  const [formData, setFormData] = useState({
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = () => {
    if (
      !formData.exercise ||
      !formData.sets ||
      !formData.reps ||
      !formData.weight
    ) {
      alert("Please fill in all fields");
      return;
    }

    onSubmit({
      id: Date.now(),
      exercise: formData.exercise,
      sets: parseInt(formData.sets),
      reps: parseInt(formData.reps),
      weight: parseFloat(formData.weight),
      date: formData.date,
    });

    setFormData({
      exercise: "",
      sets: "",
      reps: "",
      weight: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log Workout</Text>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Exercise Name</Text>
          <TextInput
            style={styles.input}
            value={formData.exercise}
            onChangeText={(text) =>
              setFormData({ ...formData, exercise: text })
            }
            placeholder="e.g., Bench Press"
            placeholderTextColor={COLORS.textLighter}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.flex1]}>
            <Text style={styles.label}>Sets</Text>
            <TextInput
              style={styles.input}
              value={formData.sets}
              onChangeText={(text) => setFormData({ ...formData, sets: text })}
              placeholder="3"
              keyboardType="numeric"
              placeholderTextColor={COLORS.textLighter}
            />
          </View>

          <View style={[styles.inputGroup, styles.flex1]}>
            <Text style={styles.label}>Reps</Text>
            <TextInput
              style={styles.input}
              value={formData.reps}
              onChangeText={(text) => setFormData({ ...formData, reps: text })}
              placeholder="10"
              keyboardType="numeric"
              placeholderTextColor={COLORS.textLighter}
            />
          </View>

          <View style={[styles.inputGroup, styles.flex1]}>
            <Text style={styles.label}>Weight</Text>
            <TextInput
              style={styles.input}
              value={formData.weight}
              onChangeText={(text) =>
                setFormData({ ...formData, weight: text })
              }
              placeholder="135"
              keyboardType="decimal-pad"
              placeholderTextColor={COLORS.textLighter}
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleSubmit}>
          <LinearGradient
            colors={[COLORS.gradient1, COLORS.gradient2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Save Workout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: "700",
    color: COLORS.text,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: "600",
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
  row: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  flex1: {
    flex: 1,
  },
  submitButton: {
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: "center",
    marginTop: SPACING.md,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: "700",
  },
});
