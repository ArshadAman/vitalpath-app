import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getStoredToken } from './src/services/auth';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const cachedToken = await getStoredToken();
        setToken(cachedToken);
      } catch (e) {
        console.warn('Failed to restore session token:', e);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator token={token} setToken={setToken} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
