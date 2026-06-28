import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { verifyOTP, sendOTP } from '../../services/auth';
import { COLORS } from '../../constants/theme';

export default function OTPScreen({ route, navigation, setToken }) {
  const { phoneNumber } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // Active focus tracking
  const [isFocused, setIsFocused] = useState(false);

  // Animation drivers
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const backScale = useRef(new Animated.Value(1)).current;

  // Mount animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 8,
        bounciness: 5,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const pressInBtn = (scaler) => {
    Animated.spring(scaler, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const pressOutBtn = (scaler) => {
    Animated.spring(scaler, {
      toValue: 1,
      tension: 120,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerify = async () => {
    triggerHaptic();
    if (code.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit OTP code.');
      return;
    }
    setLoading(true);
    try {
      const data = await verifyOTP(phoneNumber, code);
      if (data.access_token) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setToken(data.access_token);
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Verification Failed', error.message || 'The OTP entered is incorrect.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    triggerHaptic();
    setLoading(true);
    try {
      await sendOTP(phoneNumber);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setResendTimer(30);
      Alert.alert('Success', 'A new verification code has been dispatched.');
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error.message || 'Could not resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Background Glow Blobs */}
      <View style={styles.blurBlobLeft} />
      <View style={styles.blurBlobRight} />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Animated.View style={{ transform: [{ scale: backScale }], alignSelf: 'flex-start' }}>
            <TouchableOpacity 
              onPressIn={() => pressInBtn(backScale)}
              onPressOut={() => pressOutBtn(backScale)}
              onPress={() => { triggerHaptic(); navigation.goBack(); }} 
              style={styles.backArrow}
            >
              <Text style={styles.backArrowText}>🠔</Text>
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.title}>Verify Phone</Text>
          <Text style={styles.subtitle}>Enter the 4-digit code sent to {phoneNumber}</Text>
        </View>

        {/* Card Form */}
        <Animated.View style={[
          styles.card,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            style={[
              styles.input,
              isFocused && styles.inputFocused
            ]}
            placeholder="0000"
            placeholderTextColor="#94a3b8"
            keyboardType="number-pad"
            maxLength={4}
            value={code}
            onChangeText={setCode}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoFocus
          />

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity 
              onPressIn={() => pressInBtn(buttonScale)}
              onPressOut={() => pressOutBtn(buttonScale)}
              onPress={handleVerify}
              disabled={loading}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>VERIFY & CONTINUE</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.resendContainer}>
            {resendTimer > 0 ? (
              <Text style={styles.resendText}>Resend code in {resendTimer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={loading}>
                <Text style={styles.resendLink}>Resend OTP Code</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        <TouchableOpacity onPress={() => { triggerHaptic(); navigation.navigate('Login'); }} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 10,
  },
  backArrow: {
    marginBottom: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  backArrowText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    lineHeight: 22,
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 20,
    marginVertical: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    height: 64,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 16,
    paddingLeft: 16,
    marginBottom: 24,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  button: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primaryShadow,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  resendLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  backButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 15,
    color: COLORS.textMuted,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});
