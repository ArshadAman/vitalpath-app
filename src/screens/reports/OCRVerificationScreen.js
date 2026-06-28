import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/theme';

export default function OCRVerificationScreen({ onConfirm, onCancel }) {
  const [uploading, setUploading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Mock values extracted
  const [hba1c, setHba1c] = useState('5.7');
  const [cholesterol, setCholesterol] = useState('192');
  const [systolic, setSystolic] = useState('118');
  const [diastolic, setDiastolic] = useState('79');

  const [btnPressed, setBtnPressed] = useState(false);

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    Haptics.impactAsync(style);
  };

  // Simulate progress loader
  useEffect(() => {
    if (uploading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setUploading(false);
            }, 500);
            return 100;
          }
          return prev + 20;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [uploading]);

  const handleSave = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm({
      title: 'Lab Blood Panel Checked',
      category: 'reports',
      description: `Verified OCR extraction. HbA1c: ${hba1c}%, Cholesterol: ${cholesterol} mg/dL, BP: ${systolic}/${diastolic} mmHg.`,
      value: `HbA1c: ${hba1c}%`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      scoreChange: 4 
    });
  };

  if (uploading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.secondary} style={{ marginBottom: 20 }} />
        <Text style={styles.loadingTitle}>Uploading Lab Report...</Text>
        <Text style={styles.loadingText}>Simulating OCR data extraction engine...</Text>
        
        {/* Mock progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressPct}>{progress}%</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Extraction</Text>
          <Text style={styles.subtitle}>Review and correct values extracted from the document</Text>
        </View>

        {/* Verification Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Detected Parameters</Text>
          
          {/* HbA1c */}
          <View style={styles.inputRow}>
            <View style={styles.inputLabelBox}>
              <Text style={styles.inputLabel}>HbA1c (%)</Text>
              <Text style={styles.rangeText}>Normal: &lt; 5.7%</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={hba1c}
              onChangeText={setHba1c}
              keyboardType="numeric"
            />
          </View>

          {/* Cholesterol */}
          <View style={styles.inputRow}>
            <View style={styles.inputLabelBox}>
              <Text style={styles.inputLabel}>Cholesterol (mg/dL)</Text>
              <Text style={styles.rangeText}>Normal: &lt; 200</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={cholesterol}
              onChangeText={setCholesterol}
              keyboardType="numeric"
            />
          </View>

          {/* Blood Pressure */}
          <View style={styles.inputRow}>
            <View style={styles.inputLabelBox}>
              <Text style={styles.inputLabel}>Blood Pressure (mmHg)</Text>
              <Text style={styles.rangeText}>Normal: &lt; 120/80</Text>
            </View>
            <View style={styles.bpInputs}>
              <TextInput
                style={[styles.textInput, { width: 60 }]}
                value={systolic}
                onChangeText={setTransitionHaptic(setSystolic)}
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={styles.bpSlash}>/</Text>
              <TextInput
                style={[styles.textInput, { width: 60 }]}
                value={diastolic}
                onChangeText={setTransitionHaptic(setDiastolic)}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.btnCancel]} 
            onPress={() => { triggerHaptic(); onCancel(); }}
          >
            <Text style={styles.btnCancelText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPressIn={() => setBtnPressed(true)}
            onPressOut={() => setBtnPressed(false)}
            onPress={handleSave}
            style={[
              styles.actionBtn,
              styles.btnConfirm,
              btnPressed ? styles.btnConfirmActive : styles.btnConfirmNormal
            ]}
          >
            <Text style={styles.btnConfirmText}>Verify & Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  function setTransitionHaptic(setter) {
    return (val) => {
      triggerHaptic();
      setter(val);
    };
  }
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 6,
    marginBottom: 24,
  },
  progressTrack: {
    width: '80%',
    height: 12,
    backgroundColor: '#f0eded',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
  },
  progressPct: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.secondary,
    marginTop: 8,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '700',
    lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderBottomWidth: 6,
    borderBottomColor: COLORS.border,
    padding: 16,
    marginBottom: 24,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 14,
  },
  inputLabelBox: {
    flexDirection: 'column',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  rangeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  textInput: {
    width: 80,
    height: 40,
    backgroundColor: '#f5f3f2',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  bpInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bpSlash: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textMuted,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 16,
  },
  actionBtn: {
    flex: 1,
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  btnCancel: {
    backgroundColor: '#ffffff',
    borderColor: COLORS.border,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.border,
  },
  btnCancelText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  btnConfirm: {
    backgroundColor: COLORS.primary,
  },
  btnConfirmNormal: {
    borderColor: COLORS.primaryShadow,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primaryShadow,
  },
  btnConfirmActive: {
    borderColor: COLORS.primary,
    borderBottomWidth: 0,
    transform: [{ translateY: 4 }],
  },
  btnConfirmText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#ffffff',
  },
});
