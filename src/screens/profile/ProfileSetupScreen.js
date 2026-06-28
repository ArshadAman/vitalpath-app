import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/theme';

export default function ProfileSetupScreen({ onSave }) {
  const [age, setAge] = useState('28');
  const [gender, setGender] = useState('female'); // 'male', 'female', 'other'
  const [height, setHeight] = useState(175); // cm
  const [weight, setWeight] = useState(72);  // kg
  const [bloodGroup, setBloodGroup] = useState('O+');
  
  // Custom Targets
  const [waterTarget, setWaterTarget] = useState(2500); // ml
  const [sleepTarget, setSleepTarget] = useState(8); // hours

  // Clinical Details
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  
  // Medical history
  const [diabetes, setDiabetes] = useState(false);
  const [hypertension, setHypertension] = useState(false);
  const [heartDisease, setHeartDisease] = useState(false);
  const [strokeHistory, setStrokeHistory] = useState(false);
  
  // Lifestyle habits
  const [smoking, setSmoking] = useState('none'); 
  const [activity, setActivity] = useState('active'); 
  const [diet, setDiet] = useState('balanced'); 

  const [btnPressed, setBtnPressed] = useState(false);

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    Haptics.impactAsync(style);
  };

  const handleSubmit = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Validation Error', 'Please enter a valid age.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave({
      age: ageNum,
      gender,
      height,
      weight,
      bloodGroup,
      waterTarget,
      sleepTarget,
      allergies,
      medications,
      diabetes,
      hypertension,
      heartDisease,
      strokeHistory,
      smoking,
      activity,
      diet,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Profile</Text>
          <Text style={styles.subtitle}>Let's calibrate your preventive health path</Text>
        </View>

        {/* 1. Demographics & Biometrics */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. Biometrics & Identity</Text>
          
          <Text style={styles.label}>Gender</Text>
          <View style={[styles.toggleRow, { marginBottom: 16 }]}>
            {['male', 'female', 'other'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.toggleBtn, gender === item && styles.toggleBtnActive]}
                onPress={() => { triggerHaptic(); setGender(item); }}
              >
                <Text style={[styles.toggleBtnText, gender === item && styles.toggleBtnTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Age (Years)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={age}
                onChangeText={setAge}
                maxLength={3}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Blood Group</Text>
              <TextInput
                style={styles.textInput}
                value={bloodGroup}
                onChangeText={setBloodGroup}
                maxLength={3}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Height Control */}
          <Text style={styles.label}>Height: <Text style={styles.valueText}>{height} cm</Text></Text>
          <View style={styles.sliderControl}>
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={() => { triggerHaptic(); setHeight(Math.max(120, height - 1)); }}
            >
              <Text style={styles.controlBtnText}>-</Text>
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${((height - 120) / 100) * 100}%` }]} />
            </View>
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={() => { triggerHaptic(); setHeight(Math.min(220, height + 1)); }}
            >
              <Text style={styles.controlBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Weight Control */}
          <Text style={styles.label}>Weight: <Text style={styles.valueText}>{weight} kg</Text></Text>
          <View style={styles.sliderControl}>
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={() => { triggerHaptic(); setWeight(Math.max(30, weight - 1)); }}
            >
              <Text style={styles.controlBtnText}>-</Text>
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${((weight - 30) / 120) * 100}%` }]} />
            </View>
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={() => { triggerHaptic(); setWeight(Math.min(150, weight + 1)); }}
            >
              <Text style={styles.controlBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Target Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Daily Target Goals</Text>

          {/* Water Target */}
          <Text style={styles.label}>Daily Water Target: <Text style={styles.valueText}>{waterTarget} ml</Text></Text>
          <View style={styles.sliderControl}>
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={() => { triggerHaptic(); setWaterTarget(Math.max(1000, waterTarget - 250)); }}
            >
              <Text style={styles.controlBtnText}>-</Text>
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${((waterTarget - 1000) / 4000) * 100}%`, backgroundColor: COLORS.secondary }]} />
            </View>
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={() => { triggerHaptic(); setWaterTarget(Math.min(5000, waterTarget + 250)); }}
            >
              <Text style={styles.controlBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Sleep Target */}
          <Text style={styles.label}>Daily Sleep Target: <Text style={styles.valueText}>{sleepTarget} Hours</Text></Text>
          <View style={styles.sliderControl}>
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={() => { triggerHaptic(); setSleepTarget(Math.max(4, sleepTarget - 0.5)); }}
            >
              <Text style={styles.controlBtnText}>-</Text>
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${((sleepTarget - 4) / 8) * 100}%`, backgroundColor: COLORS.purple }]} />
            </View>
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={() => { triggerHaptic(); setSleepTarget(Math.min(12, sleepTarget + 0.5)); }}
            >
              <Text style={styles.controlBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Clinical Profile */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>3. Clinical & Allergies</Text>

          <Text style={styles.label}>Allergies (Peanuts, Gluten, etc.)</Text>
          <TextInput
            style={[styles.textInput, { textAlign: 'left', paddingHorizontal: 12, marginBottom: 12 }]}
            placeholder="e.g. None, Dairy, Penicillin"
            placeholderTextColor="#94a3b8"
            value={allergies}
            onChangeText={setAllergies}
          />

          <Text style={styles.label}>Current Medications</Text>
          <TextInput
            style={[styles.textInput, { textAlign: 'left', paddingHorizontal: 12 }]}
            placeholder="e.g. None, Metformin 500mg"
            placeholderTextColor="#94a3b8"
            value={medications}
            onChangeText={setMedications}
          />
        </View>

        {/* 4. Medical History */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>4. Medical Diagnoses</Text>
          <Text style={styles.cardDesc}>Select any conditions you have been diagnosed with:</Text>
          
          <TouchableOpacity 
            style={[styles.checkboxRow, diabetes && styles.checkboxActive]} 
            onPress={() => { triggerHaptic(); setDiabetes(!diabetes); }}
          >
            <View style={[styles.box, diabetes && styles.boxChecked]}>
              {diabetes && <Text style={styles.checkIcon}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Diabetes (Type I or II)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.checkboxRow, hypertension && styles.checkboxActive]} 
            onPress={() => { triggerHaptic(); setTransitionHaptic(setHypertension, hypertension); }}
          >
            <View style={[styles.box, hypertension && styles.boxChecked]}>
              {hypertension && <Text style={styles.checkIcon}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Hypertension (High BP)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.checkboxRow, heartDisease && styles.checkboxActive]} 
            onPress={() => { triggerHaptic(); setHeartDisease(!heartDisease); }}
          >
            <View style={[styles.box, heartDisease && styles.boxChecked]}>
              {heartDisease && <Text style={styles.checkIcon}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Heart Disease History</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.checkboxRow, strokeHistory && styles.checkboxActive]} 
            onPress={() => { triggerHaptic(); setStrokeHistory(!strokeHistory); }}
          >
            <View style={[styles.box, strokeHistory && styles.boxChecked]}>
              {strokeHistory && <Text style={styles.checkIcon}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Stroke History</Text>
          </TouchableOpacity>
        </View>

        {/* 5. Lifestyle Choices */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>5. Lifestyle habits</Text>

          <Text style={styles.label}>Smoking Status</Text>
          <View style={styles.toggleRow}>
            {['none', 'occasional', 'regular'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.toggleBtn, smoking === item && styles.toggleBtnActive]}
                onPress={() => { triggerHaptic(); setSmoking(item); }}
              >
                <Text style={[styles.toggleBtnText, smoking === item && styles.toggleBtnTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 14 }]}>Daily Activity Level</Text>
          <View style={styles.toggleRow}>
            {['sedentary', 'light', 'active'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.toggleBtn, activity === item && styles.toggleBtnActive]}
                onPress={() => { triggerHaptic(); setActivity(item); }}
              >
                <Text style={[styles.toggleBtnText, activity === item && styles.toggleBtnTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 14 }]}>Primary Diet Focus</Text>
          <View style={styles.toggleRow}>
            {['balanced', 'vegetarian', 'vegan'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.toggleBtn, diet === item && styles.toggleBtnActive]}
                onPress={() => { triggerHaptic(); setDiet(item); }}
              >
                <Text style={[styles.toggleBtnText, diet === item && styles.toggleBtnTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity 
          onPressIn={() => setBtnPressed(true)}
          onPressOut={() => setBtnPressed(false)}
          onPress={handleSubmit}
          style={[
            styles.button,
            btnPressed ? styles.buttonActive : styles.buttonNormal
          ]}
        >
          <Text style={styles.buttonText}>CALIBRATE ENGINE  ➔</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  function setTransitionHaptic(setter, val) {
    triggerHaptic();
    setter(!val);
  }
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderBottomWidth: 6,
    borderBottomColor: COLORS.border,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  cardDesc: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  valueText: {
    color: COLORS.secondary,
    fontWeight: '900',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  col: {
    flex: 1,
  },
  textInput: {
    height: 48,
    backgroundColor: '#f5f3f2',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  sliderControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 22,
  },
  sliderTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#f0eded',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 8,
    backgroundColor: '#f5f3f2',
  },
  checkboxActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryContainer,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  boxChecked: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkIcon: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  toggleBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.border,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    borderColor: COLORS.secondary,
    borderBottomColor: COLORS.secondaryShadow,
    backgroundColor: COLORS.secondary,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  toggleBtnTextActive: {
    color: '#ffffff',
  },
  button: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonNormal: {
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primaryShadow,
    transform: [{ translateY: 0 }],
  },
  buttonActive: {
    borderBottomWidth: 0,
    transform: [{ translateY: 4 }],
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});
