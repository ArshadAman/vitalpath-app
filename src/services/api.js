import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// base API URL resolution based on device simulation layers or bundler connection
export const getBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:8000`;
  }
  
  if (Platform.OS === 'android') {
    // Android emulator fallback loops back to host via 10.0.2.2
    return 'http://10.0.2.2:8000';
  }
  // iOS Simulator or web fallback defaults to localhost
  return 'http://localhost:8000';
};

/**
 * Global HTTP request wrapper which handles JWT injection and error checking.
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${getBaseUrl()}${endpoint}`;
  
  let token = null;
  try {
    // Retrieve credentials securely from hardware Key Store
    token = await SecureStore.getItemAsync('user_token');
  } catch (error) {
    console.warn('Error reading secure token:', error);
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    
    let responseData = null;
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errorMsg = responseData?.detail || responseData || 'API Request Failed';
      throw new Error(errorMsg);
    }

    return responseData;
  } catch (error) {
    console.error(`Fetch failure on endpoint ${endpoint}:`, error);
    throw error;
  }
};
