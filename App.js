import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
        <ActivityIndicator size="large" color="#2b6c00" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator token={token} setToken={setToken} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
