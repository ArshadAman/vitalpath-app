import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function DashboardTab({ profileData, addLogEntry, simulatedLocation, triggerLocationSim }) {
  // Score formula based on profile data
  const calculateScore = () => {
    let base = 85;
    if (!profileData) return 78; // Default mock score
    if (profileData.diabetes) base -= 10;
    if (profileData.hypertension) base -= 8;
    if (profileData.heartDisease) base -= 12;
    if (profileData.smoking === 'regular') base -= 15;
    if (profileData.smoking === 'occasional') base -= 5;
    if (profileData.activity === 'sedentary') base -= 10;
    if (profileData.activity === 'active') base += 5;
    return Math.min(100, Math.max(30, base));
  };

  const score = calculateScore();
  const actualAge = profileData?.age || 31;
  const bioAgeOffset = profileData?.activity === 'active' ? -3 : profileData?.smoking === 'regular' ? +4 : -2;
  const biologicalAge = actualAge + bioAgeOffset;

  // Vector animations & display score speedometer increments
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Reset to 0
    animatedValue.setValue(0);
    setDisplayScore(0);

    const listenerId = animatedValue.addListener(({ value }) => {
      setDisplayScore(Math.round(value));
    });

    Animated.timing(animatedValue, {
      toValue: score,
      duration: 1600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, [score]);

  // Stroke math mapping
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const [nutriProgress, setNutriProgress] = useState(65);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    Haptics.impactAsync(style);
  };

  // Dynamic colors based on score value
  const getScoreColor = (val) => {
    if (val >= 80) return COLORS.primary; // Green
    if (val >= 50) return '#d97706';      // Orange
    return '#dc2626';                     // Red
  };

  const getScoreRangeLabel = (val) => {
    if (val >= 80) return 'Optimal Range';
    if (val >= 50) return 'Moderate Risk';
    return 'Critical Risk';
  };

  const getScoreRangeBg = (val) => {
    if (val >= 80) return COLORS.primaryContainer;
    if (val >= 50) return '#fef3c7'; // Light amber
    return '#fee2e2'; // Light red
  };

  const activeColor = getScoreColor(score);
  const rangeLabel = getScoreRangeLabel(score);
  const rangeBg = getScoreRangeBg(score);

  const handleLocationAction = (confirm) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    if (confirm) {
      const eventTitle = simulatedLocation === 'Gym' ? 'Cardio Workout (Gold\'s Gym)' : 'Smoking Event';
      const eventCategory = simulatedLocation === 'Gym' ? 'vitals' : 'logs';
      const eventDesc = simulatedLocation === 'Gym' 
        ? 'Workout confirmed via geofence engine. 45 min core session logged.'
        : 'Tobacco exposure logged via geofence dwell indicator.';
      const scoreModifier = simulatedLocation === 'Gym' ? 2 : -4;

      addLogEntry({
        title: eventTitle,
        category: eventCategory,
        description: eventDesc,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: simulatedLocation === 'Gym' ? '45 min' : '1 count',
        scoreChange: scoreModifier
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Log Added', 
        simulatedLocation === 'Gym' 
          ? 'Great job! Workout registered on your timeline.' 
          : 'Event logged. Tracking habits helps support your health targets.'
      );
    }
    setShowLocationPrompt(false);
  };

  const showScoreInfo = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Vital Health Score Engine',
      `Your score represents your preventive health trajectory, calculated via backend algorithms:\n\n` +
      `• Base Engine Rate: 85\n` +
      `• Physical Activity: +5 for active habits, -10 for sedentary lifestyles.\n` +
      `• Smoking habits: -15 reduction for active tobacco exposure.\n` +
      `• Diagnosed Diabetes: -10 reduction.\n` +
      `• Hypertension (High BP): -8 reduction.\n` +
      `• Heart Disease: -12 reduction.\n\n` +
      `Confirming workout events or calibrating targets will dynamically shift your trajectory.`,
      [{ text: 'Got it', onPress: () => triggerHaptic() }]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Health Score Circular SVG ring */}
      <View style={styles.scoreContainer}>
        <View style={styles.ringWrapper}>
          <Svg width={220} height={220} viewBox="0 0 120 120">
            {/* Background Ring */}
            <Circle cx="60" cy="60" r={radius} fill="none" stroke="#f0eded" strokeWidth={8} />
            {/* Active progress stroke */}
            <AnimatedCircle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={activeColor}
              strokeWidth={8}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation={-90}
              origin="60, 60"
            />
            {/* Outer dashes details */}
            <Circle
              cx="60"
              cy="60"
              r={46}
              fill="none"
              stroke={COLORS.border}
              strokeWidth={0.5}
              strokeDasharray="3 5"
              opacity={0.6}
            />
          </Svg>
          
          <View style={styles.innerScoreBox}>
            <View style={styles.scoreTextRow}>
              <Text style={styles.scoreText}>{displayScore}</Text>
              <Text style={styles.scoreSlash}>/100</Text>
            </View>
            
            <View style={styles.scoreLabelRow}>
              <Text style={styles.scoreLabel}>Health Score</Text>
              <TouchableOpacity onPress={showScoreInfo} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Feather name="info" size={11} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={[styles.rangePill, { backgroundColor: rangeBg }]}>
              <Text style={[styles.rangePillText, { color: activeColor }]}>{rangeLabel}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Biological Age Offset Card */}
      <View style={styles.bioCard}>
        <View style={styles.bioLeft}>
          <Text style={styles.bioLabel}>Biological Age</Text>
          <View style={styles.bioAgeRow}>
            <Text style={styles.bioAgeText}>{biologicalAge}</Text>
            <Text style={styles.bioAgeUnits}>Years</Text>
          </View>
        </View>
        <View style={styles.bioRight}>
          <View style={[
            styles.offsetPill, 
            { backgroundColor: bioAgeOffset < 0 ? COLORS.primaryContainer : '#fef2f2' }
          ]}>
            <Text style={[
              styles.offsetPillText,
              { color: bioAgeOffset < 0 ? COLORS.primary : COLORS.red }
            ]}>
              {bioAgeOffset < 0 ? `${bioAgeOffset} Years` : `+${bioAgeOffset} Years`} {bioAgeOffset < 0 ? '▼' : '▲'}
            </Text>
          </View>
          <Text style={styles.actualAgeText}>Actual Age: {actualAge}</Text>
        </View>
      </View>

      {/* Background Location Prompt Widget */}
      {showLocationPrompt && (
        <View style={styles.promptCard}>
          <View style={styles.promptHeader}>
            <View style={styles.promptIconCircle}>
              <Feather name="map-pin" size={18} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.promptTitle}>Location Triggered</Text>
              <Text style={styles.promptSubtitle}>
                {simulatedLocation === 'Gym'
                  ? 'We noticed you spent 45 min near Gold\'s Gym.'
                  : 'We noticed a visit near Tobacco Outlet.'}
              </Text>
            </View>
          </View>
          <Text style={styles.promptQuestion}>
            {simulatedLocation === 'Gym'
              ? 'Confirm workout activity to add to timeline?'
              : 'Record tobacco consumption log?'}
          </Text>
          <View style={styles.promptActionRow}>
            <TouchableOpacity 
              style={[styles.promptBtn, styles.promptBtnNo]} 
              onPress={() => handleLocationAction(false)}
            >
              <Text style={styles.promptBtnNoText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.promptBtn, styles.promptBtnYes]} 
              onPress={() => handleLocationAction(true)}
            >
              <Text style={styles.promptBtnYesText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Action Recommendation Cards Row */}
      <View style={styles.recommendationsHeader}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <TouchableOpacity 
          style={styles.simLinkRow}
          onPress={() => { triggerHaptic(); triggerLocationSim(); setShowLocationPrompt(true); }}
        >
          <Text style={styles.simLink}>Simulate Travel</Text>
          <Feather name="arrow-right" size={14} color={COLORS.primary} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardsRow}>
        {/* Nutrition Card */}
        <View style={styles.recommendationCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBox}>
              <Feather name="droplet" size={14} color={COLORS.primary} />
            </View>
            <Text style={styles.cardLabel}>Nutrition Focus</Text>
          </View>
          <Text style={styles.cardTitle}>Optimal Intake for Recovery</Text>
          <Text style={styles.cardDesc}>
            • Balanced macros (Veg){'\n'}
            • Focus on Leafy Greens{'\n'}
            • Hydration: 2.8L/day
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Goal Progress</Text>
              <Text style={styles.progressValue}>{nutriProgress}%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${nutriProgress}%` }]} />
            </View>
          </View>
        </View>

        {/* Exercise Card */}
        <View style={styles.recommendationCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBox}>
              <Feather name="activity" size={14} color={COLORS.primary} />
            </View>
            <Text style={styles.cardLabel}>Cardio & Tone</Text>
          </View>
          <Text style={styles.cardTitle}>Strength Training Day</Text>
          <Text style={styles.cardDesc}>
            • Upper Body Session{'\n'}
            • 45 minute workouts{'\n'}
            • HIIT Finisher at 6pm
          </Text>
          <View style={styles.scheduleChip}>
            <Text style={styles.scheduleText}>Scheduled: Today 6:00 PM</Text>
          </View>
        </View>
      </View>

      {/* Quick Metrics Selector */}
      <View style={styles.metricsHeader}>
        <Text style={styles.sectionTitle}>Quick Status Metrics</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricsScrollView} contentContainerStyle={styles.metricsContainer}>
        <TouchableOpacity style={styles.metricBtn} onPress={() => triggerHaptic()}>
          <Feather name="heart" size={20} color={COLORS.primary} />
          <Text style={styles.metricBtnText}>Vitals</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.metricBtn} onPress={() => triggerHaptic()}>
          <Feather name="trending-up" size={20} color={COLORS.orange} />
          <Text style={styles.metricBtnText}>Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.metricBtn} onPress={() => triggerHaptic()}>
          <Feather name="moon" size={20} color={COLORS.purple} />
          <Text style={styles.metricBtnText}>Sleep</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.metricBtn} onPress={() => triggerHaptic()}>
          <Feather name="info" size={20} color={COLORS.secondary} />
          <Text style={styles.metricBtnText}>Insights</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  ringWrapper: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  innerScoreBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scoreTextRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreText: {
    fontSize: 44,
    fontWeight: '900',
    color: COLORS.text,
  },
  scoreSlash: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  scoreLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
  },
  rangePill: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 99,
  },
  rangePillText: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bioCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderBottomWidth: 5,
    borderBottomColor: COLORS.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bioLeft: {
    flexDirection: 'column',
  },
  bioLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  bioAgeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  bioAgeText: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  bioAgeUnits: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  bioRight: {
    alignItems: 'flex-end',
  },
  offsetPill: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  offsetPillText: {
    fontSize: 13,
    fontWeight: '900',
  },
  actualAgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginTop: 4,
  },
  promptCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primaryShadow,
    borderBottomWidth: 5,
    borderBottomColor: COLORS.primaryShadow,
    padding: 16,
    marginBottom: 20,
  },
  promptHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  promptIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
  },
  promptSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  promptQuestion: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    marginVertical: 14,
    textAlign: 'center',
  },
  promptActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  promptBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  promptBtnNo: {
    backgroundColor: '#ffffff',
    borderColor: COLORS.border,
    borderBottomColor: '#dcd9d9',
  },
  promptBtnNoText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  promptBtnYes: {
    backgroundColor: COLORS.primaryShadow,
    borderColor: '#ffffff',
    borderBottomColor: '#ffffff',
  },
  promptBtnYesText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  recommendationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  simLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  simLink: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  recommendationCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.border,
    padding: 12,
    minHeight: 220,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f5f3f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
    marginVertical: 8,
  },
  cardDesc: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  progressValue: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#f0eded',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  scheduleChip: {
    backgroundColor: '#f5f3f2',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  scheduleText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.text,
  },
  metricsHeader: {
    marginBottom: 10,
  },
  metricsScrollView: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 8,
  },
  metricBtn: {
    width: 100,
    height: 72,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  metricBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
});
