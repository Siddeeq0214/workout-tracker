import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../services/storage';
import { COLORS, SIZES, SPACING, RADIUS, FONTS } from '../constants/colors';

const { width } = Dimensions.get('window');

const ConfigModal = ({ visible, currentDetails, onClose, onSave }) => {
  const [details, setDetails] = useState(currentDetails || {
    gymName: '',
    amount: '',
    dueDay: '',
  });

  useEffect(() => {
    if (visible && currentDetails) {
      setDetails(currentDetails);
    }
  }, [visible, currentDetails]);

  const handleSave = () => {
    onSave({
      ...details,
      amount: parseFloat(details.amount) || 0,
      dueDay: parseInt(details.dueDay) || 1,
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
            <Text style={styles.modalTitle}>[ ACCESS_CONFIGURATION ]</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>FACILITY_NAME</Text>
              <TextInput
                style={styles.modalInput}
                value={details.gymName}
                onChangeText={(text) => setDetails({ ...details, gymName: text })}
                placeholder="ENTER NAME"
                placeholderTextColor="rgba(0, 255, 65, 0.3)"
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>MONTHLY_COST ($)</Text>
              <TextInput
                style={styles.modalInput}
                value={details.amount.toString()}
                onChangeText={(text) => setDetails({ ...details, amount: text })}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="rgba(0, 255, 65, 0.3)"
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>BILLING_DAY (1-31)</Text>
              <TextInput
                style={styles.modalInput}
                value={details.dueDay.toString()}
                onChangeText={(text) => setDetails({ ...details, dueDay: text })}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor="rgba(0, 255, 65, 0.3)"
              />
            </View>
          </View>

          <TouchableOpacity onPress={handleSave} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>INITIALIZE PROTOCOL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export const PaymentScreen = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await StorageService.getPaymentDetails();
      if (data) {
        setDetails(data);
        calculateDaysRemaining(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateDaysRemaining = (data) => {
    if (!data || !data.dueDay) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); 

    let targetDueDate = new Date(currentYear, currentMonth, data.dueDay);
    targetDueDate.setHours(0, 0, 0, 0);

    if (targetDueDate.getMonth() !== currentMonth) {
         targetDueDate = new Date(currentYear, currentMonth + 1, 0); 
    }


    if (data.lastPaidDate) {
        const lastPaid = new Date(data.lastPaidDate);
        lastPaid.setHours(0, 0, 0, 0);
        
        const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
        
        if (lastPaid >= startOfCurrentMonth) {

            targetDueDate = new Date(currentYear, currentMonth + 1, data.dueDay);

             if (targetDueDate.getMonth() !== (currentMonth + 1) % 12) {
                targetDueDate = new Date(currentYear, currentMonth + 2, 0);
            }
        }
    }

    const diffTime = targetDueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    setDaysRemaining(diffDays);
  };
  
  const handleSaveConfig = async (newDetails) => {
    const updated = { ...details, ...newDetails };
    await StorageService.savePaymentDetails(updated);
    setDetails(updated);
    calculateDaysRemaining(updated);
  };

  const handlePaymentComplete = async () => {
    const today = new Date().toISOString();
    const updated = { ...details, lastPaidDate: today };
    await StorageService.savePaymentDetails(updated);
    setDetails(updated);
    calculateDaysRemaining(updated);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.loadingText}>INITIALIZING...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.scanline} pointerEvents="none" />
      
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>[ MEMBERSHIP_LOG ]</Text>
        </View>
        <Text style={styles.subtitle}>RECURRING EXPENDITURE TRACKING</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!details ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={64} color={COLORS.primary} style={{ opacity: 0.5 }} />
            <Text style={styles.emptyText}>NO DATA STREAM</Text>
            <TouchableOpacity 
              style={styles.setupButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.setupButtonText}>CONFIGURE PROTOCOL</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Status Card */}
            <View style={styles.statusCard}>
              <Text style={styles.label}>STATUS_INDICATOR</Text>
              <View style={styles.timerContainer}>
                <Text style={[styles.timerValue, daysRemaining < 0 && styles.timerValueOverdue]}>
                  {Math.abs(daysRemaining)}
                </Text>
                <Text style={[styles.timerUnit, daysRemaining < 0 && styles.timerUnitOverdue]}>
                  {daysRemaining < 0 ? 'DAYS OVERDUE' : 'DAYS REMAINING'}
                </Text>
              </View>
              <View style={styles.progressBar}>
                 {/* 
                    If overdue, bar is full and red? 
                    If remaining, calculate percent of 30 days 
                 */}
                <View 
                    style={[
                        styles.progressFill, 
                        daysRemaining < 0 && styles.progressFillOverdue,
                        daysRemaining >= 0 && { width: `${Math.min((30 - daysRemaining)/30 * 100, 100)}%` }
                    ]} 
                />
              </View>
            </View>

            {/* Details Card */}
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <View>
                  <Text style={styles.label}>FACILITY_ID</Text>
                  <Text style={styles.value}>{details.gymName.toUpperCase()}</Text>
                </View>
                <Ionicons name="business-outline" size={24} color={COLORS.primary} />
              </View>
              
              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <View>
                  <Text style={styles.label}>MONTHLY_EXPENDITURE</Text>
                  <Text style={styles.value}>${details.amount.toFixed(2)}</Text>
                </View>
                <Ionicons name="cash-outline" size={24} color={COLORS.primary} />
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <View>
                  <Text style={styles.label}>BILLING_CYCLE_DAY</Text>
                  <Text style={styles.value}>DAY {details.dueDay}</Text>
                </View>
                <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
              </View>
            </View>

            {/* Actions */}
            <TouchableOpacity style={styles.payButton} onPress={handlePaymentComplete}>
              <View style={styles.payButtonContent}>
                <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.background} />
                <Text style={styles.payButtonText}>LOG PAYMENT</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.configButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.configButtonText}>MODIFY CONFIGURATION</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <ConfigModal
        visible={modalVisible}
        currentDetails={details}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveConfig}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingBottom: 0,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: FONTS.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xs,
    color: COLORS.primary,
    marginTop: SPACING.xs,
    opacity: 0.8,
  },
  content: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  loadingText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontSize: SIZES.md,
  },
  
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: SPACING.lg,
  },
  emptyText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.lg,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  setupButton: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.sm,
  },
  setupButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },

  statusCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  timerValue: {
    fontFamily: FONTS.bold,
    fontSize: 64,
    color: COLORS.primary,
    lineHeight: 70,
  },
  timerValueOverdue: {
    color: '#FF003C',
  },
  timerUnit: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.sm,
    color: COLORS.primary,
    letterSpacing: 2,
    opacity: 0.8,
  },
  timerUnitOverdue: {
    color: '#FF003C',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: 2,
    marginTop: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressFillOverdue: {
    width: '100%',
    backgroundColor: '#FF003C',
  },

  detailsCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.3)',
    borderRadius: RADIUS.sm,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    marginVertical: SPACING.md,
  },
  label: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.primary,
    opacity: 0.6,
    marginBottom: 4,
  },
  value: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.md,
    color: COLORS.primary,
  },

  payButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  payButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.md,
    color: COLORS.background,
  },
  configButton: {
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.3)',
    borderRadius: RADIUS.sm,
  },
  configButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.sm,
    color: COLORS.primary,
    opacity: 0.8,
  },

  // Modal Styles
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
    fontFamily: FONTS.bold,
    fontSize: SIZES.md,
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
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  modalInput: {
    fontFamily: FONTS.bold,
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    fontSize: SIZES.base,
    color: COLORS.primary,
  },
  modalButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: SPACING.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
  },
  modalButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontSize: SIZES.md,
  },
});
