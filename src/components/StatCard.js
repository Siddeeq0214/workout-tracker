import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SPACING, RADIUS } from '../constants/colors';
import { formatNumber } from '../utils/calculations';

export const StatCard = ({exercise, stats}) => {
    return(
        <View style={styles.container}>
            <Text style={styles.exercise}>[ {exercise.toUpperCase()} ]</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>MAX_WT</Text>
                    <Text style={styles.statValue}>{stats.maxWeight}</Text>
                    <Text style={styles.statUnit}>LBS</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>VOLUME</Text>
                    <Text style={styles.statValue}>{formatNumber(stats.totalVolume)}</Text>
                    <Text style={styles.statUnit}>LBS</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>SESSIONS</Text>
                    <Text style={styles.statValue}>{stats.count.toString().padStart(2, '0')}</Text>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: RADIUS.sm,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  exercise: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    letterSpacing: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.3)',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  statValue: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statUnit: {
    fontSize: 9,
    color: COLORS.primary,
    marginTop: -2,
    opacity: 0.6,
  },
});
