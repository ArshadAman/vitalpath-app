import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function OnboardingIntroScreen({ onFinish }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [btnPressed, setBtnPressed] = useState(false);

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const slides = [
    {
      id: 1,
      title: "Predictive Trajectory",
      description: "Calibrate your vital health score. Predict and modify biological aging vectors based on medical indicators.",
      iconName: "trending-up",
      color: COLORS.primary
    },
    {
      id: 2,
      title: "Voice Health Journal",
      description: "Log meals, habits, and symptoms naturally. AI extracts clinical intents and score adjustments from your spoken notes.",
      iconName: "mic",
      color: COLORS.secondary
    },
    {
      id: 3,
      title: "Geofenced Habit Tracking",
      description: "Secure, local dwell checks remind you to log activity when near gyms, and habits when near exposure points.",
      iconName: "map-pin",
      color: COLORS.orange
    }
  ];

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    Haptics.impactAsync(style);
  };

  const handleNext = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    if (activeSlide < slides.length - 1) {
      scrollViewRef.current.scrollTo({
        x: (activeSlide + 1) * width,
        animated: true
      });
      setActiveSlide(activeSlide + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onFinish(dontShowAgain);
    }
  };

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex !== activeSlide) {
      setActiveSlide(slideIndex);
      triggerHaptic();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Decorative Blur Blobs */}
      <View style={styles.blurBlobLeft} />
      <View style={styles.blurBlobRight} />

      {/* Header Skip */}
      <View style={styles.header}>
        <Text style={styles.appName}>VitalPath</Text>
        <TouchableOpacity onPress={() => { triggerHaptic(); onFinish(dontShowAgain); }}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Sliding Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {slides.map((slide, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [(index - 1) * width, index * width, (index + 1) * width],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
          });

          return (
            <Animated.View key={slide.id} style={[styles.slideContainer, { opacity }]}>
              <View style={[styles.iconCircle, { backgroundColor: `${slide.color}15`, borderColor: slide.color }]}>
                <Feather name={slide.iconName} size={48} color={slide.color} />
              </View>
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideDescription}>{slide.description}</Text>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Footer controls */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                activeSlide === i ? styles.dotActive : styles.dotInactive,
                activeSlide === i && { backgroundColor: slides[i].color }
              ]}
            />
          ))}
        </View>

        {/* Checkbox: Don't show again */}
        <TouchableOpacity
          style={[styles.checkboxRow, dontShowAgain && styles.checkboxRowActive]}
          onPress={() => { triggerHaptic(); setDontShowAgain(!dontShowAgain); }}
        >
          <View style={[styles.box, dontShowAgain && styles.boxChecked]}>
            {dontShowAgain && <Text style={styles.checkIcon}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Don't show this introduction again</Text>
        </TouchableOpacity>

        {/* Action Button */}
        <Animated.View style={{ width: '100%' }}>
          <TouchableOpacity
            onPressIn={() => setBtnPressed(true)}
            onPressOut={() => setBtnPressed(false)}
            onPress={handleNext}
            style={[
              styles.button,
              btnPressed ? styles.buttonActive : styles.buttonNormal
            ]}
          >
            <Text style={styles.buttonText}>
              {activeSlide === slides.length - 1 ? "GET STARTED  ➔" : "CONTINUE  ➔"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
  },
  blurBlobLeft: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primary,
    opacity: 0.08,
    position: 'absolute',
    top: -50,
    left: -100,
    zIndex: -1,
  },
  blurBlobRight: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.secondary,
    opacity: 0.06,
    position: 'absolute',
    bottom: 100,
    right: -100,
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  slideContainer: {
    width: width,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDescription: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
  dotInactive: {
    width: 8,
    backgroundColor: COLORS.border,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 20,
    backgroundColor: COLORS.surface,
  },
  checkboxRowActive: {
    borderColor: COLORS.primary,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  boxChecked: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkIcon: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  button: {
    height: 56,
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
