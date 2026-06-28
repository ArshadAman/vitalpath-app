import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/theme';

export default function GoalsScreen({ goals, onAddGoal }) {
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCategory, setGoalCategory] = useState('habit'); // 'habit', 'vitals', 'activity'
  
  const [btnPressed, setBtnPressed] = useState(false);

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    Haptics.impactAsync(style);
  };

  const handleCreateGoal = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    if (!goalTitle.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please enter a goal title.');
      return;
    }
    if (!goalTarget.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please enter a target value.');
      return;
    }

    onAddGoal({
      title: goalTitle,
      target: goalTarget,
      current: '0',
      category: goalCategory,
      progress: 0,
      streak: 0
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Goal Activated', `Your new goal "${goalTitle}" has been set up!`);
    setGoalTitle('');
    setGoalTarget('');
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'activity': return COLORS.orange;
      case 'vitals': return COLORS.red;
      case 'habit': return COLORS.primary;
      default: return COLORS.secondary;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Goals & Targets</Text>
        <Text style={styles.subtitle}>Set preventive targets and track your consistency streaks.</Text>
      </View>

      {/* Active Goals list */}
      <Text style={styles.sectionTitle}>Active Goals</Text>
      <View style={styles.goalsList}>
        {goals.map((goal, index) => (
          <View key={index} style={styles.goalCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(goal.category) }]} />
              <Text style={styles.goalCardTitle}>{goal.title}</Text>
              
              <View style={styles.streakWrapper}>
                <Feather name="flame" size={14} color={COLORS.orange} style={{ marginRight: 4 }} />
                <Text style={styles.streakText}>Streak: {goal.streak || 0}d</Text>
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.statsRow}>
                <Text style={styles.currentVal}>{goal.current} <Text style={styles.targetVal}>/ {goal.target}</Text></Text>
                <Text style={styles.pctText}>{goal.progress}%</Text>
              </View>
              
              <View style={styles.progressTrack}>
                <View style={[
                  styles.progressFill, 
                  { width: `${goal.progress}%`, backgroundColor: getCategoryColor(goal.category) }
                ]} />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Goal Creation Form */}
      <View style={styles.createCard}>
        <Text style={styles.createCardTitle}>Create Custom Target</Text>

        <Text style={styles.label}>Goal Title</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Drink 3L of water, Sleep 8 hrs"
          placeholderTextColor="#94a3b8"
          value={goalTitle}
          onChangeText={setGoalTitle}
        />

        <Text style={styles.label}>Target Value</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. 3000 ml, 8 hrs, 10000 steps"
          placeholderTextColor="#94a3b8"
          value={goalTarget}
          onChangeText={setGoalTarget}
        />

        <Text style={styles.label}>Goal Category</Text>
        <View style={styles.toggleRow}>
          {['habit', 'vitals', 'activity'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.toggleBtn, goalCategory === cat && styles.toggleBtnActive]}
              onPress={() => { triggerHaptic(); setGoalCategory(cat); }}
            >
              <Text style={[styles.toggleBtnText, goalCategory === cat && styles.toggleBtnTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          onPressIn={() => setBtnPressed(true)}
          onPressOut={() => setBtnPressed(false)}
          onPress={handleCreateGoal}
          style={[
            styles.button,
            btnPressed ? styles.buttonActive : styles.buttonNormal
          ]}
        >
          <Text style={styles.buttonText}>ACTIVATE GOAL  ➔</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  header: {
    marginVertical: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '700',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  goalsList: {
    gap: 12,
    marginBottom: 24,
  },
  goalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.border,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  goalCardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },
  streakWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.orange,
  },
  progressSection: {
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  currentVal: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
  },
  targetVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  pctText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.text,
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#f0eded',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  createCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderBottomWidth: 6,
    borderBottomColor: COLORS.border,
    padding: 16,
    marginBottom: 20,
  },
  createCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 12,
  },
  textInput: {
    height: 48,
    backgroundColor: '#f5f3f2',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginTop: 4,
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
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
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
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
