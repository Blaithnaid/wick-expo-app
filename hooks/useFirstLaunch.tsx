// async storage to check if the app is launched for the first time
//npm install @react-native-async-storage/async-storage
// app/_layout.tsx is where the hook is used

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useFirstLaunch() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunchedBefore = await AsyncStorage.getItem('hasLaunchedBefore');
        
        if (hasLaunchedBefore === null) {
          // First launch
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('hasLaunchedBefore', 'true');
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch', error);
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  return isFirstLaunch;
}