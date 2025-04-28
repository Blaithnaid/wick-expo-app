// for onboarding 

// /app/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/services/AuthProvider'; // or wherever you keep auth
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StartScreen() {
  const router = useRouter();
  const { user } = useAuthContext(); // Assuming you have an auth context
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (!hasLaunched) {
          await AsyncStorage.setItem('hasLaunched', 'true');
          router.replace('/(auth)/onboarding');
        } else if (!user) {
          router.replace('/(auth)/login');
        } else {
          router.replace('/(tabs)/');
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null; // Nothing visible; just waiting for navigation
}


// await AsyncStorage.removeItem('hasLaunched');
// resets onboarding 