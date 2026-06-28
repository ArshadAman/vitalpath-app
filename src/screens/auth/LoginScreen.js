import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { loginUser, sendOTP } from '../../services/auth';
import { COLORS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const cardWidth = width - 40;
const tabWidth = (cardWidth - 40) / 2;

// Vector-perfect Google G logo
const GoogleLogo = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" style={{ marginRight: 10 }}>
    <Path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-.14 2.9-.82 3.9l3.25 2.5c1.9-1.7 3-4.3 3-7.33z"
    />
    <Path
      fill="#34A853"
      d="M12 24c3.24 0 5.97-1.07 7.96-2.9l-3.25-2.5c-.9.6-2 .97-3.25.97-3.13 0-5.78-2.1-6.73-4.94L3.4 17.16C5.37 21.08 9.4 24 12 24z"
    />
    <Path
      fill="#FBBC05"
      d="M5.27 14.63c-.25-.7-.39-1.5-.39-2.3 0-.8.14-1.6.39-2.3L2.1 7.53C1.3 9.1.88 10.97.88 12.9c0 1.93.42 3.8 1.22 5.37l3.17-2.64z"
    />
    <Path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.43-3.43C17.96 1.14 15.24 0 12 0 9.4 0 5.37 2.92 3.4 6.84l3.17 2.64c.95-2.84 3.6-4.93 6.73-4.93z"
    />
  </Svg>
);

export default function LoginScreen({ navigation, setToken }) {
  const [authMode, setAuthMode] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Focused fields states for glows
  const [focusedField, setFocusedField] = useState(null); // 'email', 'password', 'phone', 'code'

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const googleScale = useRef(new Animated.Value(1)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;

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

  const handleTabChange = (mode) => {
    triggerHaptic();
    setAuthMode(mode);
    Animated.spring(tabIndicatorAnim, {
      toValue: mode === 'email' ? 0 : 1,
      tension: 70,
      friction: 9,
      useNativeDriver: true,
    }).start();
  };

  // Button touch spring scales
  const pressInBtn = (scaler) => {
    Animated.spring(scaler, {
      toValue: 0.96,
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

  const handlePasswordLogin = async () => {
    triggerHaptic();
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your email address.');
      return;
    }
    if (!password) {
      Alert.alert('Validation Error', 'Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email, null, password);
      if (data.access_token) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setToken(data.access_token);
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Login Failed', error.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    triggerHaptic();
    if (!phone) {
      Alert.alert('Validation Error', 'Please enter your phone number.');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `${countryCode}${phone}`;
      await sendOTP(fullPhone);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate('OTP', { phoneNumber: fullPhone });
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('OTP Request Failed', error.message || 'Could not send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    triggerHaptic();
    Alert.alert('Google Sign-In', 'Simulating Google OAuth verification...');
  };

  const tabTranslateX = tabIndicatorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Decorative Blur Blobs */}
      <View style={styles.blurBlobLeft} />
      <View style={styles.blurBlobRight} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Logo / Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Feather name="activity" size={32} color="#ffffff" />
            </View>
            <Text style={styles.title}>VitalPath</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey.</Text>
          </View>

          {/* Form Card with mounting transitions */}
          <Animated.View style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => handleTabChange('email')}
              >
                <Text style={[styles.tabText, authMode === 'email' && styles.activeTabText]}>
                  Email
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.tab}
                onPress={() => handleTabChange('phone')}
              >
                <Text style={[styles.tabText, authMode === 'phone' && styles.activeTabText]}>
                  Phone OTP
                </Text>
              </TouchableOpacity>

              {/* Smooth Gliding Underline */}
              <Animated.View style={[
                styles.tabIndicator,
                { transform: [{ translateX: tabTranslateX }] }
              ]} />
            </View>

            {/* Email Form */}
            {authMode === 'email' ? (
              <View style={styles.form}>
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
                    placeholder="hello@vitalpath.com"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                <View style={styles.labelRow}>
                  <Text style={styles.label}>Password</Text>
                  <TouchableOpacity onPress={triggerHaptic}>
                    <Text style={styles.forgotLink}>Forgot?</Text>
                  </TouchableOpacity>
                </View>
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
                    style={[styles.input, { paddingRight: 48 }]}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity 
                    style={styles.visibleBtn}
                    onPress={() => { triggerHaptic(); setShowPassword(!showPassword); }}
                  >
                    <Feather 
                      name={showPassword ? "eye" : "eye-off"} 
                      size={18} 
                      color="#94a3b8" 
                    />
                  </TouchableOpacity>
                </View>

                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity 
                    onPressIn={() => pressInBtn(buttonScale)}
                    onPressOut={() => pressOutBtn(buttonScale)}
                    onPress={handlePasswordLogin}
                    disabled={loading}
                    style={styles.button}
                  >
                    {loading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.buttonText}>SIGN IN  ➔</Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>
            ) : (
              // Phone Form
              <View style={styles.form}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.phoneRow}>
                  <View style={[
                    styles.codeContainer,
                    focusedField === 'code' && styles.wrapperFocused
                  ]}>
                    <TextInput
                      style={styles.codeInput}
                      value={countryCode}
                      onChangeText={setCountryCode}
                      keyboardType="phone-pad"
                      maxLength={4}
                      onFocus={() => setFocusedField('code')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                  <View style={[
                    styles.inputWrapper,
                    { flex: 1 },
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
                      placeholder="(555) 123-4567"
                      placeholderTextColor="#94a3b8"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>

                <Text style={styles.helperText}>
                  We'll text you a secure code to confirm it's you.
                </Text>

                <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 'auto' }}>
                  <TouchableOpacity 
                    onPressIn={() => pressInBtn(buttonScale)}
                    onPressOut={() => pressOutBtn(buttonScale)}
                    onPress={handleSendOTP}
                    disabled={loading}
                    style={styles.button}
                  >
                    {loading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.buttonText}>SEND CODE  ✉</Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </Animated.View>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New to VitalPath? </Text>
            <TouchableOpacity onPress={() => { triggerHaptic(); navigation.navigate('Register'); }}>
              <Text style={styles.footerLink}>Create an account</Text>
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: googleScale }], width: '100%', marginTop: 8 }}>
              <TouchableOpacity 
                onPressIn={() => pressInBtn(googleScale)}
                onPressOut={() => pressOutBtn(googleScale)}
                onPress={handleGoogleSignIn}
                style={styles.googleButton}
              >
                <GoogleLogo />
                <Text style={styles.googleText}>Sign in with Google</Text>
              </TouchableOpacity>
            </Animated.View>
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
    marginTop: 10,
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
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 20,
    minHeight: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
    marginBottom: 24,
    position: 'relative',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    width: tabWidth,
    height: 4,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  forgotLink: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
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
  visibleBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primaryShadow,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 12,
  },
  codeContainer: {
    width: 80,
    height: 56,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  helperText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
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
    marginTop: 4,
    textDecorationLine: 'underline',
    marginBottom: 16,
  },
  googleButton: {
    height: 52,
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#dadce0',
    borderRadius: 26, // Rounded pill Google style
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3c4043',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
  },
});
