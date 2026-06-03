import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './store/authStore';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setAppLoading(false);
      }
    };

    initialize();
  }, []);

  if (appLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#075E54" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoading ? (
          <Stack.Screen name="Splash" component={() => <ActivityIndicator />} />
        ) : isAuthenticated ? (
          <Stack.Screen name="Home" component={() => <View style={{ flex: 1 }} />} />
        ) : (
          <Stack.Screen name="Auth" component={() => <View style={{ flex: 1 }} />} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
