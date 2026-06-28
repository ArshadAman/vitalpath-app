import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { registerUser } from '../../services/auth';
import { COLORS } from '../../constants/theme';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Active focus tracking
  const [focusedField, setFocusedField] = useState(null); // 'email', 'phone', 'password'

  // Animation drivers
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

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

  const pressInBtn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const pressOutBtn = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      tension: 120,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleRegister = async () => {
    triggerHaptic();
    if (!email && !phone) {
      Alert.alert('Validation Error', 'Provide either an email address or a phone number.');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, phone, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Registration completed. Please sign in.', [
        { text: 'OK', onPress: () => { triggerHaptic(); navigation.navigate('Login'); } }
      ]);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Registration Failed', error.message || 'Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Background Glow Blobs */}
      <View style={styles.blurBlobLeft} />
      <View style={styles.blurBlobRight} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Feather name="activity" size={32} color="#ffffff" />
            </View>
            <Text style={styles.title}>Join VitalPath</Text>
            <Text style={styles.subtitle}>Begin tracking your health trajectory.</Text>
          </View>

          {/* Card Form with mounting transitions */}
          <Animated.View style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[
              styles.inputWrapper,
              focusedField === 'email' && styles.wrapperFocused
            ]}>
              <Feather 
                name="mail" 
                size={18} 
                color={focusedField === 'email' ? COLORS.primary : '#94a3b8'} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <Text style={styles.label}>Phone Number</Text>
            <View style={[
              styles.inputWrapper,
              focusedField === 'phone' && styles.wrapperFocused
            ]}>
              <Feather 
                name="phone" 
                size={18} 
                color={focusedField === 'phone' ? COLORS.primary : '#94a3b8'} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="+91 99999 99999"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={[
              styles.inputWrapper,
              focusedField === 'password' && styles.wrapperFocused
            ]}>
              <Feather 
                name="lock" 
                size={18} 
                color={focusedField === 'password' ? COLORS.primary : '#94a3b8'} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Minimum 6 characters"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity 
                onPressIn={pressInBtn}
                onPressOut={pressOutBtn}
                onPress={handleRegister}
                disabled={loading}
                style={styles.button}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => { triggerHaptic(); navigation.navigate('Login'); }}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primaryShadow,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 20,
    marginVertical: 10,
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
    marginBottom: 6,
    marginTop: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    width: '100%',
    marginBottom: 12,
  },
  wrapperFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    padding: 0,
  },
  button: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primaryShadow,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});
