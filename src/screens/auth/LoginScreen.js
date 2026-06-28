import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { loginUser, sendOTP } from '../../services/auth';

export default function LoginScreen({ navigation, setToken }) {
  const [authMode, setAuthMode] = useState('password'); // 'password' or 'otp'
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordLogin = async () => {
    if (!emailOrPhone) {
      Alert.alert('Validation Error', 'Please enter your email address or phone number.');
      return;
    }
    if (!password) {
      Alert.alert('Validation Error', 'Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const isEmail = emailOrPhone.includes('@');
      const emailParam = isEmail ? emailOrPhone : null;
      const phoneParam = !isEmail ? emailOrPhone : null;

      const data = await loginUser(emailParam, phoneParam, password);
      if (data.access_token) {
        setToken(data.access_token);
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone) {
      Alert.alert('Validation Error', 'Please enter your phone number.');
      return;
    }

    setLoading(true);
    try {
      await sendOTP(phone);
      navigation.navigate('OTP', { phoneNumber: phone });
    } catch (error) {
      Alert.alert('OTP Request Failed', error.message || 'Could not send verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>VitalPath</Text>
            <Text style={styles.subtitle}>Sign in to navigate your long-term health trajectory</Text>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, authMode === 'password' && styles.activeTab]}
              onPress={() => setAuthMode('password')}
            >
              <Text style={[styles.tabText, authMode === 'password' && styles.activeTabText]}>Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, authMode === 'otp' && styles.activeTab]}
              onPress={() => setAuthMode('otp')}
            >
              <Text style={[styles.tabText, authMode === 'otp' && styles.activeTabText]}>Phone OTP</Text>
            </TouchableOpacity>
          </View>

          {authMode === 'password' ? (
            <View style={styles.form}>
              <Text style={styles.label}>Email or Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com or +91..."
                placeholderTextColor="#475569"
                autoCapitalize="none"
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#475569"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity style={styles.button} onPress={handlePasswordLogin} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 XXXXX XXXXX"
                placeholderTextColor="#475569"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Send OTP Verification</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Sign Up</Text>
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
    backgroundColor: '#0f172a',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#f8fafc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 4,
    marginVertical: 32,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tab: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#0ea5e9',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94a3b8',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    height: 56,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#f8fafc',
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    height: 56,
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  footerLink: {
    fontSize: 14,
    color: '#38bdf8',
    fontWeight: '700',
  },
});
