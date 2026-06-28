import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { registerUser } from '../../services/auth';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
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
      Alert.alert('Success', 'Registration completed. Please sign in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Please check your inputs.');
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
            <Text style={styles.title}>Join VitalPath</Text>
            <Text style={styles.subtitle}>Begin tracking and analyzing your long-term health trajectory</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor="#475569"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 XXXXX XXXXX"
              placeholderTextColor="#475569"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Min 6 characters"
              placeholderTextColor="#475569"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
    marginVertical: 40,
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
