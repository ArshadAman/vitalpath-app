import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { logoutUser } from '../../services/auth';

export default function HomeScreen({ setToken }) {
  const handleLogout = async () => {
    await logoutUser();
    setToken(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>VitalPath</Text>
          <Text style={styles.subtitle}>Personal Health Navigation System</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lifelong Timeline</Text>
          <Text style={styles.cardText}>
            Welcome! Your medical documents, lifestyle logs, and voice journals will form a unified timeline here.
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Active Session</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0ea5e9',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 22,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0ea5e920',
    borderWidth: 1,
    borderColor: '#0ea5e950',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginTop: 20,
  },
  badgeText: {
    fontSize: 12,
    color: '#38bdf8',
    fontWeight: '700',
  },
  button: {
    height: 56,
    backgroundColor: '#ef4444',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
