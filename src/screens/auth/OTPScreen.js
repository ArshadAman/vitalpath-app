import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { verifyOTP, sendOTP } from '../../services/auth';

export default function OTPScreen({ route, navigation, setToken }) {
  const { phoneNumber } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

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
    if (code.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit OTP code.');
      return;
    }
    setLoading(true);
    try {
      const data = await verifyOTP(phoneNumber, code);
      if (data.access_token) {
        setToken(data.access_token);
      }
    } catch (error) {
      Alert.alert('Verification Failed', error.message || 'The OTP entered is incorrect.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await sendOTP(phoneNumber);
      setResendTimer(30);
      Alert.alert('Success', 'A new verification code has been dispatched.');
    } catch (error) {
      Alert.alert('Error', error.message || 'Could not resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Phone</Text>
          <Text style={styles.subtitle}>Enter the 4-digit code sent to {phoneNumber}</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="0000"
            placeholderTextColor="#475569"
            keyboardType="number-pad"
            maxLength={4}
            value={code}
            onChangeText={setCode}
            autoFocus
          />

          <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Verify & Continue</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            {resendTimer > 0 ? (
              <Text style={styles.resendText}>Resend code in {resendTimer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={loading}>
                <Text style={styles.resendLink}>Resend OTP Code</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#f8fafc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 64,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 12,
    marginBottom: 24,
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
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#64748b',
  },
  resendLink: {
    fontSize: 14,
    color: '#38bdf8',
    fontWeight: '700',
  },
  backButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
});
