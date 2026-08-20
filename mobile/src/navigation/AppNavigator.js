import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AppNavigator() {
  const { user, loading } = useAuth();

  // Checking stored token on app launch
  if (loading) return <LoadingSpinner />;

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
