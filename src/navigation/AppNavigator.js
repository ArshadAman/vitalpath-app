import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import HomeScreen from '../screens/dashboard/HomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ token, setToken }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token === null ? (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setToken={setToken} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="OTP">
              {(props) => <OTPScreen {...props} setToken={setToken} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} setToken={setToken} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
