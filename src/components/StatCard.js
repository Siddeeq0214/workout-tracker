import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SPACING, RADIUS } from '../constants/colors';
import { formatNumber } from '../utils/calculations';

export const StatCard = ({exercise, stats}) => {
    return(
        <LinearGradient
        colors={[COLORS.gradient1, COLORS.gradient2]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.container}
        >
            <Text style={styles.exercise}>{exercise}</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Max Weight</Text>
                    <Text style={styles.statValue}>{stats.maxWeight}</Text>
                    <Text style={styles.statUnit}>lbs</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Volume</Text>
                    <Text style={styles.statValue}>{formatNumber(stats.totalVolume)}</Text>
                    <Text style={styles.statUnit}>lbs</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Sessions</Text>
                    <Text style={styles.statValue}>{stats.count}</Text>
                    <Text style={styles.statUnit}>total</Text>
                </View>
            </View>
        </LinearGradient>
    );
};


const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  exercise: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: SIZES.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.white,
  },
  statUnit: {
    fontSize: SIZES.xs,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
});